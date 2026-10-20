import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { RotateCw } from "lucide-react";

/**
 * Genuine 3D WebGL Chessboard & Engine Scene
 * - Procedural 8x8 checkered board with bevelled walnut border & brass inlays
 * - 3D turned chess pieces (King, Knight, Rook, Bishop, Pawns) in tactical layout
 * - Soft contact shadows on board tiles & floor shadow plane
 * - Balanced multi-point studio lighting
 * - Dynamic camera bounding-box auto-framing (never clipped on any viewport)
 * - Interactive pointer & touch dragging with inertia
 * - WebGL resource lifecycle & memory cleanup
 */
export default function Chess3DCanvas({
  interactive = true,
  autoRotate: initialAutoRotate = true,
  rotationSpeed = 0.18,
  showControls = true,
  className = ""
}) {
  const containerRef = useRef(null);
  const [isRotating, setIsRotating] = useState(initialAutoRotate);
  const isRotatingRef = useRef(initialAutoRotate);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsRotating(false);
      isRotatingRef.current = false;
    }

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Container sizing helper
    const getContainerSize = () => {
      const rect = container.getBoundingClientRect();
      const parentRect = container.parentElement ? container.parentElement.getBoundingClientRect() : rect;
      const w = rect.width > 20 ? rect.width : (parentRect.width > 20 ? parentRect.width : 400);
      const h = rect.height > 20 ? rect.height : (parentRect.height > 20 ? parentRect.height : 250);
      return { w, h };
    };

    const initialSize = getContainerSize();
    const camera = new THREE.PerspectiveCamera(38, initialSize.w / initialSize.h, 0.1, 80);

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(initialSize.w, initialSize.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (High-end Tournament Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4cebf, 0.65);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Key Directional Light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(4.5, 7.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -3.5;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 2.2;
    scene.add(keyLight);

    // Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.8);
    fillLight.position.set(-4.5, 3.5, -3);
    scene.add(fillLight);

    // Rim Light (Accents piece edges)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(0, 5, -5.5);
    scene.add(rimLight);

    // 5. Materials
    const lightTileMat = new THREE.MeshStandardMaterial({
      color: 0xf5eedc,
      roughness: 0.35,
      metalness: 0.05
    });

    const darkTileMat = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.4,
      metalness: 0.1
    });

    const borderWoodMat = new THREE.MeshStandardMaterial({
      color: 0x271910,
      roughness: 0.45,
      metalness: 0.08
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc89d58,
      roughness: 0.25,
      metalness: 0.82
    });

    const whitePieceMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f1,
      roughness: 0.28,
      metalness: 0.08
    });

    const blackPieceMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.22,
      metalness: 0.32
    });

    const activeSquareMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x15803d,
      emissiveIntensity: 0.35
    });

    // 6. Master Chess Scene Group
    const chessGroup = new THREE.Group();
    scene.add(chessGroup);

    // A. 3D Chessboard Construction
    const tileSize = 0.52;
    const boardWidth = tileSize * 8; // 4.16
    const boardHeight = 0.22;

    // Base plinth underneath
    const baseGeo = new THREE.BoxGeometry(boardWidth + 0.6, boardHeight, boardWidth + 0.6);
    const baseMesh = new THREE.Mesh(baseGeo, borderWoodMat);
    baseMesh.position.y = boardHeight / 2;
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    chessGroup.add(baseMesh);

    // Brass inlay trim ring around board perimeter
    const brassTrimGeo = new THREE.BoxGeometry(boardWidth + 0.08, 0.02, boardWidth + 0.08);
    const brassTrimMesh = new THREE.Mesh(brassTrimGeo, brassMat);
    brassTrimMesh.position.y = boardHeight + 0.01;
    chessGroup.add(brassTrimMesh);

    // 64 Individual 3D Tiles
    const tileGeo = new THREE.BoxGeometry(tileSize * 0.98, 0.04, tileSize * 0.98);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        // Highlight active engine move square (e.g. e4 or d5 outpost)
        const isTacticalTarget = (r === 4 && c === 4) || (r === 2 && c === 5);
        const mat = isTacticalTarget ? activeSquareMat : isDark ? darkTileMat : lightTileMat;

        const tileMesh = new THREE.Mesh(tileGeo, mat);
        const posX = (c - 3.5) * tileSize;
        const posZ = (r - 3.5) * tileSize;
        tileMesh.position.set(posX, boardHeight + 0.02, posZ);
        tileMesh.receiveShadow = true;
        chessGroup.add(tileMesh);
      }
    }

    // B. Procedural Turned Chess Pieces
    const pieceGeos = [];

    // Helper: Turned Pawn
    const createPawn = (mat) => {
      const g = new THREE.Group();
      // Base
      const b1 = new THREE.CylinderGeometry(0.18, 0.2, 0.06, 20);
      const m1 = new THREE.Mesh(b1, mat);
      m1.position.y = 0.03;
      m1.castShadow = true;
      m1.receiveShadow = true;
      g.add(m1);
      // Shaft
      const b2 = new THREE.CylinderGeometry(0.11, 0.16, 0.22, 20);
      const m2 = new THREE.Mesh(b2, mat);
      m2.position.y = 0.16;
      m2.castShadow = true;
      g.add(m2);
      // Collar
      const b3 = new THREE.TorusGeometry(0.12, 0.025, 12, 20);
      b3.rotateX(Math.PI / 2);
      const m3 = new THREE.Mesh(b3, mat);
      m3.position.y = 0.27;
      m3.castShadow = true;
      g.add(m3);
      // Head sphere
      const b4 = new THREE.SphereGeometry(0.11, 20, 20);
      const m4 = new THREE.Mesh(b4, mat);
      m4.position.y = 0.38;
      m4.castShadow = true;
      g.add(m4);
      return g;
    };

    // Helper: Turned Knight
    const createKnight = (mat) => {
      const g = new THREE.Group();
      // Base
      const b1 = new THREE.CylinderGeometry(0.19, 0.21, 0.07, 20);
      const m1 = new THREE.Mesh(b1, mat);
      m1.position.y = 0.035;
      m1.castShadow = true;
      g.add(m1);
      // Angled neck
      const b2 = new THREE.CylinderGeometry(0.13, 0.17, 0.3, 16);
      const m2 = new THREE.Mesh(b2, mat);
      m2.position.set(0, 0.21, 0.03);
      m2.rotation.x = 0.15;
      m2.castShadow = true;
      g.add(m2);
      // Head/Muzzle block
      const b3 = new THREE.BoxGeometry(0.18, 0.2, 0.24);
      const m3 = new THREE.Mesh(b3, mat);
      m3.position.set(0, 0.38, 0.07);
      m3.rotation.x = 0.25;
      m3.castShadow = true;
      g.add(m3);
      // Ears
      const b4 = new THREE.ConeGeometry(0.04, 0.1, 10);
      const m4 = new THREE.Mesh(b4, mat);
      m4.position.set(-0.06, 0.51, 0.04);
      m4.castShadow = true;
      g.add(m4);
      const m4b = new THREE.Mesh(b4, mat);
      m4b.position.set(0.06, 0.51, 0.04);
      m4b.castShadow = true;
      g.add(m4b);
      return g;
    };

    // Helper: Turned Rook
    const createRook = (mat) => {
      const g = new THREE.Group();
      // Base
      const b1 = new THREE.CylinderGeometry(0.2, 0.22, 0.08, 20);
      const m1 = new THREE.Mesh(b1, mat);
      m1.position.y = 0.04;
      m1.castShadow = true;
      g.add(m1);
      // Pillar
      const b2 = new THREE.CylinderGeometry(0.15, 0.18, 0.32, 20);
      const m2 = new THREE.Mesh(b2, mat);
      m2.position.y = 0.22;
      m2.castShadow = true;
      g.add(m2);
      // Castle top
      const b3 = new THREE.CylinderGeometry(0.19, 0.17, 0.14, 20);
      const m3 = new THREE.Mesh(b3, mat);
      m3.position.y = 0.44;
      m3.castShadow = true;
      g.add(m3);
      return g;
    };

    // Helper: Turned King
    const createKing = (mat) => {
      const g = new THREE.Group();
      // Base
      const b1 = new THREE.CylinderGeometry(0.22, 0.24, 0.08, 24);
      const m1 = new THREE.Mesh(b1, mat);
      m1.position.y = 0.04;
      m1.castShadow = true;
      g.add(m1);
      // Lower shaft
      const b2 = new THREE.CylinderGeometry(0.14, 0.19, 0.26, 20);
      const m2 = new THREE.Mesh(b2, mat);
      m2.position.y = 0.21;
      m2.castShadow = true;
      g.add(m2);
      // Torus waist
      const b3 = new THREE.TorusGeometry(0.16, 0.03, 12, 24);
      b3.rotateX(Math.PI / 2);
      const m3 = new THREE.Mesh(b3, mat);
      m3.position.y = 0.35;
      m3.castShadow = true;
      g.add(m3);
      // Crown dome
      const b4 = new THREE.SphereGeometry(0.15, 20, 20);
      const m4 = new THREE.Mesh(b4, mat);
      m4.position.y = 0.5;
      m4.castShadow = true;
      g.add(m4);
      // Cross Finial
      const b5 = new THREE.BoxGeometry(0.04, 0.12, 0.04);
      const m5 = new THREE.Mesh(b5, brassMat);
      m5.position.y = 0.67;
      m5.castShadow = true;
      g.add(m5);
      const b6 = new THREE.BoxGeometry(0.1, 0.035, 0.04);
      const m6 = new THREE.Mesh(b6, brassMat);
      m6.position.y = 0.69;
      m6.castShadow = true;
      g.add(m6);
      return g;
    };

    // Helper: Turned Bishop
    const createBishop = (mat) => {
      const g = new THREE.Group();
      // Base
      const b1 = new THREE.CylinderGeometry(0.19, 0.21, 0.07, 20);
      const m1 = new THREE.Mesh(b1, mat);
      m1.position.y = 0.035;
      m1.castShadow = true;
      g.add(m1);
      // Shaft
      const b2 = new THREE.CylinderGeometry(0.12, 0.16, 0.32, 20);
      const m2 = new THREE.Mesh(b2, mat);
      m2.position.y = 0.21;
      m2.castShadow = true;
      g.add(m2);
      // Teardrop mitre
      const b3 = new THREE.SphereGeometry(0.13, 20, 20);
      b3.scale(0.9, 1.3, 0.9);
      const m3 = new THREE.Mesh(b3, mat);
      m3.position.y = 0.45;
      m3.castShadow = true;
      g.add(m3);
      // Finial ball
      const b4 = new THREE.SphereGeometry(0.04, 12, 12);
      const m4 = new THREE.Mesh(b4, brassMat);
      m4.position.y = 0.62;
      m4.castShadow = true;
      g.add(m4);
      return g;
    };

    // Tactical Mid-Game Board Deployment
    const placePiece = (pieceGroup, r, c, yOffset = 0) => {
      pieceGroup.position.set(
        (c - 3.5) * tileSize,
        boardHeight + 0.04 + yOffset,
        (r - 3.5) * tileSize
      );
      chessGroup.add(pieceGroup);
      return pieceGroup;
    };

    // White army (bottom ranks r=6, 7)
    const whiteKing = placePiece(createKing(whitePieceMat), 7, 4);
    const whiteRook = placePiece(createRook(whitePieceMat), 7, 0);
    const whiteBishop = placePiece(createBishop(whitePieceMat), 7, 2);
    // White Knight on aggressive active outpost (e4 / r=4, c=4!)
    const heroKnight = placePiece(createKnight(whitePieceMat), 4, 4);
    heroKnight.rotation.y = -Math.PI * 0.2; // Angled forward facing enemy lines

    // White pawn chain
    placePiece(createPawn(whitePieceMat), 6, 0);
    placePiece(createPawn(whitePieceMat), 6, 1);
    placePiece(createPawn(whitePieceMat), 6, 2);
    placePiece(createPawn(whitePieceMat), 5, 3); // d4 pawn push
    placePiece(createPawn(whitePieceMat), 6, 5);
    placePiece(createPawn(whitePieceMat), 6, 6);
    placePiece(createPawn(whitePieceMat), 6, 7);

    // Black army (top ranks r=0, 1)
    const blackKing = placePiece(createKing(blackPieceMat), 0, 4);
    blackKing.rotation.y = Math.PI;
    const blackRook = placePiece(createRook(blackPieceMat), 0, 7);
    blackRook.rotation.y = Math.PI;
    const blackKnight = placePiece(createKnight(blackPieceMat), 2, 5); // Target square
    blackKnight.rotation.y = Math.PI * 0.8;
    const blackBishop = placePiece(createBishop(blackPieceMat), 1, 2);
    blackBishop.rotation.y = Math.PI;

    // Black pawns
    placePiece(createPawn(blackPieceMat), 1, 0);
    placePiece(createPawn(blackPieceMat), 1, 1);
    placePiece(createPawn(blackPieceMat), 3, 2); // c5 Sicilian push
    placePiece(createPawn(blackPieceMat), 2, 3); // d6
    placePiece(createPawn(blackPieceMat), 1, 6);
    placePiece(createPawn(blackPieceMat), 1, 7);

    // C. Soft Floor Contact Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    const gradient = sCtx.createRadialGradient(128, 128, 30, 128, 128, 126);
    gradient.addColorStop(0, "rgba(23, 23, 23, 0.38)");
    gradient.addColorStop(0.5, "rgba(23, 23, 23, 0.12)");
    gradient.addColorStop(0.8, "rgba(23, 23, 23, 0.02)");
    gradient.addColorStop(1, "rgba(23, 23, 23, 0)");
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(6.5, 6.5);
    shadowPlaneGeo.rotateX(-Math.PI / 2);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const shadowPlaneMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlaneMesh.position.y = 0.005;
    scene.add(shadowPlaneMesh);

    // 7. Dynamic Camera Auto-Fit to Model Bounding Box
    const fitCameraToBoard = (curWidth, curHeight) => {
      if (curWidth <= 0 || curHeight <= 0) return;
      const box = new THREE.Box3().setFromObject(chessGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.z, size.y * 1.5);
      const aspect = curWidth / curHeight;
      const fovRad = (camera.fov * Math.PI) / 180;
      let dist = (maxDim / 2) / Math.tan(fovRad / 2);

      if (aspect < 1.0) {
        dist *= (1.0 / aspect) * 1.05;
      } else if (aspect < 1.6) {
        dist *= (1.55 / aspect) * 0.98;
      } else {
        dist *= 1.12;
      }

      // Isometric-like elevation angle (40° elevation)
      const elev = 0.72;
      camera.position.set(
        center.x + Math.sin(0.4) * dist,
        center.y + Math.sin(elev) * dist,
        center.z + Math.cos(0.4) * dist
      );
      camera.lookAt(center.x, center.y + 0.15, center.z);
      camera.updateProjectionMatrix();
    };

    fitCameraToBoard(initialSize.w, initialSize.h);

    // Initial orientation
    chessGroup.rotation.y = 0.35;

    // 8. Interactive Dragging & Mouse Parallax
    let targetRotY = 0.35;
    let targetRotX = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let isUserDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const onPointerMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      isHovering = true;

      if (isUserDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        targetRotY += deltaX * 0.007;
        targetRotX = Math.max(-0.25, Math.min(0.35, targetRotX + deltaY * 0.004));
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const onPointerDown = (e) => {
      if (!interactive) return;
      isUserDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      container.style.cursor = "grabbing";
    };

    const onPointerUp = () => {
      isUserDragging = false;
      container.style.cursor = interactive ? "grab" : "default";
    };

    const onPointerLeave = () => {
      isHovering = false;
      isUserDragging = false;
      mouseX = 0;
      mouseY = 0;
      container.style.cursor = interactive ? "grab" : "default";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerLeave);

    // Mobile Touch Events
    const onTouchStart = (e) => {
      if (!interactive || e.touches.length === 0) return;
      isUserDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (!interactive || !isUserDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      targetRotY += deltaX * 0.009;
      targetRotX = Math.max(-0.25, Math.min(0.35, targetRotX + deltaY * 0.005));
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isUserDragging = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    // 9. Animation & Delta-Time Loop
    const clock = new THREE.Clock();
    let animId = null;
    let isTabVisible = true;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.getDelta();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const delta = clock.getDelta();

      if (isRotatingRef.current && !isUserDragging) {
        targetRotY += delta * rotationSpeed;
      }

      const targetParallaxX = isUserDragging ? targetRotX : -mouseY * 0.08;
      const targetParallaxY = isUserDragging ? targetRotY : isHovering ? targetRotY + mouseX * 0.2 : targetRotY;

      chessGroup.rotation.y += (targetParallaxY - chessGroup.rotation.y) * 0.08;
      chessGroup.rotation.x += (targetParallaxX - chessGroup.rotation.x) * 0.08;

      // Subtle breath hover on hero knight
      heroKnight.position.y = boardHeight + 0.04 + Math.sin(clock.getElapsedTime() * 2) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Robust ResizeObserver with Immediate Layout Catch
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 20 && newH > 20) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          fitCameraToBoard(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    const checkTimer = setTimeout(() => {
      const size = getContainerSize();
      if (size.w > 20 && size.h > 20) {
        camera.aspect = size.w / size.h;
        camera.updateProjectionMatrix();
        renderer.setSize(size.w, size.h);
        fitCameraToBoard(size.w, size.h);
      }
    }, 100);

    // 11. Cleanup
    return () => {
      clearTimeout(checkTimer);
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      resizeObserver.disconnect();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      baseGeo.dispose();
      brassTrimGeo.dispose();
      tileGeo.dispose();
      shadowPlaneGeo.dispose();
      shadowTexture.dispose();

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [interactive, rotationSpeed]);

  const toggleRotation = (e) => {
    e.stopPropagation();
    setIsRotating((prev) => !prev);
  };

  return (
    <div
      className={`chess-3d-canvas-wrapper ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F5F2EA 65%, #E9E4D7 100%)",
        overflow: "hidden"
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          cursor: interactive ? "grab" : "default",
          touchAction: "none"
        }}
      />

      {/* Chess Telemetry Badges */}
      {showControls && (
        <div className="dome-3d-overlay-ui">
          <div className="dome-spec-badge" style={{ background: "rgba(255, 255, 255, 0.9)", border: "1px solid #E5E3DD", color: "#202124", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.74rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(32, 33, 36, 0.06)" }}>
            <span className="spec-dot" style={{ background: "#8B5CF6", width: "6px", height: "6px", borderRadius: "50%" }} />
            <span>3D WebGL Chess · Minimax AI</span>
          </div>

          <div className="dome-ctrl-group">
            <button
              type="button"
              onClick={toggleRotation}
              className={`dome-tool-btn ${isRotating ? "active" : ""}`}
              style={{ background: "rgba(255, 255, 255, 0.9)", border: "1px solid #E5E3DD", color: "#202124", padding: "4px 12px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(32, 33, 36, 0.06)", cursor: "pointer" }}
              title={isRotating ? "Pause rotation" : "Resume rotation"}
              aria-label="Toggle board rotation"
            >
              <RotateCw size={12} className={isRotating ? "spin-icon" : ""} />
              <span>{isRotating ? "Rotating" : "Paused"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Drag Hint */}
      {interactive && (
        <div className="dome-drag-hint" style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(255, 255, 255, 0.9)", border: "1px solid #E5E3DD", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.7rem", color: "#5F6368", fontWeight: "500", boxShadow: "0 2px 6px rgba(32, 33, 36, 0.04)" }}>
          <span>Drag to rotate chessboard</span>
        </div>
      )}
    </div>
  );
}

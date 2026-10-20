import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { RotateCw, Sun, Moon, Sparkles, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

/**
 * World-Class 3D Architectural Rotunda & Dome WebGL Experience
 * - Complete neoclassical peristyle rotunda with stepped marble plinth
 * - 8 Corinthian colonnade arches with fluted columns, ornate capitals & brass keystones
 * - Ribbed vaulted dome with coffered inner ceiling rings & glowing oculus skylight
 * - Levitating kinetic geometric core (crystalline octahedron with brass orbital rings)
 * - Ethereal floating light dust particles drifting through the colonnade
 * - 3 Real-time lighting modes: Neoclassical Daylight, Golden Hour Sunset, and Cyber Obsidian Night
 * - Interactive camera orbit, smooth drag inertia, zoom controls, and responsive auto-framing
 */
export default function ArchDomeCanvas({
  interactive = true,
  autoRotate: initialAutoRotate = true,
  rotationSpeed = 0.22,
  showControls = true,
  transparentBg = false,
  className = ""
}) {
  const containerRef = useRef(null);
  const [isRotating, setIsRotating] = useState(initialAutoRotate);
  const isRotatingRef = useRef(initialAutoRotate);
  const [lightingMode, setLightingMode] = useState("daylight"); // "daylight" | "sunset" | "obsidian"
  const lightingModeRef = useRef("daylight");
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomLevelRef = useRef(1);

  // Sync refs
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    lightingModeRef.current = lightingMode;
  }, [lightingMode]);

  useEffect(() => {
    zoomLevelRef.current = zoomLevel;
  }, [zoomLevel]);

  // Lighting mode switcher
  const cycleLightingMode = () => {
    setLightingMode((prev) => {
      if (prev === "daylight") return "sunset";
      if (prev === "sunset") return "obsidian";
      return "daylight";
    });
  };

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

    // 2. Camera Setup with robust fallback sizing
    const getContainerSize = () => {
      const rect = container.getBoundingClientRect();
      const parentRect = container.parentElement ? container.parentElement.getBoundingClientRect() : rect;
      const w = rect.width > 20 ? rect.width : (parentRect.width > 20 ? parentRect.width : 500);
      const h = rect.height > 20 ? rect.height : (parentRect.height > 20 ? parentRect.height : 450);
      return { w, h };
    };

    const initialSize = getContainerSize();
    const camera = new THREE.PerspectiveCamera(35, initialSize.w / initialSize.h, 0.1, 80);

    // 3. WebGL Renderer with High-Precision Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(initialSize.w, initialSize.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfffaf0, 1.1);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfffdfa, 0xd4cebf, 0.7);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    // Key Directional Sun
    const sunLight = new THREE.DirectionalLight(0xfff6e8, 2.5);
    sunLight.position.set(6, 9, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.camera.left = -4.5;
    sunLight.shadow.camera.right = 4.5;
    sunLight.shadow.camera.top = 5;
    sunLight.shadow.camera.bottom = -2;
    sunLight.shadow.bias = -0.0003;
    sunLight.shadow.radius = 2.4;
    scene.add(sunLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0eaff, 0.85);
    fillLight.position.set(-5.5, 4, -3);
    scene.add(fillLight);

    // Rim Silhouette Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 6, -7);
    scene.add(rimLight);

    // Oculus Downlight (Simulates direct sunlight beam through the open crown)
    const oculusSpot = new THREE.PointLight(0xfff5dd, 2.2, 8, 1.2);
    oculusSpot.position.set(0, 4.2, 0);
    scene.add(oculusSpot);

    // 5. Materials
    const marbleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f3ed,
      roughness: 0.42,
      metalness: 0.06
    });

    const travertineMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfd8cc,
      roughness: 0.58,
      metalness: 0.08
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xc89d58,
      roughness: 0.22,
      metalness: 0.85
    });

    const coreCrystalMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0xc89d58,
      emissiveIntensity: 0.15
    });

    // 6. Master Architectural Group
    const domeGroup = new THREE.Group();
    scene.add(domeGroup);

    // A. Stepped Circular Plinth (Base) with Gilded Inlay Rings
    const baseTiers = [
      { rTop: 2.65, rBot: 2.74, h: 0.15, y: 0.075, mat: travertineMaterial },
      { rTop: 2.48, rBot: 2.54, h: 0.13, y: 0.215, mat: marbleMaterial },
      { rTop: 2.32, rBot: 2.38, h: 0.11, y: 0.335, mat: marbleMaterial }
    ];

    baseTiers.forEach((t) => {
      const geo = new THREE.CylinderGeometry(t.rTop, t.rBot, t.h, 64);
      const mesh = new THREE.Mesh(geo, t.mat);
      mesh.position.y = t.y;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      domeGroup.add(mesh);

      // Bevel torus edge
      const bevelGeo = new THREE.TorusGeometry(t.rTop, 0.016, 12, 64);
      bevelGeo.rotateX(Math.PI / 2);
      const bevelMesh = new THREE.Mesh(bevelGeo, travertineMaterial);
      bevelMesh.position.y = t.y + t.h / 2;
      domeGroup.add(bevelMesh);
    });

    // Decorative Gilded Inlay Ring on Stylobate
    const brassRingGeo = new THREE.TorusGeometry(2.32, 0.022, 16, 64);
    brassRingGeo.rotateX(Math.PI / 2);
    const brassRingMesh = new THREE.Mesh(brassRingGeo, brassMaterial);
    brassRingMesh.position.y = 0.395;
    domeGroup.add(brassRingMesh);

    // B. Classical Colonnade with 8 Monumental Arches
    const NUM_ARCHES = 8;
    const colonnadeRadius = 1.92;
    const columnHeight = 1.42;
    const columnRadius = 0.078;
    const colonnadeGroup = new THREE.Group();
    colonnadeGroup.position.y = 0.395;
    domeGroup.add(colonnadeGroup);

    for (let i = 0; i < NUM_ARCHES; i++) {
      const angle = (i * Math.PI * 2) / NUM_ARCHES;
      const nextAngle = ((i + 1) * Math.PI * 2) / NUM_ARCHES;
      const midAngle = (angle + nextAngle) / 2;

      const colX = Math.cos(angle) * colonnadeRadius;
      const colZ = Math.sin(angle) * colonnadeRadius;

      // Fluted Entasis Column Shaft
      const colGeo = new THREE.CylinderGeometry(
        columnRadius * 0.9,
        columnRadius * 1.06,
        columnHeight,
        28
      );
      const colMesh = new THREE.Mesh(colGeo, marbleMaterial);
      colMesh.position.set(colX, columnHeight / 2, colZ);
      colMesh.castShadow = true;
      colMesh.receiveShadow = true;
      colonnadeGroup.add(colMesh);

      // Tuscan Torus Base
      const colBaseGeo = new THREE.CylinderGeometry(columnRadius * 1.5, columnRadius * 1.62, 0.09, 20);
      const colBaseMesh = new THREE.Mesh(colBaseGeo, travertineMaterial);
      colBaseMesh.position.set(colX, 0.045, colZ);
      colBaseMesh.castShadow = true;
      colonnadeGroup.add(colBaseMesh);

      const colTorusGeo = new THREE.TorusGeometry(columnRadius * 1.3, 0.02, 12, 20);
      colTorusGeo.rotateX(Math.PI / 2);
      const colTorusMesh = new THREE.Mesh(colTorusGeo, brassMaterial);
      colTorusMesh.position.set(colX, 0.09, colZ);
      colonnadeGroup.add(colTorusMesh);

      // Corinthian Gilded Capital
      const colCapGeo = new THREE.CylinderGeometry(columnRadius * 1.52, columnRadius * 1.08, 0.1, 20);
      const colCapMesh = new THREE.Mesh(colCapGeo, brassMaterial);
      colCapMesh.position.set(colX, columnHeight + 0.05, colZ);
      colCapMesh.castShadow = true;
      colonnadeGroup.add(colCapMesh);

      // Arch Portal
      const span = 2 * colonnadeRadius * Math.sin(Math.PI / NUM_ARCHES);
      const archRadius = span / 2;
      const archTube = 0.068;
      const archGeo = new THREE.TorusGeometry(archRadius, archTube, 16, 32, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, marbleMaterial);

      const archCenterX = Math.cos(midAngle) * (colonnadeRadius * Math.cos(Math.PI / NUM_ARCHES));
      const archCenterZ = Math.sin(midAngle) * (colonnadeRadius * Math.cos(Math.PI / NUM_ARCHES));

      archMesh.position.set(archCenterX, columnHeight + 0.1, archCenterZ);
      archMesh.rotation.y = -midAngle + Math.PI / 2;
      archMesh.castShadow = true;
      archMesh.receiveShadow = true;
      colonnadeGroup.add(archMesh);

      // Chamfered Brass Keystone Block
      const keystoneGeo = new THREE.BoxGeometry(0.13, 0.18, archTube * 2.4);
      const keystoneMesh = new THREE.Mesh(keystoneGeo, brassMaterial);
      keystoneMesh.position.set(archCenterX, columnHeight + 0.1 + archRadius + 0.02, archCenterZ);
      keystoneMesh.rotation.y = -midAngle + Math.PI / 2;
      keystoneMesh.castShadow = true;
      colonnadeGroup.add(keystoneMesh);
    }

    // C. Continuous Entablature Ring
    const archRadiusSpan = colonnadeRadius * Math.sin(Math.PI / NUM_ARCHES);
    const entablatureY = 0.395 + columnHeight + 0.1 + archRadiusSpan + 0.06;

    const architraveGeo = new THREE.CylinderGeometry(colonnadeRadius + 0.1, colonnadeRadius + 0.1, 0.13, 64);
    const architraveMesh = new THREE.Mesh(architraveGeo, travertineMaterial);
    architraveMesh.position.y = entablatureY;
    architraveMesh.castShadow = true;
    architraveMesh.receiveShadow = true;
    domeGroup.add(architraveMesh);

    const corniceGeo = new THREE.CylinderGeometry(colonnadeRadius + 0.24, colonnadeRadius + 0.08, 0.13, 64);
    const corniceMesh = new THREE.Mesh(corniceGeo, marbleMaterial);
    corniceMesh.position.y = entablatureY + 0.13;
    corniceMesh.castShadow = true;
    corniceMesh.receiveShadow = true;
    domeGroup.add(corniceMesh);

    const corniceFilletGeo = new THREE.TorusGeometry(colonnadeRadius + 0.24, 0.022, 16, 64);
    corniceFilletGeo.rotateX(Math.PI / 2);
    const corniceFilletMesh = new THREE.Mesh(corniceFilletGeo, brassMaterial);
    corniceFilletMesh.position.y = entablatureY + 0.195;
    domeGroup.add(corniceFilletMesh);

    // D. The Ribbed Vaulted Dome
    const domeBaseY = entablatureY + 0.195;
    const domeRadius = colonnadeRadius + 0.08;

    // Outer Marble Shell
    const domeShellGeo = new THREE.SphereGeometry(
      domeRadius,
      64,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.44
    );
    const domeShellMesh = new THREE.Mesh(domeShellGeo, marbleMaterial);
    domeShellMesh.position.y = domeBaseY;
    domeShellMesh.castShadow = true;
    domeShellMesh.receiveShadow = true;
    domeGroup.add(domeShellMesh);

    // Inner Coffered Shell
    const innerDomeGeo = new THREE.SphereGeometry(
      domeRadius - 0.08,
      48,
      24,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.44
    );
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6e0d5,
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.BackSide
    });
    const innerDomeMesh = new THREE.Mesh(innerDomeGeo, innerMaterial);
    innerDomeMesh.position.y = domeBaseY;
    innerDomeMesh.receiveShadow = true;
    domeGroup.add(innerDomeMesh);

    // Coffered Ceiling Rings
    [0.15, 0.28].forEach((pct) => {
      const cofferRadius = (domeRadius - 0.08) * Math.sin(Math.PI * pct);
      const cofferHeight = (domeRadius - 0.08) * Math.cos(Math.PI * pct);
      const ringGeo = new THREE.TorusGeometry(cofferRadius, 0.022, 12, 48);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, brassMaterial);
      ringMesh.position.y = domeBaseY + cofferHeight;
      domeGroup.add(ringMesh);
    });

    // 8 Structural Exterior Ribs
    const NUM_RIBS = 8;
    for (let r = 0; r < NUM_RIBS; r++) {
      const ribAngle = (r * Math.PI * 2) / NUM_RIBS;
      const ribCurveRadius = domeRadius + 0.038;
      const ribTube = 0.048;
      const ribGeo = new THREE.TorusGeometry(ribCurveRadius, ribTube, 16, 32, Math.PI * 0.44);

      const ribMesh = new THREE.Mesh(ribGeo, brassMaterial);
      ribMesh.position.y = domeBaseY;
      ribMesh.rotation.z = Math.PI / 2;
      ribMesh.rotation.y = ribAngle;
      ribMesh.castShadow = true;
      domeGroup.add(ribMesh);
    }

    // Oculus Ring at Crown
    const oculusRingRadius = domeRadius * Math.sin(0.44 * Math.PI);
    const oculusTorusGeo = new THREE.TorusGeometry(oculusRingRadius, 0.078, 20, 64);
    oculusTorusGeo.rotateX(Math.PI / 2);
    const oculusTorusMesh = new THREE.Mesh(oculusTorusGeo, brassMaterial);
    oculusTorusMesh.position.y = domeBaseY + Math.cos(Math.PI * 0.44) * domeRadius;
    oculusTorusMesh.castShadow = true;
    domeGroup.add(oculusTorusMesh);

    // Skylight Glass Disc
    const skylightGeo = new THREE.CircleGeometry(oculusRingRadius - 0.025, 32);
    skylightGeo.rotateX(-Math.PI / 2);
    const skylightMat = new THREE.MeshBasicMaterial({
      color: 0xfffaea,
      transparent: true,
      opacity: 0.88
    });
    const skylightMesh = new THREE.Mesh(skylightGeo, skylightMat);
    skylightMesh.position.y = oculusTorusMesh.position.y + 0.01;
    domeGroup.add(skylightMesh);

    // E. Central Floating Crystalline Octahedron & Kinetic Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.88, 32);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, travertineMaterial);
    pedestalMesh.position.y = 0.395 + 0.88 / 2;
    pedestalMesh.castShadow = true;
    pedestalMesh.receiveShadow = true;
    domeGroup.add(pedestalMesh);

    const pedestalRingGeo = new THREE.TorusGeometry(0.43, 0.02, 16, 32);
    pedestalRingGeo.rotateX(Math.PI / 2);
    const pedestalRingMesh = new THREE.Mesh(pedestalRingGeo, brassMaterial);
    pedestalRingMesh.position.y = 0.395 + 0.88;
    domeGroup.add(pedestalRingMesh);

    const coreGeo = new THREE.OctahedronGeometry(0.26, 0);
    const coreMesh = new THREE.Mesh(coreGeo, coreCrystalMaterial);
    coreMesh.position.y = 0.395 + 0.88 + 0.32;
    coreMesh.rotation.y = Math.PI / 4;
    coreMesh.castShadow = true;
    domeGroup.add(coreMesh);

    const coreAccentRing1 = new THREE.TorusGeometry(0.36, 0.02, 16, 32);
    coreAccentRing1.rotateX(Math.PI / 2);
    const coreAccentMesh1 = new THREE.Mesh(coreAccentRing1, brassMaterial);
    coreAccentMesh1.position.y = coreMesh.position.y;
    domeGroup.add(coreAccentMesh1);

    const coreAccentRing2 = new THREE.TorusGeometry(0.42, 0.015, 16, 32);
    coreAccentRing2.rotateX(Math.PI / 3);
    const coreAccentMesh2 = new THREE.Mesh(coreAccentRing2, brassMaterial);
    coreAccentMesh2.position.y = coreMesh.position.y;
    domeGroup.add(coreAccentMesh2);

    // F. Atmospheric Golden Dust Motes / Light Particles
    const particlesCount = 140;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let p = 0; p < particlesCount * 3; p += 3) {
      const radius = 0.4 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[p] = Math.cos(angle) * radius;
      particlePositions[p + 1] = 0.4 + Math.random() * 2.8;
      particlePositions[p + 2] = Math.sin(angle) * radius;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xc89d58,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particlesGeo, particlesMat);
    domeGroup.add(particleField);

    // G. Soft Floor Contact Ground Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    const gradient = sCtx.createRadialGradient(128, 128, 25, 128, 128, 126);
    gradient.addColorStop(0, "rgba(23, 23, 23, 0.36)");
    gradient.addColorStop(0.5, "rgba(23, 23, 23, 0.12)");
    gradient.addColorStop(0.8, "rgba(23, 23, 23, 0.02)");
    gradient.addColorStop(1, "rgba(23, 23, 23, 0)");
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(6.6, 6.6);
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

    // 7. Dynamic Camera Auto-Fit to Model Bounding Box with Zoom Support
    const fitCameraToDome = (curWidth, curHeight) => {
      if (curWidth <= 0 || curHeight <= 0) return;
      const box = new THREE.Box3().setFromObject(domeGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y);
      const aspect = curWidth / curHeight;
      const fovRad = (camera.fov * Math.PI) / 180;
      let dist = (maxDim / 2) / Math.tan(fovRad / 2);

      if (aspect < 1.0) {
        dist *= (1.0 / aspect) * 1.05;
      } else if (aspect < 1.6) {
        dist *= (1.55 / aspect) * 0.96;
      } else {
        dist *= 1.1;
      }

      // Apply dynamic user zoom level
      dist = (dist / zoomLevelRef.current);

      camera.position.set(0, center.y + 0.32, Math.max(dist, 3.8));
      camera.lookAt(center.x, center.y + 0.08, center.z);
      camera.updateProjectionMatrix();
    };

    fitCameraToDome(initialSize.w, initialSize.h);

    // Initial orientation
    domeGroup.rotation.x = 0.08;
    domeGroup.rotation.y = 0.45;

    // 8. Interactive Dragging & Mouse Parallax
    let targetRotX = 0.08;
    let targetRotY = 0.45;
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
        targetRotY += deltaX * 0.006;
        targetRotX = Math.max(-0.35, Math.min(0.45, targetRotX + deltaY * 0.004));
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
      targetRotY += deltaX * 0.008;
      targetRotX = Math.max(-0.35, Math.min(0.45, targetRotX + deltaY * 0.005));
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
      const time = clock.getElapsedTime();

      // Dynamic lighting theme transition
      if (lightingModeRef.current === "sunset") {
        sunLight.color.setHex(0xf59e0b);
        sunLight.intensity = 2.8;
        ambientLight.color.setHex(0x78350f);
        ambientLight.intensity = 0.9;
        oculusSpot.color.setHex(0xfbbf24);
      } else if (lightingModeRef.current === "obsidian") {
        sunLight.color.setHex(0x38bdf8);
        sunLight.intensity = 1.8;
        ambientLight.color.setHex(0x0f172a);
        ambientLight.intensity = 0.6;
        oculusSpot.color.setHex(0x06b6d4);
      } else {
        sunLight.color.setHex(0xfff6e8);
        sunLight.intensity = 2.5;
        ambientLight.color.setHex(0xfffaf0);
        ambientLight.intensity = 1.1;
        oculusSpot.color.setHex(0xfff5dd);
      }

      if (isRotatingRef.current && !isUserDragging) {
        targetRotY += delta * rotationSpeed;
      }

      const targetParallaxX = isUserDragging ? targetRotX : 0.08 - mouseY * 0.12;
      const targetParallaxY = isUserDragging
        ? targetRotY
        : isHovering
        ? targetRotY + mouseX * 0.28
        : targetRotY;

      domeGroup.rotation.x += (targetParallaxX - domeGroup.rotation.x) * 0.08;
      domeGroup.rotation.y += (targetParallaxY - domeGroup.rotation.y) * 0.08;

      // Levitating kinetic crystal motion
      coreMesh.rotation.y += delta * 0.6;
      coreMesh.rotation.x += delta * 0.2;
      coreMesh.position.y = 0.395 + 0.88 + 0.32 + Math.sin(time * 1.8) * 0.025;

      coreAccentMesh1.position.y = coreMesh.position.y;
      coreAccentMesh1.rotation.z += delta * 0.4;
      coreAccentMesh2.position.y = coreMesh.position.y;
      coreAccentMesh2.rotation.y -= delta * 0.5;

      // Floating dust motes slow orbital drift
      particleField.rotation.y += delta * 0.04;

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
          fitCameraToDome(newW, newH);
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
        fitCameraToDome(size.w, size.h);
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
      particlesGeo.dispose();
      particlesMat.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, [interactive, rotationSpeed, zoomLevel]);

  const toggleRotation = (e) => {
    e.stopPropagation();
    setIsRotating((prev) => !prev);
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.7));
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setIsRotating(true);
  };

  return (
    <div
      className={`arch-dome-canvas-wrapper ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: transparentBg
          ? "transparent"
          : lightingMode === "obsidian"
          ? "radial-gradient(circle at 50% 40%, #0F172A 0%, #090E17 65%, #030712 100%)"
          : lightingMode === "sunset"
          ? "radial-gradient(circle at 50% 40%, #FFF7ED 0%, #FDE68A 45%, #F59E0B 100%)"
          : "radial-gradient(circle at 50% 40%, #FFFFFF 0%, #F5F3ED 70%, #ECE8DE 100%)",
        transition: "background 0.6s ease",
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

      {/* Luxury 3D Architectural HUD Controls */}
      {showControls && (
        <div className="dome-3d-overlay-ui">
          <div className="dome-spec-badge">
            <span
              className="spec-dot"
              style={{
                background:
                  lightingMode === "obsidian"
                    ? "#38BDF8"
                    : lightingMode === "sunset"
                    ? "#F59E0B"
                    : "#C89D58"
              }}
            />
            <span>3D WEBGL ROTUNDA · REAL-TIME SHADERS</span>
          </div>

          <div className="dome-ctrl-group">
            {/* Lighting Mode Switcher */}
            <button
              type="button"
              onClick={cycleLightingMode}
              className="dome-tool-btn"
              title={`Current: ${lightingMode.toUpperCase()}. Click to switch atmosphere.`}
            >
              {lightingMode === "daylight" && <Sun size={12} />}
              {lightingMode === "sunset" && <Sparkles size={12} />}
              {lightingMode === "obsidian" && <Moon size={12} />}
              <span>{lightingMode.toUpperCase()}</span>
            </button>

            {/* Zoom Controls */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="dome-tool-btn icon-only"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="dome-tool-btn icon-only"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>

            {/* Auto-Rotation Toggle */}
            <button
              type="button"
              onClick={toggleRotation}
              className={`dome-tool-btn ${isRotating ? "active" : ""}`}
              title={isRotating ? "Pause continuous rotation" : "Resume rotation"}
              aria-label="Toggle auto rotation"
            >
              <RotateCw size={12} className={isRotating ? "spin-icon" : ""} />
              <span>{isRotating ? "ORBITING" : "PAUSED"}</span>
            </button>

            {/* Reset View */}
            <button
              type="button"
              onClick={handleReset}
              className="dome-tool-btn icon-only"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Drag Hint */}
      {interactive && (
        <div className="dome-drag-hint">
          <span>Drag in 360° to inspect peristyle colonnade & vault</span>
        </div>
      )}
    </div>
  );
}

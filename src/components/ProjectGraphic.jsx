import React, { Suspense, lazy } from "react";
import PathfindingSim from "./PathfindingSim";

const Chess3DCanvas = lazy(() => import("./Chess3DCanvas"));

export default function ProjectGraphic({ project, isDetail = false }) {
  // 1. 3D WebGL Chessboard & Minimax Engine Simulation (Mitesh's C++ Project)
  if (
    project.is3DChess ||
    project.previewType === "chess-3d" ||
    project.previewType === "chess-sim" ||
    project.id === "chess-game"
  ) {
    return (
      <div
        className="graphic-3d-wrapper"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        <Suspense
          fallback={
            <div className="canvas-loading-skeleton">
              <span className="loading-spinner" />
              <span className="loading-text">Loading 3D Chessboard...</span>
            </div>
          }
        >
          <Chess3DCanvas interactive={true} autoRotate={true} />
        </Suspense>
      </div>
    );
  }

  // 2. Interactive Pathfinding Algorithm Sandbox
  if (project.hasSimulation) {
    return (
      <div className="graphic-simulation-wrapper">
        <PathfindingSim compact={!isDetail} />
      </div>
    );
  }

  // 3. Real Authentic Project Screenshots (Chrezaa Fashion Atelier, MilletMorn Platform)
  if (project.image) {
    return (
      <div className="graphic-image-wrapper">
        <img
          src={project.image}
          alt={project.title}
          className="graphic-img"
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
        />
      </div>
    );
  }

  // 4. Clean, Human Creative Previews for Software Systems
  if (project.previewType === "portfolio-brand") {
    return (
      <div className="graphic-brand-preview">
        <div className="brand-disc-badge">
          <span className="brand-monogram">MY.</span>
        </div>
        <h4 className="brand-preview-title">Portfolio Architecture</h4>
        <p className="brand-preview-sub">React 18 · Framer Motion · Modern Typography</p>
        <div className="brand-wave-bars" aria-hidden="true">
          {[40, 70, 95, 60, 85, 45, 65, 90, 50, 75, 55, 80].map((h, i) => (
            <span
              key={i}
              className="wave-bar"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (project.previewType === "dashboard-portal") {
    return (
      <div className="graphic-portal-preview">
        <div className="portal-card-box">
          <div className="portal-card-header">
            <div className="portal-avatar">MY</div>
            <div className="portal-meta">
              <span className="portal-title">Full-Stack Candidate Pipeline</span>
              <span className="portal-sub">Node.js · Express MVC · RESTful API</span>
            </div>
            <span className="portal-badge-score">98% Match</span>
          </div>

          <div className="portal-metrics-row">
            <div className="portal-stat">
              <span className="stat-num">142</span>
              <span className="stat-label">Applications</span>
            </div>
            <div className="portal-stat highlight">
              <span className="stat-num">18</span>
              <span className="stat-label">Shortlisted</span>
            </div>
            <div className="portal-stat">
              <span className="stat-num">4.9/5</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>

          <div className="portal-tags-row">
            <span className="p-tag">React</span>
            <span className="p-tag">Express.js</span>
            <span className="p-tag">REST API</span>
            <span className="p-tag">PostgreSQL</span>
          </div>
        </div>
      </div>
    );
  }

  if (project.previewType === "library-system") {
    return (
      <div className="graphic-library-preview">
        <div className="library-shelf-box">
          <div className="library-shelf-header">
            <span className="shelf-badge">CATALOG SYSTEM // DEWEY 005.1</span>
            <span className="shelf-id">SYS-2025</span>
          </div>

          <div className="book-spines-row">
            <div className="spine spine-1">
              <span className="call-no">005.1</span>
              <span className="title-vertical">Algorithms</span>
            </div>
            <div className="spine spine-2">
              <span className="call-no">004.2</span>
              <span className="title-vertical">Systems</span>
            </div>
            <div className="spine spine-3">
              <span className="call-no">511.3</span>
              <span className="title-vertical">Computation</span>
            </div>
            <div className="spine spine-4">
              <span className="call-no">005.7</span>
              <span className="title-vertical">Structures</span>
            </div>
          </div>

          <div className="library-shelf-footer">
            <span>1,420 Volumes Cataloged</span>
            <span>LocalStorage Persistence</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="graphic-fallback">
      <span className="fallback-tag">{project.category}</span>
      <h4 className="fallback-title">{project.title}</h4>
    </div>
  );
}

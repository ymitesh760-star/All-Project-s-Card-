import React, { useState } from "react";
import { ArrowUpRight, ChevronRight, Layers, Sparkles, ExternalLink, Github } from "lucide-react";
import ArchDomeCanvas from "./ArchDomeCanvas";

/**
 * Spectacular 3D Architectural Showcase
 * - Full-stage, unobstructed 3D Neoclassical Rotunda & Dome WebGL centerpiece
 * - Interactive 360° orbital rotation, real-time lighting modes, and zoom
 * - Sleek project selector dock displaying Mitesh's verified real projects
 * - Instant project detail modal triggers
 */
export default function ArchShowcase({ projects, onSelectProject }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const activeProject = projects[activeProjectIndex] || projects[0];

  const handleSelect = (idx, project) => {
    setActiveProjectIndex(idx);
  };

  const handleOpenDetail = (project) => {
    onSelectProject(project);
  };

  return (
    <div className="arch-showcase-wrapper">
      {/* Top Architectural Header */}
      <div className="arch-header-indicator">
        <div className="arch-badge-wrap">
          <span className="arch-badge">
            <Sparkles size={13} style={{ marginRight: 6, color: "#C89D58" }} />
            3D ARCHITECTURAL EXPERIENCE
          </span>
          <span className="arch-count-badge">{projects.length} VERIFIED WORKS</span>
        </div>
        <p className="arch-subtext">
          Drag in 360° to explore the rotunda vault · Select a verified project below to inspect architecture
        </p>
      </div>

      {/* Main Full-Stage 3D Viewport — Completely Unobstructed */}
      <div className="arch-stage-container">
        <ArchDomeCanvas
          interactive={true}
          autoRotate={true}
          rotationSpeed={0.16}
          showControls={true}
          transparentBg={false}
          className="arch-hero-canvas"
        />

        {/* Floating Active Project Spotlight Card in Corner (Unobtrusive) */}
        {activeProject && (
          <div className="arch-spotlight-pill">
            <div className="spotlight-header">
              <span className="spotlight-num">{activeProject.number}</span>
              <span className="spotlight-cat">{activeProject.category}</span>
              <span className="spotlight-status">
                <span className={`status-pip ${activeProject.liveUrl ? "pip-live" : "pip-repo"}`} />
                {activeProject.status}
              </span>
            </div>

            <div className="spotlight-content">
              <h3 className="spotlight-title">{activeProject.title}</h3>
              <p className="spotlight-sub">{activeProject.subtitle}</p>
            </div>

            <div className="spotlight-actions">
              <button
                type="button"
                onClick={() => handleOpenDetail(activeProject)}
                className="spotlight-btn primary"
              >
                <span>EXPLORE ARCHITECTURE</span>
                <ChevronRight size={14} />
              </button>

              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-btn secondary"
                  title="Launch live site"
                >
                  <ExternalLink size={13} />
                </a>
              )}

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-btn secondary"
                  title="View GitHub repository"
                >
                  <Github size={13} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Architectural Project Selector Dock */}
      <div className="arch-projects-dock">
        <div className="dock-label">
          <Layers size={13} style={{ marginRight: 6 }} />
          <span>VERIFIED ENGINEERING REPERTOIRE</span>
        </div>

        <div className="dock-track">
          {projects.map((project, idx) => {
            const isActive = idx === activeProjectIndex;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => handleSelect(idx, project)}
                onDoubleClick={() => handleOpenDetail(project)}
                className={`dock-item ${isActive ? "active" : ""}`}
                title={`Select ${project.title} (Double-click to open)`}
              >
                <div className="dock-item-top">
                  <span className="dock-item-num">{project.number}</span>
                  <span className={`dock-item-dot ${project.liveUrl ? "live" : "repo"}`} />
                </div>
                <div className="dock-item-body">
                  <span className="dock-item-title">{project.title}</span>
                  <span className="dock-item-tag">{project.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

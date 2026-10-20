import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github, Sparkles, Plus } from "lucide-react";
import ProjectGraphic from "./ProjectGraphic";

export default function ProjectCard({
  project,
  onOpenDetail,
  index
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle spring-based tilt physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 220 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const isLive = Boolean(project.liveUrl);
  const isWide = project.layout === "featured" || project.layout === "interactive";
  const is3D = Boolean(project.has3DCanvas || project.is3DChess);
  const isSimulation = Boolean(project.hasSimulation);

  return (
    <motion.article
      id={project.id}
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`project-card-outer ${isWide ? "card-wide" : "card-standard"}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--project-accent": project.accentColor,
        "--project-tint": project.cardTint || "#FFFFFF"
      }}
    >
      <motion.div
        className="project-card-inner"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Card Header */}
        <div className="card-top-bar">
          <div className="card-identity">
            <span className="card-index">{project.number}</span>
            <span className="card-category-badge">{project.category}</span>
            {isWide && (
              <span className="card-featured-pill">
                <Sparkles size={11} />
                <span>Featured</span>
              </span>
            )}
          </div>

          <div className="card-status-indicator">
            <span className={`status-dot ${isLive ? "dot-live" : "dot-repo"}`} />
            <span className="status-text">{project.status}</span>
          </div>
        </div>

        {/* Visual Preview Frame */}
        <div
          className="card-preview-area"
          onClick={(e) => {
            // Prevent modal if clicking interactive controls
            const isControl = e.target.closest("button, .sim-controls, .sim-cell, input, a");
            const isCanvasDrag = (is3D || isSimulation) && (e.target.tagName === "CANVAS" || e.target.closest(".sim-grid"));
            if (isControl || isCanvasDrag) return;
            onOpenDetail(project);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenDetail(project);
            }
          }}
          aria-label={`Open details for ${project.title}`}
        >
          <div className="preview-scaler">
            <ProjectGraphic project={project} />
          </div>

          {!isSimulation && !is3D && (
            <div className="preview-hover-tag">
              <span>View Case Study ⊕</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="card-title-row">
            <div>
              <h3
                className="card-title"
                onClick={() => onOpenDetail(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" ? onOpenDetail(project) : null)}
              >
                {project.title}
              </h3>
              <p className="card-subtitle">{project.subtitle}</p>
            </div>
            <span className="card-year">{project.year}</span>
          </div>

          <p className="card-description">{project.description}</p>

          {/* Technology Badges */}
          <div className="card-tech-list">
            {project.technologies.slice(0, isWide ? 6 : 4).map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
            {project.technologies.length > (isWide ? 6 : 4) && (
              <span className="tech-badge more">
                +{project.technologies.length - (isWide ? 6 : 4)}
              </span>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="card-actions-row">
            {isLive ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn btn-primary"
                title={`Launch live site for ${project.title}`}
              >
                <span>Visit Live Site</span>
                <ArrowUpRight size={14} />
              </a>
            ) : project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn btn-primary"
                title={`View GitHub code for ${project.title}`}
              >
                <Github size={14} />
                <span>View Source Code</span>
                <ArrowUpRight size={14} />
              </a>
            ) : null}

            <button
              type="button"
              className="card-btn btn-secondary"
              onClick={() => onOpenDetail(project)}
              title="Open project overview"
            >
              <span>Details</span>
              <Plus size={14} />
            </button>

            {isLive && project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn btn-icon"
                title="View GitHub repository"
              >
                <Github size={15} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

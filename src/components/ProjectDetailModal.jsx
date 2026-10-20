import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpRight,
  Github,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  Code
} from "lucide-react";
import ProjectGraphic from "./ProjectGraphic";

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasPrev,
  hasNext
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onPrev();
      }
    },
    [onClose, onNext, onPrev, hasNext, hasPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown, project]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="modal-panel"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ "--modal-accent": project.accentColor }}
        >
          {/* Top Modal Header Bar */}
          <div className="modal-top-bar">
            <div className="modal-nav-meta">
              <span className="modal-index-badge">{project.number}</span>
              <span className="modal-category-text">{project.category}</span>
              <span className="modal-divider">/</span>
              <span className="modal-year-text">{project.year}</span>
              <span className="modal-divider">/</span>
              <span className="modal-status-text">{project.status}</span>
            </div>

            <div className="modal-top-actions">
              <div className="modal-arrow-nav">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={!hasPrev}
                  className="modal-page-btn"
                  title="Previous project (←)"
                  aria-label="Previous project"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!hasNext}
                  className="modal-page-btn"
                  title="Next project (→)"
                  aria-label="Next project"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="modal-close-button"
                title="Close modal (Esc)"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="modal-content-scroller">
            {/* Visual Preview Frame */}
            <div className="modal-visual-frame">
              <ProjectGraphic project={project} isDetail={true} />
            </div>

            {/* Header & Primary CTAs */}
            <div className="modal-header-section">
              <div className="modal-title-lockup">
                <h2 id="modal-title" className="modal-headline">
                  {project.title}
                </h2>
                <p className="modal-subheading">{project.subtitle}</p>
              </div>

              <div className="modal-cta-group">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-primary-btn"
                  >
                    <span>Launch Live Site</span>
                    <ArrowUpRight size={16} />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-secondary-btn"
                  >
                    <Github size={16} />
                    <span>View GitHub Code</span>
                  </a>
                )}
              </div>
            </div>

            {/* Main Content Columns */}
            <div className="modal-info-grid">
              <div className="modal-col-main">
                <div className="info-block">
                  <h4 className="info-heading">Project Overview</h4>
                  <p className="info-copy">{project.overview || project.description}</p>
                </div>

                {project.highlights && project.highlights.length > 0 && (
                  <div className="info-block">
                    <h4 className="info-heading">Key Implementation Highlights</h4>
                    <ul className="highlights-list">
                      {project.highlights.map((item, idx) => (
                        <li key={`${project.id}-hl-${idx}`} className="highlight-item">
                          <CheckCircle2 size={16} className="highlight-bullet" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="modal-col-sidebar">
                <div className="info-block">
                  <h4 className="info-heading">
                    <Layers size={14} style={{ marginRight: 6 }} />
                    Technologies &amp; Libraries
                  </h4>
                  <div className="modal-tags-cloud">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="modal-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="info-block context-card">
                  <h4 className="info-heading">Project Context</h4>
                  <div className="context-row">
                    <span className="ctx-label">Status:</span>
                    <span className="ctx-value">{project.status}</span>
                  </div>
                  <div className="context-row">
                    <span className="ctx-label">Author:</span>
                    <span className="ctx-value">Mitesh Yadav</span>
                  </div>
                  <div className="context-row">
                    <span className="ctx-label">Year:</span>
                    <span className="ctx-value">{project.year}</span>
                  </div>
                  <div className="context-row">
                    <span className="ctx-label">Hosting:</span>
                    <span className="ctx-value">
                      {project.liveUrl ? (project.liveUrl.includes("netlify") ? "Netlify Edge" : "Vercel Edge") : "GitHub Repository"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

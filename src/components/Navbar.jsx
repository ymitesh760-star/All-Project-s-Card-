import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profileInfo } from "../data/projectsData";

export default function Navbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className={`navbar-root ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Monogram */}
        <div
          className="navbar-brand"
          onClick={() => handleNavClick("hero")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" ? handleNavClick("hero") : null)}
          aria-label="Back to top"
        >
          <span className="brand-monogram-text">MY</span>
          <span className="brand-accent-dot">.</span>
        </div>

        {/* Center Friendly Status Pill */}
        <div className="navbar-status-pill">
          <span className="status-live-dot" />
          <span className="status-location">Mumbai, IN</span>
          <span className="status-divider">·</span>
          <span className="status-available">Available for Work</span>
        </div>

        {/* Right Navigation Links & Action */}
        <div className="navbar-right">
          <nav className="navbar-links" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => handleNavClick("projects")}
              className={`nav-link-btn ${activeSection === "projects" ? "active" : ""}`}
            >
              Selected Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("about")}
              className={`nav-link-btn ${activeSection === "about" ? "active" : ""}`}
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className={`nav-link-btn ${activeSection === "contact" ? "active" : ""}`}
            >
              Contact
            </button>
          </nav>

          <a
            href={profileInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-action-pill"
            title="Visit Mitesh's GitHub"
          >
            <span>GitHub</span>
            <ArrowUpRight size={14} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-inner">
            <button
              type="button"
              onClick={() => handleNavClick("projects")}
              className="mobile-nav-link"
            >
              <span>Selected Works</span>
              <span className="mobile-link-badge">07</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("about")}
              className="mobile-nav-link"
            >
              <span>About Mitesh</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("contact")}
              className="mobile-nav-link"
            >
              <span>Get in Touch</span>
            </button>
            <a
              href={profileInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-link external"
            >
              <span>GitHub Profile</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

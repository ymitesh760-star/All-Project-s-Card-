import React from "react";
import { ArrowUp, Heart } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-monogram">MY</span>
            <span className="footer-dot">.</span>
          </div>
          <p className="footer-note">Designed and built with care by Mitesh Yadav.</p>
        </div>

        <div className="footer-center">
          <span className="footer-credit">
            © {new Date().getFullYear()} Mitesh Yadav · Mumbai, India
          </span>
          <span className="footer-meta">Crafted with React, Framer Motion &amp; Modern CSS</span>
        </div>

        <div className="footer-right">
          <button
            type="button"
            onClick={scrollToTop}
            className="back-to-top-btn"
            title="Back to top"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}

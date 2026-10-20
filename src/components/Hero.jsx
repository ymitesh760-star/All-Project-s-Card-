import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles, Code2, Layers, Cpu } from "lucide-react";
import { profileInfo } from "../data/projectsData";

export default function Hero({ projectCount, onScrollToProjects }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const quickPicks = [
    { num: "01", name: "Chrezaa Atelier", tag: "E-Commerce", color: "#FF8066", id: "chrezaa" },
    { num: "02", name: "Pathfinding Visualizer", tag: "Interactive Lab", color: "#14B8A6", id: "pathfinding" },
    { num: "03", name: "Portfolio Architecture", tag: "Creative Web", color: "#4169E1", id: "portfolio" }
  ];

  const handleJumpTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      onScrollToProjects();
    }
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content-wrap"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Friendly Badge & Availability Pill */}
          <motion.div className="hero-meta-row" variants={itemVariants}>
            <div className="hero-availability-pill">
              <span className="availability-dot" />
              <span>Available for full-time frontend roles</span>
            </div>
            <span className="hero-meta-location">Mumbai, India</span>
          </motion.div>

          {/* Expressive Editorial Headline */}
          <motion.div className="hero-headline-wrap" variants={itemVariants}>
            <h1 className="hero-headline">
              Crafting thoughtful digital interfaces with <span className="highlight-cobalt">care</span>,{" "}
              <span className="highlight-coral">color</span> &amp; <span className="highlight-lavender">code</span>.
            </h1>
          </motion.div>

          {/* Personal Bio Paragraph */}
          <motion.div className="hero-bio-wrap" variants={itemVariants}>
            <p className="hero-lead-text">
              I&apos;m <strong className="author-name">{profileInfo.name}</strong>, a frontend developer and computer science student.
              I design and build responsive web applications, interactive algorithm visualizers, and digital products
              that prioritize speed, accessible design, and delightful micro-interactions.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div className="hero-actions-row" variants={itemVariants}>
            <button
              type="button"
              onClick={onScrollToProjects}
              className="hero-primary-btn"
            >
              <span>Explore Selected Works</span>
              <ArrowDown size={16} />
            </button>

            <a
              href="#about"
              className="hero-secondary-btn"
            >
              <span>About My Work</span>
            </a>

            <div className="hero-work-counter">
              <span className="counter-dot" />
              <span>{projectCount} Genuine Projects</span>
            </div>
          </motion.div>

          {/* Featured Highlights Strip */}
          <motion.div className="hero-featured-strip" variants={itemVariants}>
            <span className="strip-title">FEATURED HIGHLIGHTS:</span>
            <div className="strip-pills">
              {quickPicks.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleJumpTo(p.id)}
                  className="strip-pill-btn"
                  style={{ "--pill-accent": p.color }}
                >
                  <span className="p-num">{p.num}</span>
                  <span className="p-name">{p.name}</span>
                  <span className="p-tag">{p.tag}</span>
                  <ArrowUpRight size={13} className="p-arrow" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { Github, Linkedin, Mail, ExternalLink, Copy, Check, MapPin, Sparkles, Heart } from "lucide-react";
import { profileInfo } from "../data/projectsData";

export default function AboutSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(profileInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        {/* Section Header */}
        <div className="section-eyebrow">
          <span className="eyebrow-accent-dot" />
          <span className="eyebrow-title">About The Developer</span>
        </div>

        <div className="about-editorial-grid">
          {/* Left Column: Personal Narrative & Philosophy */}
          <div className="about-main-col">
            <h2 className="about-headline">
              Building thoughtful digital products with craft, color, and curiosity.
            </h2>

            <div className="about-bio-paragraphs">
              {profileInfo.aboutBio.map((paragraph, index) => (
                <p key={index} className="about-p">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Core Values / Creative Principles */}
            <div className="about-values-grid">
              <div className="value-card cobalt">
                <span className="value-num">01</span>
                <h4 className="value-title">Performance First</h4>
                <p className="value-desc">
                  Sub-second page loads, zero cumulative layout shift (CLS), and lean dependencies for every user.
                </p>
              </div>

              <div className="value-card lavender">
                <span className="value-num">02</span>
                <h4 className="value-title">Purposeful Motion</h4>
                <p className="value-desc">
                  Micro-interactions that clarify spatial hierarchy, confirm user actions, and bring interfaces to life.
                </p>
              </div>

              <div className="value-card coral">
                <span className="value-num">03</span>
                <h4 className="value-title">Clean Systems</h4>
                <p className="value-desc">
                  Modular component design, typed interfaces, and clean separation of concerns from UI to backend.
                </p>
              </div>
            </div>

            {/* Verified Links & Actions */}
            <div className="about-links-row">
              <a
                href={profileInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="about-link-btn"
              >
                <Github size={16} />
                <span>GitHub Profile</span>
                <ExternalLink size={13} className="link-arrow" />
              </a>

              <a
                href={profileInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="about-link-btn"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <ExternalLink size={13} className="link-arrow" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="about-link-btn copy-email-btn"
                title="Copy email address"
              >
                {copied ? <Check size={16} style={{ color: "#10B981" }} /> : <Copy size={16} />}
                <span>{copied ? "Email Copied!" : "Copy Email"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Skills Matrix & Location */}
          <div className="about-sidebar-col">
            <div className="skills-editorial-card">
              <div className="card-header-row">
                <h3 className="skills-title">Technical Toolset</h3>
                <span className="skills-subtitle">Technologies I work with</span>
              </div>

              <div className="skills-groups-wrap">
                {profileInfo.skills.map((group, idx) => (
                  <div key={idx} className="skill-group-box">
                    <div className="skill-group-head">
                      <span className="group-color-dot" style={{ backgroundColor: group.color }} />
                      <span className="group-label">{group.category}</span>
                    </div>

                    <div className="skill-chips-row">
                      {group.items.map((skill) => (
                        <span key={skill} className="skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Location & Availability Callout */}
              <div className="location-info-box">
                <div className="loc-title-row">
                  <MapPin size={14} className="loc-pin-icon" />
                  <span className="loc-heading">Location &amp; Availability</span>
                </div>
                <p className="loc-text">
                  Based in <strong>Mumbai, Maharashtra, India</strong> (IST). Available for full-time frontend engineering roles, remote positions, and creative collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

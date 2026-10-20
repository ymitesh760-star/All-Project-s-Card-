import React, { useState } from "react";
import { Mail, Copy, Check, ArrowUpRight, Github, Linkedin, Send } from "lucide-react";
import { profileInfo } from "../data/projectsData";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profileInfo.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-card-box">
          <div className="contact-pill-tag">
            <span className="contact-tag-dot" />
            <span>Let&apos;s Connect</span>
          </div>

          <h2 className="contact-headline">
            Have a project in mind or looking for a frontend developer?
          </h2>

          <p className="contact-lead-desc">
            I&apos;m currently open to full-time frontend roles, engineering internships, and high-impact web collaborations.
            Feel free to say hello or explore my work.
          </p>

          {/* Email Interaction Card */}
          <div className="contact-email-bar">
            <div className="email-display-group">
              <Mail size={18} className="email-icon" />
              <span className="email-address">{profileInfo.email}</span>
            </div>

            <div className="email-buttons-group">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="copy-btn"
                title="Copy email to clipboard"
              >
                {copied ? <Check size={15} style={{ color: "#10B981" }} /> : <Copy size={15} />}
                <span>{copied ? "Copied!" : "Copy Email"}</span>
              </button>

              <a
                href={`mailto:${profileInfo.email}?subject=Project%20Inquiry%20via%20Portfolio`}
                className="write-btn"
              >
                <span>Write Email</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="contact-social-row">
            <a
              href={profileInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-pill"
            >
              <Github size={15} />
              <span>github.com/ymitesh760-star</span>
              <ArrowUpRight size={13} className="pill-arrow" />
            </a>

            <a
              href={profileInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-pill"
            >
              <Linkedin size={15} />
              <span>linkedin.com/in/mitesh-yadav</span>
              <ArrowUpRight size={13} className="pill-arrow" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

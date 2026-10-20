import React, { useEffect, useRef } from "react";

/**
 * Modern Web Guidance: Scroll Progress Indicator
 * - Adheres to web standards: uses native CSS scroll() timeline when supported
 * - Purely decorative visual indicator with aria-hidden="true" to remove from screen reader tree
 * - Smooth fallback using requestAnimationFrame for unsupported browsers
 * - Automatically respects prefers-reduced-motion
 */
export default function ScrollProgress() {
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Check if browser natively supports animation-timeline: scroll()
    const supportsScrollTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("animation-timeline", "scroll()");

    if (!supportsScrollTimeline && progressBarRef.current) {
      const progressBar = progressBarRef.current;
      let ticking = false;

      const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) {
          const progressPercentage = Math.min(1, Math.max(0, window.scrollY / scrollable));
          progressBar.style.transform = `scaleX(${progressPercentage})`;
        }
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      updateProgress();

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, []);

  return (
    <div
      ref={progressBarRef}
      id="scroll-progress-bar"
      className="scroll-progress-indicator"
      aria-hidden="true"
    />
  );
}

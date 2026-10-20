import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Signature Editorial Cursor
 * - Fluid spring-tracked cursor with context-aware morphing
 * - Changes state and displays subtle contextual text over project cards and action buttons
 * - Automatically disabled on touch screens / mobile via pointer media query
 * - Respects prefers-reduced-motion
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default"); // "default" | "hover" | "text" | "hidden"
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device supports hover / fine pointer
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element for cursor traits
      const target = e.target;
      const interactiveEl = target.closest("button, a, [data-cursor], .sim-cell, input");

      if (interactiveEl) {
        const customText = interactiveEl.getAttribute("data-cursor-text");
        const customVariant = interactiveEl.getAttribute("data-cursor") || "hover";

        if (customText) {
          setCursorText(customText);
          setCursorVariant("text");
        } else if (interactiveEl.tagName === "INPUT") {
          setCursorVariant("hidden");
        } else {
          setCursorText("");
          setCursorVariant(customVariant);
        }
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  const variants = {
    default: {
      width: 10,
      height: 10,
      backgroundColor: "#EA580C",
      border: "0px solid rgba(234, 88, 12, 0)",
      opacity: 0.95
    },
    hover: {
      width: 36,
      height: 36,
      backgroundColor: "rgba(234, 88, 12, 0.12)",
      border: "1.5px solid #EA580C",
      opacity: 1
    },
    text: {
      width: 88,
      height: 88,
      backgroundColor: "#18181B",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#FBF9F5",
      opacity: 1
    },
    hidden: {
      opacity: 0,
      scale: 0
    }
  };

  return (
    <motion.div
      className="signature-custom-cursor"
      aria-hidden="true"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: "-50%",
        y: "-50%"
      }}
      animate={cursorVariant}
      variants={variants}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {cursorVariant === "text" && cursorText && (
        <span className="cursor-inner-text">{cursorText}</span>
      )}
    </motion.div>
  );
}

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FilterBar from "./components/FilterBar";
import ProjectCard from "./components/ProjectCard";
import ProjectDetailModal from "./components/ProjectDetailModal";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import { projects } from "./data/projectsData";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("projects");

  // Filter projects by category and search term
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.subtitle.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Modal Next/Prev navigation
  const currentModalIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex((p) => p.id === selectedProject.id);
  }, [selectedProject, filteredProjects]);

  const handleNextProject = () => {
    if (currentModalIndex >= 0 && currentModalIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[currentModalIndex + 1]);
    }
  };

  const handlePrevProject = () => {
    if (currentModalIndex > 0) {
      setSelectedProject(filteredProjects[currentModalIndex - 1]);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app-layout">
      {/* Modern Web Guidance: Scroll Progress Bar */}
      <ScrollProgress />

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Monumental Hero Section */}
      <Hero
        projectCount={projects.length}
        onScrollToProjects={() => scrollToSection("projects")}
      />

      {/* Main Showcase Section */}
      <main id="projects" className="main-content">
        {/* Filter and Search Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredCount={filteredProjects.length}
          totalCount={projects.length}
        />

        {/* Curated Editorial Showcase Grid */}
        <section className="projects-section">
          <motion.div layout className="projects-editorial-grid">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onOpenDetail={setSelectedProject}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="no-results-banner">
              <span className="no-results-badge">NO MATCHES FOUND</span>
              <p className="no-results-title">No projects matched &ldquo;{searchQuery}&rdquo;</p>
              <p className="no-results-desc">
                Try searching for specific technologies like React, JavaScript, C++, Algorithms, or WhatsApp API.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="reset-filters-btn"
                data-cursor="hover"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        hasNext={currentModalIndex < filteredProjects.length - 1}
        hasPrev={currentModalIndex > 0}
      />
    </div>
  );
}

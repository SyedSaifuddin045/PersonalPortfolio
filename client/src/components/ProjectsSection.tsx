import { useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import ProjectCarousel from "./ProjectCarousel";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: "web" | "mobile" | "api" | "game" | "graphics" | "system" | "devops" | "vr" | "all";
  image_folder: string;
  images?: string[];
  videos?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
    technologies: ["React", "Node.js", "PostgreSQL"],
    category: "web",
    image_folder: "ecommerce",
    images: ["ecommerce1.png"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "2",
    title: "Task Manager App",
    description: "Cross-platform mobile app built with React Native. Features task scheduling, team collaboration, and offline synchronization.",
    technologies: ["React Native", "Redux", "Firebase"],
    category: "mobile",
    image_folder: "task-manager",
    images: ["screen1.png", "screen2.png"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    id: "3",
    title: "RESTful API Service",
    description: "Scalable REST API with comprehensive documentation, rate limiting, and monitoring. Built with Express.js and deployed on AWS.",
    technologies: ["Express.js", "MongoDB", "AWS"],
    category: "api",
    image_folder: "api-service",
    images: [
      "api-diagram.png",
      "dashboard.png",
      "metrics.png"
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
];

const filters = [
  { key: "all", label: "All Projects" },
  { key: "web", label: "Web Apps" },
  { key: "mobile", label: "Mobile" },
  { key: "api", label: "APIs" },
  { key: "game", label: "Games" },
  { key: "graphics", label: "Graphics" },
  { key: "system", label: "System" },
  { key: "devops", label: "DevOps" },
  { key: "vr", label: "VR" },
];

function TechTag({ tech }: { tech: string }) {
  const getTagColor = (technology: string) => {
    const tech = technology.toLowerCase();
    if (tech.includes("react") || tech.includes("javascript")) return "bg-portfolio-primary/20 text-portfolio-primary";
    if (tech.includes("node") || tech.includes("express")) return "bg-portfolio-accent/20 text-portfolio-accent";
    if (tech.includes("python") || tech.includes("django")) return "bg-portfolio-success/20 text-portfolio-success";
    return "bg-portfolio-text-muted/20 text-portfolio-text-muted";
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getTagColor(tech)}`}>
      {tech}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-portfolio-bg-secondary rounded-2xl overflow-hidden card-hover" data-testid={`project-card-${project.id}`}>
      <ProjectCarousel
        images={project.images}
        videos={project.videos}
        title={project.title}
        imageFolder={project.image_folder}
      />

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold" data-testid={`project-title-${project.id}`}>
            {project.title}
          </h3>
          <div className="flex space-x-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="text-portfolio-text-muted hover:text-portfolio-accent transition-colors duration-300"
                data-testid={`project-github-${project.id}`}
              >
                <Github size={18} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="text-portfolio-text-muted hover:text-portfolio-primary transition-colors duration-300"
                data-testid={`project-live-${project.id}`}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-portfolio-text-secondary mb-4 text-sm leading-relaxed" data-testid={`project-description-${project.id}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2" data-testid={`project-technologies-${project.id}`}>
          {project.technologies.map((tech, index) => (
            <TechTag key={index} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects = defaultProjects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleProjects, setVisibleProjects] = useState(6);
  
  // Debug log to check projects data
  console.log("Projects data:", projects);

  const filteredProjects = projects.filter(
    (project) => activeFilter === "all" || project.category === activeFilter
  );

  const displayedProjects = filteredProjects.slice(0, visibleProjects);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setVisibleProjects(6); // Reset visible projects when filter changes
  };

  const loadMore = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="projects-title">
            Featured Projects
          </h2>
          <div className="w-20 h-1 gradient-bg mx-auto mb-8"></div>
          <p className="text-portfolio-text-secondary max-w-2xl mx-auto">
            A selection of projects that showcase my skills.
          </p>
        </div>

        {/* Project Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-portfolio-primary text-white"
                  : "bg-portfolio-bg-secondary text-portfolio-text-secondary hover:bg-portfolio-bg-tertiary"
              }`}
              data-testid={`filter-${filter.key}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-grid">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Load More Button */}
        {displayedProjects.length < filteredProjects.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="bg-portfolio-bg-secondary hover:bg-portfolio-bg-tertiary text-portfolio-text-primary px-8 py-4 rounded-lg font-medium transition-all duration-300 border border-portfolio-text-muted hover:border-portfolio-text-primary"
              data-testid="button-load-more"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

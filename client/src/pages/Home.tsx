import { usePortfolio } from "@/hooks/usePortfolio";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: portfolio, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-portfolio-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-portfolio-text-secondary">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-portfolio-text-primary mb-4">
            Portfolio Not Found
          </h1>
          <p className="text-portfolio-text-secondary">
            Unable to load portfolio data. Please check the configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation portfolioName={portfolio.name} />
      
      <HeroSection
        greeting={portfolio.hero.greeting}
        title={portfolio.hero.title}
        description={portfolio.hero.description}
      />
      
      <AboutSection
        description={portfolio.about.description}
        stats={portfolio.stats}
        resumeUrl={portfolio.resumeUrl}
      />
      
      <SkillsSection skills={portfolio.skills} />
      
      <ProjectsSection projects={portfolio.projects} />
      
      <ContactSection
        contact={portfolio.contact}
        social={portfolio.social}
      />
      
      <Footer portfolioName={portfolio.name} />
    </div>
  );
}

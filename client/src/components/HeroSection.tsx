interface HeroSectionProps {
  greeting?: string;
  title?: string;
  description?: string;
}

export default function HeroSection({
  greeting = "Hi, I'm Developer",
  title = "Full Stack Developer & UI/UX Enthusiast",
  description = "I craft beautiful, functional web experiences with modern technologies. Passionate about clean code, user experience, and innovative solutions.",
}: HeroSectionProps) {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text" data-testid="hero-greeting">
              {greeting}
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-portfolio-text-secondary mb-8 font-light" data-testid="hero-title">
            {title}
          </h2>
          <p className="text-lg text-portfolio-text-muted mb-12 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection("#projects")}
              className="btn-primary px-8 py-4 rounded-lg font-medium animate-glow"
              data-testid="button-view-work"
            >
              View My Work
            </button>
            <button
              onClick={() => scrollToSection("#contact")}
              className="btn-secondary px-8 py-4 rounded-lg font-medium"
              data-testid="button-get-in-touch"
            >
              Get In Touch
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-portfolio-primary/20 rounded-full blur-xl animate-float hidden lg:block"></div>
        <div 
          className="absolute top-3/4 right-1/4 w-32 h-32 bg-portfolio-accent/20 rounded-full blur-xl animate-float" 
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </section>
  );
}

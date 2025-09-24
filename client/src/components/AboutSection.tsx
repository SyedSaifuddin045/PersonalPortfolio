import { Download } from "lucide-react";

interface AboutSectionProps {
  about: {
    description?: string;
    personalPic?: string;
    resumeFile?: string;
  };
  stats?: Array<{ value: string; label: string }>;
}

export default function AboutSection({
  about = {},
  stats = [
    { value: "50+", label: "Projects Completed" },
    { value: "5+", label: "Years Experience" },
  ],
}: AboutSectionProps) {
  const { description, personalPic, resumeFile } = about;
  const resumeUrl = resumeFile ? `/personal_assets/${resumeFile}` : undefined;
  const personalPicUrl = personalPic ? `/personal_assets/${personalPic}` : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800";

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="about-title">
            About Me
          </h2>
          <div className="w-20 h-1 gradient-bg mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto lg:mx-0 w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-r from-portfolio-primary to-portfolio-accent rounded-full animate-spin-slow"></div>
              <img
                src={personalPicUrl}
                alt="Professional developer portrait"
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-full border-4 border-portfolio-bg-primary shadow-xl hover:scale-105 transition-transform duration-300"
                data-testid="profile-image"
              />
            </div>
          </div>

          {/* About Content */}
          <div className="order-1 lg:order-2">
            <div className="bg-portfolio-bg-secondary rounded-2xl p-8 card-hover">
              <h3 className="text-2xl font-semibold mb-6 text-portfolio-accent" data-testid="about-journey-title">
                My Journey
              </h3>
              <p className="text-portfolio-text-secondary mb-6 leading-relaxed" data-testid="about-description">
                {description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-portfolio-bg-primary rounded-lg" data-testid={`stat-${index}`}>
                    <div className="text-2xl font-bold text-portfolio-primary" data-testid={`stat-value-${index}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-portfolio-text-muted" data-testid={`stat-label-${index}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Resume Button */}
              {resumeUrl && (
                <div className="mt-8">
                  <a
                    href={resumeUrl}
                    className="inline-flex items-center space-x-2 bg-portfolio-accent hover:bg-portfolio-accent/80 text-portfolio-bg-primary px-6 py-3 rounded-lg font-medium transition-all duration-300"
                    download
                    data-testid="button-download-resume"
                  >
                    <Download size={16} />
                    <span>Download Resume</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

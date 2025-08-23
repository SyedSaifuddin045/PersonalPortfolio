import { MonitorSpeaker, Server, Cloud } from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillsData {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
}

interface SkillsSectionProps {
  skills?: SkillsData;
}

const defaultSkills: SkillsData = {
  frontend: [
    { name: "React.js", level: 4 },
    { name: "TypeScript", level: 5 },
    { name: "Tailwind CSS", level: 4 },
  ],
  backend: [
    { name: "Node.js", level: 4 },
    { name: "Python", level: 5 },
    { name: "PostgreSQL", level: 4 },
  ],
  tools: [
    { name: "Docker", level: 4 },
    { name: "AWS", level: 4 },
    { name: "Git", level: 5 },
  ],
};

function SkillIndicators({ level }: { level: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`skill-indicator ${
            i <= level 
              ? i <= 2 ? "filled" : i <= 4 ? "accent" : "success"
              : "empty"
          }`}
        />
      ))}
    </div>
  );
}

function SkillCategory({ 
  title, 
  icon: Icon, 
  skills, 
  iconColor 
}: { 
  title: string; 
  icon: any; 
  skills: Skill[]; 
  iconColor: string;
}) {
  return (
    <div className="bg-portfolio-bg-primary rounded-2xl p-8 card-hover" data-testid={`skill-category-${title.toLowerCase()}`}>
      <div className="text-center mb-6">
        <Icon className={`text-4xl ${iconColor} mb-4 mx-auto`} size={32} />
        <h3 className="text-xl font-semibold" data-testid={`skill-category-title-${title.toLowerCase()}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between" data-testid={`skill-${title.toLowerCase()}-${index}`}>
            <span className="text-portfolio-text-secondary" data-testid={`skill-name-${title.toLowerCase()}-${index}`}>
              {skill.name}
            </span>
            <SkillIndicators level={skill.level} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ skills = defaultSkills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-20 px-6 bg-portfolio-bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="skills-title">
            Skills & Technologies
          </h2>
          <div className="w-20 h-1 gradient-bg mx-auto"></div>
        </div>

        {/* Skills Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkillCategory 
            title="Frontend" 
            icon={MonitorSpeaker} 
            skills={skills.frontend} 
            iconColor="text-portfolio-accent"
          />
          <SkillCategory 
            title="Backend" 
            icon={Server} 
            skills={skills.backend} 
            iconColor="text-portfolio-primary"
          />
          <SkillCategory 
            title="Tools & Cloud" 
            icon={Cloud} 
            skills={skills.tools} 
            iconColor="text-portfolio-success"
          />
        </div>
      </div>
    </section>
  );
}

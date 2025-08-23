import { Code } from "lucide-react";

interface FooterProps {
  portfolioName?: string;
}

export default function Footer({ portfolioName = "Developer" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-portfolio-bg-tertiary">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Code className="text-white text-sm" size={16} />
            </div>
            <span className="text-lg font-semibold" data-testid="footer-name">
              {portfolioName}
            </span>
          </div>

          <div className="text-portfolio-text-muted text-sm" data-testid="footer-copyright">
            © {currentYear} {portfolioName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

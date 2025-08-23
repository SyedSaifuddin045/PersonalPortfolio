import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface SocialLinks {
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

interface ContactSectionProps {
  contact?: ContactInfo;
  social?: SocialLinks;
}

const defaultContact: ContactInfo = {
  email: "developer@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
};

const defaultSocial: SocialLinks = {
  githubUrl: "#",
  linkedinUrl: "#",
  twitterUrl: "#",
};

export default function ContactSection({ 
  contact = defaultContact, 
  social = defaultSocial 
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", formData);
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { href: social.githubUrl, icon: SiGithub, label: "GitHub" },
    { href: social.linkedinUrl, icon: SiLinkedin, label: "LinkedIn" },
    { href: social.twitterUrl, icon: SiX, label: "Twitter" },
  ].filter(link => link.href && link.href !== "#");

  return (
    <section id="contact" className="py-20 px-6 bg-portfolio-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="contact-title">
            Let's Work Together
          </h2>
          <div className="w-20 h-1 gradient-bg mx-auto mb-8"></div>
          <p className="text-portfolio-text-secondary max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-portfolio-accent" data-testid="contact-info-title">
                Get In Touch
              </h3>
              <p className="text-portfolio-text-secondary leading-relaxed mb-8">
                I'm always interested in hearing about new opportunities and exciting projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4" data-testid="contact-email">
                <div className="w-12 h-12 bg-portfolio-primary/20 rounded-lg flex items-center justify-center">
                  <Mail className="text-portfolio-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-portfolio-text-muted">Email</div>
                  <div className="text-portfolio-text-primary">{contact.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4" data-testid="contact-phone">
                <div className="w-12 h-12 bg-portfolio-accent/20 rounded-lg flex items-center justify-center">
                  <Phone className="text-portfolio-accent" size={20} />
                </div>
                <div>
                  <div className="text-sm text-portfolio-text-muted">Phone</div>
                  <div className="text-portfolio-text-primary">{contact.phone}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4" data-testid="contact-location">
                <div className="w-12 h-12 bg-portfolio-success/20 rounded-lg flex items-center justify-center">
                  <MapPin className="text-portfolio-success" size={20} />
                </div>
                <div>
                  <div className="text-sm text-portfolio-text-muted">Location</div>
                  <div className="text-portfolio-text-primary">{contact.location}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="text-lg font-medium mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="w-10 h-10 bg-portfolio-bg-primary hover:bg-portfolio-primary text-portfolio-text-muted hover:text-white rounded-lg flex items-center justify-center transition-all duration-300"
                      aria-label={link.label}
                      data-testid={`social-${link.label.toLowerCase()}`}
                    >
                      <link.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-portfolio-bg-primary rounded-2xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit} data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-portfolio-text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-portfolio-bg-secondary border border-portfolio-text-muted/30 rounded-lg text-portfolio-text-primary placeholder-portfolio-text-muted focus:border-portfolio-primary focus:outline-none focus:ring-2 focus:ring-portfolio-primary/20 transition-all duration-300"
                    placeholder="John"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-portfolio-text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-portfolio-bg-secondary border border-portfolio-text-muted/30 rounded-lg text-portfolio-text-primary placeholder-portfolio-text-muted focus:border-portfolio-primary focus:outline-none focus:ring-2 focus:ring-portfolio-primary/20 transition-all duration-300"
                    placeholder="Doe"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-portfolio-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-portfolio-bg-secondary border border-portfolio-text-muted/30 rounded-lg text-portfolio-text-primary placeholder-portfolio-text-muted focus:border-portfolio-primary focus:outline-none focus:ring-2 focus:ring-portfolio-primary/20 transition-all duration-300"
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-portfolio-text-primary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-portfolio-bg-secondary border border-portfolio-text-muted/30 rounded-lg text-portfolio-text-primary placeholder-portfolio-text-muted focus:border-portfolio-primary focus:outline-none focus:ring-2 focus:ring-portfolio-primary/20 transition-all duration-300"
                  placeholder="Project Discussion"
                  data-testid="input-subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-portfolio-text-primary mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-portfolio-bg-secondary border border-portfolio-text-muted/30 rounded-lg text-portfolio-text-primary placeholder-portfolio-text-muted focus:border-portfolio-primary focus:outline-none focus:ring-2 focus:ring-portfolio-primary/20 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                  data-testid="textarea-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-send-message"
              >
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

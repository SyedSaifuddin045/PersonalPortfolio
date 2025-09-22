import { z } from "zod";

export const portfolioSchema = z.object({
  name: z.string(),
  hero: z.object({
    greeting: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  about: z.object({
    description: z.string(),
  }),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })),
  skills: z.object({
    frontend: z.array(z.object({
      name: z.string(),
      level: z.number().min(1).max(5),
    })),
    backend: z.array(z.object({
      name: z.string(),
      level: z.number().min(1).max(5),
    })),
    tools: z.array(z.object({
      name: z.string(),
      level: z.number().min(1).max(5),
    })),
  }),
  projects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    category: z.enum(["web", "mobile", "api", "game", "graphics", "system", "devops", "vr", "all"]),
    image_folder: z.string(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
  })),
  contact: z.object({
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
  }),
  social: z.object({
    githubUrl: z.string().optional(),
    linkedinUrl: z.string().optional(),
    twitterUrl: z.string().optional(),
  }),
  resumeUrl: z.string().optional(),
});

export type Portfolio = z.infer<typeof portfolioSchema>;

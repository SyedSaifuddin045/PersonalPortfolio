# Portfolio Application

## Overview

This is a full-stack portfolio website built with React and Express.js. The application serves as a personal portfolio showcase, featuring a modern, responsive design with sections for hero content, about information, skills, projects, and contact functionality. The frontend is built with React and uses ShadCN UI components for a polished user interface, while the backend provides API endpoints for portfolio data management and contact form submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: ShadCN UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Storage**: File-based storage using JSON for portfolio data
- **Validation**: Zod schemas for type-safe data validation
- **Development**: Custom Vite integration for seamless full-stack development

### Data Storage Solutions
- **Primary Storage**: JSON file-based storage (`portfolio-data.json`) for portfolio content
- **Database Ready**: Drizzle ORM configured for PostgreSQL migration path
- **In-Memory Caching**: MemStorage class for runtime data caching

### Authentication and Authorization
- **Current State**: No authentication implemented
- **Session Management**: Express session setup ready with connect-pg-simple for future PostgreSQL sessions

### API Structure
- **GET /api/portfolio**: Retrieve complete portfolio data
- **PUT /api/portfolio**: Update portfolio data with validation
- **POST /api/contact**: Handle contact form submissions

### Component Architecture
- **Modular Design**: Separate components for each portfolio section (Hero, About, Skills, Projects, Contact)
- **Reusable UI**: Comprehensive ShadCN UI component library
- **Custom Components**: Project carousel with touch/swipe support and auto-play functionality
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Development Workflow
- **Development Server**: Custom Vite middleware integration with Express
- **Hot Reload**: Full-stack hot module replacement
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Build Process**: Separate client and server build optimizations

### Styling System
- **Design System**: Custom CSS variables for consistent theming
- **Component Variants**: Class Variance Authority for component styling patterns
- **Responsive Design**: Tailwind CSS responsive utilities
- **Custom Animations**: CSS animations for interactive elements

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for data fetching
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS, Class Variance Authority, CLSX for utility classes
- **Forms**: React Hook Form with Zod resolvers for validation
- **Icons**: Lucide React, React Icons for comprehensive icon sets
- **Utilities**: Date-fns for date manipulation, Embla Carousel for image carousels

### Backend Dependencies
- **Server**: Express.js for HTTP server functionality
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon Database serverless driver
- **Validation**: Zod for schema validation and type generation
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: TSX for TypeScript execution, ESBuild for production builds

### Development Tools
- **Build Tools**: Vite with React plugin, TypeScript compiler
- **Code Quality**: TypeScript for static typing, PostCSS for CSS processing
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Error Handling**: Runtime error overlay for development debugging

### Database Configuration
- **ORM**: Drizzle Kit configured for PostgreSQL with schema in `/shared/schema.ts`
- **Migration Path**: Ready for database migration from file-based to PostgreSQL
- **Connection**: Environment-based database URL configuration
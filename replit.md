# Overview

This is a Quantity Price Calculator application with a retro-futuristic theme. It's built as a full-stack web application using React for the frontend, Express for the backend, and includes a PostgreSQL database setup with Drizzle ORM. The application features a stylized robot character and provides a calculator interface for computing unit prices from quantity and total price inputs.

# System Architecture

The application follows a monorepo structure with client-server separation:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing

# Key Components

## Frontend Architecture
- **Client Directory Structure**: All frontend code is contained in the `client/` directory
- **Component Library**: Uses shadcn/ui components for consistent UI elements
- **Styling**: Tailwind CSS with custom retro-futuristic color scheme
- **Navigation**: Wouter-based routing with a landing page and calculator page
- **State Management**: React Query for API state management

## Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL adapter
- **Storage Interface**: Abstracted storage layer with both in-memory and database implementations
- **API Structure**: RESTful API with `/api` prefix for all endpoints
- **Session Management**: PostgreSQL session store using connect-pg-simple

## Database Schema
- **Users Table**: Basic user authentication with username/password fields
- **Schema Location**: Shared schema definition in `shared/schema.ts`
- **Migrations**: Drizzle-kit handles database migrations in `migrations/` directory

## UI Components
- **Landing Page**: Features an animated robot character with retro styling
- **Calculator**: Simple interface for quantity/price calculations
- **Component System**: Extensive shadcn/ui component library for consistent design

# Data Flow

1. User navigates to landing page with animated robot character
2. User can proceed to calculator page via navigation
3. Calculator accepts quantity and total price inputs
4. Unit price calculation is performed client-side
5. Future API endpoints can be added to the Express server via the storage interface
6. Database operations are abstracted through the IStorage interface

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: PostgreSQL database adapter
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router

## UI Libraries
- **@radix-ui/***: Comprehensive set of unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Development Tools
- **vite**: Frontend build tool and dev server
- **typescript**: Type safety across the application
- **drizzle-kit**: Database migration and introspection tool

# Deployment Strategy

The application is configured for Replit deployment with the following setup:

- **Build Process**: Vite builds the client, esbuild bundles the server
- **Production Mode**: Serves static files and API from a single Express server
- **Development Mode**: Vite dev server with HMR support
- **Database**: PostgreSQL module is included in the Replit configuration
- **Port Configuration**: Server runs on port 5000, mapped to external port 80

The deployment uses an autoscale configuration and includes proper build/start scripts for production deployment.

# Changelog

```
Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Completed quantity calculator with unit selection dropdown
- June 25, 2025. Added reset buttons to all calculator steps with proper positioning
- June 25, 2025. Cleaned up navigation flow by removing redundant back buttons
- June 25, 2025. Simplified price calculator by removing unnecessary unit selection
- June 25, 2025. Added comprehensive unit options including quintal, ton, and gallon
- June 25, 2025. Implemented bidirectional smart unit conversion for optimal result display
- June 25, 2025. Added chatty robot responses explaining calculations and results
- June 25, 2025. Fixed robot chat bubble display to show conversational feedback properly
- June 25, 2025. Made welcome text responsive and fixed robot positioning to prevent jumping
- June 25, 2025. Optimized mobile display with proper scaling for iPhone SE and added scrollable right panel
- June 25, 2025. Enhanced sound effects with 12 different retro audio types using Web Audio API
- June 25, 2025. Applied retro typography with glowing effects throughout entire app
- June 25, 2025. Fixed robot 360° rotation animation to work consistently on first execution
- June 25, 2025. Implemented offline functionality with service worker and local calculations
- June 25, 2025. Added Capacitor configuration for Android APK generation with native features
```

# User Preferences

```
Preferred communication style: Simple, everyday language.
```
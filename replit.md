# WealthIQ - Money Personality Quiz

## Overview

WealthIQ is a financial personality assessment application that helps users discover their "money mindset" through an interactive card-swiping quiz game. Users swipe through questions (Tinder-style) to reveal their financial archetype, then provide their email to unlock detailed results with data visualizations.

The application follows a three-page flow:
1. **Landing Page** - Hero section with branding and call-to-action
2. **Game Page** - Tinder-style card swiping quiz with timer and progress
3. **Results Page** - Email gate followed by charts showing personality scores

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state, localStorage for quiz results persistence
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for card swiping and page transitions
- **Charts**: Recharts for radar and bar chart visualizations on results page
- **Fonts**: DM Sans (body) and Playfair Display (headings) via Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: Vite for frontend, esbuild for server bundling
- **API Design**: REST endpoints with Zod validation schemas defined in `shared/routes.ts`

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Tables**:
  - `questions` - Quiz questions with text and category
  - `submissions` - User results with email, name, and JSON scores
  - `sessions` - Authentication session storage
  - `users` - User accounts for admin access

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Protected Routes**: Admin endpoints require authentication via `isAuthenticated` middleware

### Key Design Patterns
- **Shared Types**: Schema and API contracts shared between client and server in `/shared`
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Email Gate Pattern**: Results page requires email submission before showing full visualization
- **Temporary Storage**: Quiz scores stored in localStorage during game, persisted to database on completion

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe queries
- Drizzle Kit for migrations (`npm run db:push`)

### Authentication
- Replit OpenID Connect for user authentication
- Session secret via `SESSION_SECRET` environment variable
- Issuer URL defaults to `https://replit.com/oidc`

### UI Component Libraries
- Radix UI primitives (dialog, dropdown, toast, etc.)
- shadcn/ui pre-configured components
- Lucide React for icons

### Animation & Visualization
- Framer Motion for drag/swipe gestures
- Recharts for data visualization (radar charts, bar charts)
- Embla Carousel for carousel components
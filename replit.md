# Trading Signal Admin Panel

## Overview

A modern full-stack trading signal management platform built with React, Express, and PostgreSQL. The application provides real-time trading signal tracking, user management, historical data analysis, and feature toggles for administrative control. Designed with a utility-focused, data-intensive interface inspired by Linear, Vercel, and Stripe design systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React with TypeScript as the core framework
- Wouter for client-side routing (lightweight alternative to React Router)
- Vite as the build tool and development server

**UI System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode as primary theme with light mode support
- Design system follows "new-york" style variant with functional minimalism
- Custom color palette optimized for trading data visualization (profit green, loss red, warning amber)

**State Management**
- TanStack React Query (v5) for server state management and data fetching
- React Hook Form with Zod validation for form state
- Local component state using React hooks

**Key Feature Components**
- Dashboard with metric cards and performance charts (Recharts)
- Trading signals table with sorting, filtering, pagination, and CSV export
- User management with role-based access control
- Historical data analysis with collapsible symbol tracking
- Feature toggles for global and user-specific permissions

### Backend Architecture

**Server Framework**
- Express.js running on Node.js
- TypeScript for type safety across the stack
- Vite middleware integration for development (HMR support)

**API Design**
- RESTful API structure with `/api` prefix convention
- HTTP server setup using Node's native `http.createServer`
- Middleware chain: JSON parsing, URL encoding, request logging
- Centralized error handling with status code mapping

**Storage Layer**
- In-memory storage interface (`MemStorage`) with CRUD operations
- Database-agnostic storage interface (`IStorage`) for future PostgreSQL integration
- Currently implements user management operations (getUser, getUserByUsername, createUser)

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver (`@neondatabase/serverless`)
- Schema definitions using Drizzle's PostgreSQL table builders
- Zod integration for runtime validation via `drizzle-zod`

**Schema Design**
- Users table with UUID primary keys (PostgreSQL `gen_random_uuid()`)
- Type-safe insert and select operations through Drizzle inference
- Migration support configured in `drizzle.config.ts`

**Current Implementation Status**
- Schema defined for users (id, username, password)
- In-memory storage active for development
- Database credentials configured via `DATABASE_URL` environment variable

### Authentication & Authorization

**Planned Authentication**
- JWT/OAuth2 token-based authentication (infrastructure ready)
- Session management using `connect-pg-simple` for PostgreSQL-backed sessions
- Password hashing (not yet implemented)

**Authorization Model**
- Role-based access control (admin/user roles defined in UI)
- Feature-level permissions via toggles system
- User-specific feature access control

## External Dependencies

### Core UI Libraries
- **Radix UI**: Comprehensive primitive components for accessible UI (dialogs, dropdowns, popovers, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component system with "new-york" style preset

### Data Visualization
- **Recharts**: Charting library for performance metrics and historical data visualization
- **Embla Carousel**: Carousel/slider functionality

### Forms & Validation
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Schema validation for forms and API data
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon Database
- **drizzle-kit**: CLI tool for migrations and schema management

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **TypeScript**: Static type checking across frontend and backend
- **esbuild**: Fast JavaScript bundler for production server code
- **@replit plugins**: Replit-specific development enhancements (error overlay, dev banner, cartographer)

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx + tailwind-merge**: Class name utility combination
- **cmdk**: Command palette component
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express
- **express-session**: Session middleware (implicitly required by connect-pg-simple)
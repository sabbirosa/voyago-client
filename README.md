# Voyago Client

Voyago Client is the frontend application for the Voyago platform, built with Next.js 16 (App Router), React 19, and TypeScript. It provides a modern, responsive user interface for connecting travelers with local guides, enabling tour discovery, booking management, and comprehensive dashboards for tourists, guides, and administrators.

## Table of Contents

- [Overview](#overview)
- [Live Deployment](#live-deployment)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling](#styling)
- [Internationalization](#internationalization)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Live Deployment

The Voyago Client is deployed and available at:

- **Production Client**: [https://voyago-client-ten.vercel.app](https://voyago-client-ten.vercel.app)
- **Production API**: [https://voyago-api.vercel.app](https://voyago-api.vercel.app)

## Overview

Voyago Client is a full-featured web application that enables:

- User registration and authentication
- Tour listing discovery with advanced filtering
- Booking request and management workflow
- Secure payment processing integration
- Real-time messaging between users
- Review and rating system
- Role-specific dashboards (Tourist, Guide, Admin)
- Profile management
- Wishlist functionality
- Notification system
- Responsive design with dark mode support

## Technology Stack

### Core Technologies

- **Framework**: Next.js 16.0.7 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Language**: TypeScript

### UI & Styling

- **CSS Framework**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Tabler Icons, Lucide React
- **Theme**: next-themes (dark mode support)
- **Animations**: tw-animate-css

### Form Management

- **Form Library**: React Hook Form
- **Validation**: Zod
- **Form Resolver**: @hookform/resolvers

### Data Management

- **Table Management**: TanStack React Table
- **Date Handling**: date-fns, react-day-picker
- **Charts**: Recharts

### Additional Libraries

- **Drag & Drop**: @dnd-kit
- **Image Cropping**: @origin-space/image-cropper
- **Notifications**: Sonner
- **Command Palette**: cmdk
- **Carousel**: embla-carousel-react
- **OTP Input**: input-otp

## Architecture

The application follows Next.js App Router architecture with a feature-based organization:

```
voyago-client/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-otp/
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── admin/         # Admin dashboard
│   │   ├── bookings/      # Booking management
│   │   ├── guide/         # Guide dashboard
│   │   ├── listings/      # Listing management
│   │   ├── profile/       # User profile
│   │   └── tourist/       # Tourist dashboard
│   ├── guide/             # Public guide pages
│   ├── tours/             # Tour detail pages
│   └── explore/           # Tour discovery
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard-specific components
│   ├── landing/          # Landing page components
│   ├── message/          # Messaging components
│   ├── notification/     # Notification components
│   ├── review/           # Review components
│   └── ui/               # UI primitives (shadcn/ui)
├── lib/                  # Utilities and configurations
│   ├── api/              # API client functions
│   ├── auth/             # Authentication utilities
│   ├── hooks/            # Custom React hooks
│   ├── i18n/             # Internationalization
│   ├── validation/       # Zod validation schemas
│   └── utils.ts          # General utilities
├── providers/            # React context providers
├── public/               # Static assets
└── hooks/                # Additional custom hooks
```

## Features

### Authentication

- User registration with email verification
- Login with JWT token management
- OTP-based email verification
- Protected routes with role-based access
- Token refresh mechanism
- Secure token storage

### Tour Discovery

- Browse tours by category
- Advanced filtering (location, price, duration, category)
- Search functionality
- Popular destinations showcase
- Top guides display
- Tour detail pages with full information

### Booking Management

- Create booking requests
- View booking history
- Booking status tracking
- Cancel bookings
- Booking calendar integration

### Payment Integration

- Stripe checkout integration
- Payment status tracking
- Transaction history

### Messaging

- Real-time messaging between tourists and guides
- Message threading by booking
- Read receipt indicators
- Message history

### Reviews & Ratings

- Post-booking review submission
- Rating system (1-5 stars)
- Review display on listings
- Review moderation

### User Profiles

- Profile creation and editing
- Avatar upload with image cropping
- Guide profile management
- Expertise and experience tracking
- Language preferences

### Dashboards

#### Tourist Dashboard

- Upcoming trips
- Booking history
- Wishlist management
- Profile settings
- Payment history

#### Guide Dashboard

- Listing management (CRUD)
- Booking requests and approvals
- Availability calendar
- Earnings and analytics
- Guide profile management
- Badge system

#### Admin Dashboard

- User management (approval, banning)
- Listing moderation
- Booking oversight
- Payment analytics
- System statistics
- User role management

### Additional Features

- Wishlist functionality
- Notification system
- Dark mode support
- Responsive design
- Internationalization support
- Image upload and management
- Data tables with pagination and sorting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git**

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd voyago-client
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables (see [Configuration](#configuration))

4. Run the development server:

```bash
npm run dev
```

## Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Base URL for the Voyago API (must include `/api/v1`)

The application automatically normalizes the API URL to ensure it includes `/api/v1` if not already present.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Project Structure

### App Router Pages

- `app/page.tsx` - Landing page
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page
- `app/(auth)/verify-otp/page.tsx` - OTP verification
- `app/dashboard/page.tsx` - Dashboard home (role-based)
- `app/dashboard/admin/` - Admin dashboard pages
- `app/dashboard/guide/` - Guide dashboard pages
- `app/dashboard/tourist/` - Tourist dashboard pages
- `app/explore/page.tsx` - Tour discovery page
- `app/tours/[id]/page.tsx` - Tour detail page
- `app/guide/[id]/page.tsx` - Guide profile page

### Components

#### Common Components

- `AppShell` - Main application shell with navigation
- `Navbar` - Top navigation bar
- `Footer` - Site footer
- `Hero` - Landing page hero section
- `Logo` - Application logo
- `ThemeButton` - Dark mode toggle
- `LanguageSwitcher` - Language selection

#### Dashboard Components

- `app-sidebar` - Dashboard sidebar navigation
- `PageHeader` - Page header with title and actions
- `data-table` - Reusable data table component
- `section-cards` - Dashboard section cards

#### Landing Page Components

- `Hero` - Hero section
- `HowItWorks` - How it works section
- `PopularDestinations` - Popular destinations showcase
- `TopGuides` - Top guides display
- `Categories` - Tour categories
- `Testimonials` - User testimonials
- `CTASection` - Call-to-action section

#### UI Components

The `components/ui/` directory contains shadcn/ui components including:

- Buttons, Cards, Dialogs, Forms
- Inputs, Selects, Tables
- Tabs, Accordions, Alerts
- And many more reusable UI primitives

### API Client

The `lib/api/` directory contains API client functions organized by feature:

- `admin.ts` - Admin API calls
- `auth.ts` - Authentication API calls
- `booking.ts` - Booking API calls
- `guide.ts` - Guide API calls
- `listing.ts` - Listing API calls
- `message.ts` - Messaging API calls
- `notification.ts` - Notification API calls
- `payment.ts` - Payment API calls
- `review.ts` - Review API calls
- `upload.ts` - File upload API calls
- `user.ts` - User API calls
- `wishlist.ts` - Wishlist API calls

### Authentication

Authentication is handled through:

- `lib/auth/tokenStorage.ts` - Token storage utilities
- `lib/auth/useAuth.tsx` - Authentication context and hook
- `components/auth/RouteGuard.tsx` - Route protection component

### Validation

Zod validation schemas are located in `lib/validation/`:

- `auth.ts` - Authentication validation
- `booking.ts` - Booking validation
- `listing.ts` - Listing validation
- `profile.ts` - Profile validation
- `review.ts` - Review validation
- `settings.ts` - Settings validation

## Authentication

The application uses JWT-based authentication:

1. User logs in via `/login`
2. Access and refresh tokens are stored securely
3. Tokens are included in API requests via Authorization header
4. Route guards protect authenticated routes
5. Role-based access control restricts routes by user role

### Protected Routes

Routes are protected using the `RouteGuard` component and role-based middleware:

- Tourist routes: `/dashboard/tourist/*`
- Guide routes: `/dashboard/guide/*`
- Admin routes: `/dashboard/admin/*`

## Routing

Next.js App Router is used for routing:

- File-based routing in the `app/` directory
- Route groups with `(auth)` for authentication pages
- Dynamic routes with `[id]` for detail pages
- Layout components for shared UI

## State Management

State management is handled through:

- React Context API for global state (authentication, theme)
- React Hook Form for form state
- Local component state with React hooks
- Server-side data fetching with Next.js

## Styling

The application uses Tailwind CSS for styling:

- Utility-first CSS framework
- Custom theme configuration
- Dark mode support via `next-themes`
- Responsive design with mobile-first approach
- Custom animations via `tw-animate-css`

### Theme Configuration

The theme is configured in `app/globals.css` and uses CSS variables for theming. Dark mode is toggled via the `ThemeProvider` component.

## Internationalization

Basic internationalization support is included:

- Language switcher component
- i18n configuration in `lib/i18n/config.ts`
- Support for multiple languages (structure in place)

## Deployment

### Vercel Deployment

The application is optimized for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

### Environment Variables for Production

Ensure `NEXT_PUBLIC_API_URL` is set to your production API URL:

```env
NEXT_PUBLIC_API_URL=https://voyago-api.vercel.app/api/v1
```

## Performance Optimization

The application includes several performance optimizations:

- Next.js Image optimization
- Code splitting and lazy loading
- Server-side rendering where appropriate
- Static generation for public pages
- Optimized bundle size

## Browser Support

The application supports modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure code follows the project's style guidelines
4. Run linter: `npm run lint`
5. Test your changes thoroughly
6. Submit a pull request

## License

ISC

## Support

For issues and questions, please contact the development team or create an issue in the repository.

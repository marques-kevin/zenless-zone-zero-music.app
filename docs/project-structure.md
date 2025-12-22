# Project Structure

This document explains the organization and structure of the ZZZ Music project.

## Overview

This is a Gatsby-based React application built with TypeScript. It uses Redux for state management, Firebase for backend services, and follows a modular architecture pattern.

## Directory Structure

```
zzz/
├── cms/                    # Content Management System files
│   ├── ladders/           # Ladder character data
│   └── news/              # News markdown files
├── docs/                   # Documentation files
├── musics/                 # Music MP3 files
├── public/                 # Static assets (generated)
├── scripts/                # Utility scripts
│   ├── youtube-downloader/ # YouTube download utilities
│   ├── generate-ladder-stats.ts
│   ├── get-music-durations.sh
│   └── sync-music.ts
├── src/                    # Source code
│   ├── components/        # React components
│   ├── constants/         # Application constants
│   ├── database/          # File-based database
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization
│   ├── interfaces/        # TypeScript interfaces
│   ├── lib/               # Utility libraries
│   ├── modules/           # Dependency injection modules
│   ├── pages/             # Gatsby pages
│   ├── redux/             # Redux store and slices
│   ├── repositories/      # Data access layer
│   ├── routes/            # Route components
│   ├── services/          # Business logic services
│   ├── styles/            # Global styles
│   ├── templates/         # Gatsby page templates
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── static/                 # Static assets (source)
└── [config files]         # Gatsby, TypeScript, Tailwind configs
```

## Key Directories Explained

### `src/components/`

React components organized by feature. Each component typically has:
- A main component file (`.tsx`)
- A container file (`.ts`) for Redux connections
- Subdirectories for complex components

**Notable components:**
- `player-bar/` - Main music player interface
- `playlists-column/` - Sidebar with playlists
- `tracks-list/` - List of tracks
- `ui/` - Reusable UI components (shadcn/ui)

### `src/database/`

File-based database system for tracks, albums, and artists:

- `tracks.ts` - Main tracks file that aggregates all tracks
- `albums.ts` - Album/playlist definitions
- `artists.ts` - Artist definitions
- `albums/` - Individual album files (e.g., `1.4.ts`, `anby.ts`)

**How it works:**
- Tracks are defined as TypeScript arrays
- Albums and artists are spread into track objects
- All tracks are aggregated in `tracks.ts` and exported

### `src/redux/`

Redux state management organized by feature:

- `store.ts` - Store configuration
- `actions.ts` - Action creators
- Feature slices:
  - `auth/` - Authentication state
  - `player/` - Music player state
  - `playlists/` - Playlists state
  - `modals/` - Modal visibility state
  - `news/` - News state
  - `ladder/` - Ladder/leaderboard state
  - `global/` - Global application state

### `src/repositories/`

Data access layer implementing repository pattern:

- `auth.repository.firebase.ts` - Firebase authentication
- `playlists.repository.firebase.ts` - User playlists (Firebase)
- `likes.repository.firebase.ts` - Track likes (Firebase)
- `ladder.repository.firebase.ts` - Ladder data (Firebase)
- `ladder.repository.in-memory.ts` - In-memory ladder (for testing)

**Pattern:**
- Each repository implements an interface from `src/interfaces/`
- Provides abstraction over data sources (Firebase, etc.)
- Used by Redux thunks for async operations

### `src/services/`

Business logic services:

- `analytics.service.plausible.ts` - Analytics tracking
- `firebase.service.ts` - Firebase initialization
- `localstorage.service.window.ts` - LocalStorage wrapper

### `src/modules/`

Dependency injection modules:

- `ModuleProvider.ts` - Main module provider
- `ProductionModule.ts` - Production dependencies
- `DevelopmentModule.ts` - Development dependencies
- `TestModule.ts` - Test dependencies

**Purpose:**
- Provides dependency injection for repositories and services
- Allows swapping implementations (e.g., Firebase vs in-memory)
- Used by Redux store initialization

### `src/interfaces/`

TypeScript interfaces for dependency injection:

- `IAuthRepository.ts` - Authentication repository interface
- `IPlaylistsRepository.ts` - Playlists repository interface
- `ILikesRepository.ts` - Likes repository interface
- `ILadderRepository.ts` - Ladder repository interface
- `IAnalyticsService.ts` - Analytics service interface
- `IModule.ts` - Module interface

### `src/types/`

TypeScript type definitions:

- `track.type.ts` - Track and related types
- `playlist.type.ts` - Playlist types
- `user.ts` - User types
- `ladders.type.ts` - Ladder types
- `analytics.type.ts` - Analytics types
- `translations.type.ts` - Translation types

### `src/routes/`

Route-level components:

- `home.tsx` - Home page route component

### `src/templates/`

Gatsby page templates:

- `home.tsx` - Home page template
- `ladders/` - Ladder page templates

### `src/pages/`

Gatsby pages (404, etc.):

- `404.tsx` - 404 error page

## Architecture Patterns

### Dependency Injection

The project uses a module-based dependency injection system:

1. **Interfaces** define contracts (`src/interfaces/`)
2. **Repositories/Services** implement interfaces (`src/repositories/`, `src/services/`)
3. **Modules** wire dependencies (`src/modules/`)
4. **ModuleProvider** selects the appropriate module based on environment
5. **Redux store** receives modules during initialization

### Repository Pattern

Data access is abstracted through repositories:

- Repositories implement interfaces
- Redux thunks use repositories (not direct Firebase calls)
- Easy to swap implementations (Firebase → in-memory for testing)

### Component Architecture

Components follow a container/presenter pattern:

- **Container** (`*.container.ts`) - Connects to Redux, handles logic
- **Component** (`*.tsx`) - Presentational component, receives props

### State Management

Redux Toolkit with feature-based slices:

- Each feature has its own slice (auth, player, playlists, etc.)
- Thunks handle async operations
- Selectors extract derived state

## Configuration Files

### Root Level

- `gatsby-config.ts` - Gatsby configuration
- `gatsby-node.ts` - Gatsby Node API (page creation)
- `gatsby-browser.ts` - Gatsby Browser API
- `gatsby-ssr.tsx` - Gatsby SSR API
- `wrap-root-element.tsx` - Redux Provider wrapper
- `wrap-page-element.tsx` - Page wrapper
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `package.json` - Dependencies and scripts

### Firebase

- `firebase.json` - Firebase configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes

## Build Process

1. **Development**: `yarn start`
   - Runs `gatsby develop` on port 28473
   - Serves music files on port 28474
   - Hot reload enabled

2. **Production**: `yarn build`
   - Generates static files in `public/`
   - Optimizes assets
   - Creates GraphQL schema

3. **Deployment**: Static files can be deployed to any static hosting

## Data Flow

1. **Tracks**: Defined in `src/database/` → Used by components → Played via audio player
2. **User Data**: Firebase → Repository → Redux → Components
3. **Playlists**: User creates → Firebase → Repository → Redux → Components
4. **Likes**: User likes track → Firebase → Repository → Redux → Components

## Key Technologies

- **Gatsby** - Static site generator
- **React** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Firebase** - Backend services (Auth, Firestore)
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **React Intl** - Internationalization

## Scripts

- `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn sync-music` - Sync music files to Cloudflare R2
- `yarn ladder:stats` - Generate ladder statistics
- `yarn mp3` - Download music from YouTube
- `yarn typecheck` - Type check without building
- `yarn test` - Run tests


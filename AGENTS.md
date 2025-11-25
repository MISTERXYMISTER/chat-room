# Agent Guidelines

## Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with TypeScript checking
- `npm run lint` - Run ESLint with Next.js configuration
- `npm run start` - Start production server

## Architecture Overview
- **Framework**: Next.js 16.0.4 with App Router and React 19.2.0
- **Database**: MongoDB Atlas with in-memory fallback for development
- **Real-time**: Socket.IO v4.8.1 for bidirectional messaging
- **Styling**: Tailwind CSS v4 with custom animations
- **Deployment**: Vercel-optimized with serverless functions

## Code Style

### Imports
- Use absolute imports with `@/` prefix for internal modules
- Group imports: React/Next.js → third-party → internal types → internal functions
- Example: `import { useState } from 'react'; import { io } from 'socket.io-client'; import { Room } from '@/types/room';`

### TypeScript
- Strict mode enabled with comprehensive type coverage
- Define interfaces in `/src/types/room.ts` and `/src/types/socket.ts`
- Use proper typing for Socket.IO events and MongoDB operations
- Handle optional types safely (socket.id may be undefined)

### Naming Conventions
- Components: PascalCase (ChatRoom.tsx)
- Functions/variables: camelCase (sendMessage, roomId)
- Constants: UPPER_SNAKE_CASE (MONGODB_URI)
- Files: kebab-case for utilities, PascalCase for components

### Error Handling
- Use try-catch for async operations with graceful fallbacks
- Database operations fall back to in-memory storage when MongoDB unavailable
- Return proper error responses in API routes
- Handle Socket.IO connection errors with user feedback

### React Patterns
- Use functional components with hooks and `'use client'` directive
- Implement proper cleanup in useEffect for Socket.IO connections
- Use useRef for DOM elements and socket instances
- State management with useState for messages and connection status

### Database Operations
- Use unified interface in `/src/lib/rooms.ts` for both MongoDB and in-memory
- MongoDB connection pooling via `/src/lib/mongodb.ts` with development caching
- Room auto-expiration: 3-7 days random duration
- Participant tracking and message persistence

### Socket.IO Implementation
- Server handler in `/src/pages/api/socket/index.ts`
- Room-based messaging with join/leave events
- CORS configuration for cross-origin requests
- Proper event cleanup on component unmount

### Environment Variables
- `MONGODB_URI`: Optional MongoDB connection string
- Falls back to in-memory storage if not provided
- Never commit actual credentials to version control

### Testing & Development
- Application works without MongoDB for local development
- Test room creation, joining, and real-time messaging
- Verify responsive design on mobile and desktop
- Check cleanup functionality via `/api/cleanup` endpoint
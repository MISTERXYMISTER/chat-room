# Chat Rooms

A real-time chat application built with Next.js, Socket.IO, and MongoDB Atlas.

## Features

- **Custom Room IDs**: Create rooms with your own custom names or use auto-generated UUIDs.
- **Real-time Messaging**: Instant message delivery using Socket.IO.
- **No Login Required**: Jump straight into chatting without authentication.
- **Auto-expiration**: Rooms are automatically deleted after 3-7 days.
- **Responsive Design**: Works seamlessly on mobile and desktop.
- **In-Memory Fallback**: Works locally without a database connection for testing.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript and Tailwind CSS
- **Backend**: Node.js with Socket.IO (integrated via Next.js API routes)
- **Database**: MongoDB Atlas (optional for dev, required for persistence)
- **Deployment**: Vercel compatible

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chat-rooms
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up MongoDB:
   - If you want persistent data, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```
   - Add your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chatrooms?retryWrites=true&w=majority
   ```
   - **Note**: If you skip this step, the app will use in-memory storage. Data will be lost when the server restarts.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chat-rooms/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page (Create/Join Room)
│   │   └── room/[roomId]/   # Dynamic Room Page
│   ├── pages/               # Next.js Pages Router (for API)
│   │   └── api/
│   │       └── socket/      # Socket.IO Server Handler
│   ├── components/          # React Components
│   │   └── ChatRoom.tsx     # Chat Interface
│   ├── lib/                 # Utility Functions
│   │   ├── mongodb.ts       # Database Connection (with fallback)
│   │   └── rooms.ts         # Room Logic (DB/Memory abstraction)
│   └── types/               # TypeScript Definitions
└── public/                  # Static Assets
```

## How It Works

1.  **Room Creation**:
    *   Enter a **Custom Name** (e.g., "team-meeting") to create a specific URL.
    *   Or click **Create Random Room** to generate a unique ID.
2.  **Joining**: Share the room URL or ID with others to join.
3.  **Messaging**: Socket.IO handles real-time bidirectional communication.
4.  **Storage**:
    *   **With MongoDB**: Messages and rooms are stored in the database.
    *   **Without MongoDB**: Data is stored in server memory (dev mode only).

## API Endpoints

- `GET /` - Home page
- `GET /room/[roomId]` - Chat room interface
- `GET /api/socket` - Initializes the Socket.IO server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

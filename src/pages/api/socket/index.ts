import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { getRoom, addMessage, addParticipant } from '@/lib/rooms';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const httpServer: NetServer = res.socket.server as NetServer & { io?: ServerIO };
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-room', async (roomId: string) => {
        socket.join(roomId);
        await addParticipant(roomId, socket.id);
        
        const room = await getRoom(roomId);
        if (room) {
          socket.emit('room-messages', room.messages);
          socket.to(roomId).emit('user-joined', socket.id);
        }
      });

      socket.on('send-message', async (data: { roomId: string; message: string }) => {
        await addMessage(data.roomId, {
          content: data.message,
          senderId: socket.id
        });

        const room = await getRoom(data.roomId);
        if (room) {
          io.to(data.roomId).emit('new-message', {
            id: Math.random().toString(36).substr(2, 9),
            content: data.message,
            timestamp: new Date(),
            senderId: socket.id
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.to(room).emit('user-left', socket.id);
          }
        });
      });
    });
  }
  res.end();
};

export default SocketHandler;
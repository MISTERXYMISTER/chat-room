import clientPromise from '@/lib/mongodb';
import { Room } from '@/types/room';

// Mock store
const globalWithMock = global as typeof global & {
  _mockRooms?: Map<string, Room>;
};

if (!globalWithMock._mockRooms) {
  globalWithMock._mockRooms = new Map();
}
const mockRooms = globalWithMock._mockRooms!;

export async function createRoom(roomId: string): Promise<Room> {
  const client = await clientPromise;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + Math.floor(Math.random() * 5) + 3);

  const room: Room = {
    roomId,
    messages: [],
    createdAt: new Date(),
    expiresAt,
    participants: []
  };

  if (client) {
    const db = client.db('chatrooms');
    await db.collection('rooms').insertOne(room);
  } else {
    mockRooms.set(roomId, room);
  }

  return room;
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const client = await clientPromise;

  if (client) {
    const db = client.db('chatrooms');
    const room = await db.collection('rooms').findOne({ roomId });
    return room as Room | null;
  } else {
    return mockRooms.get(roomId) || null;
  }
}

export async function addMessage(roomId: string, message: { content: string; senderId: string }): Promise<void> {
  const client = await clientPromise;

  const newMessage = {
    id: Math.random().toString(36).substr(2, 9),
    content: message.content,
    timestamp: new Date(),
    senderId: message.senderId
  };

  if (client) {
    const db = client.db('chatrooms');
    await db.collection('rooms').updateOne(
      { roomId },
      {
        $push: { messages: newMessage as any },
        $addToSet: { participants: message.senderId }
      }
    );
  } else {
    const room = mockRooms.get(roomId);
    if (room) {
      room.messages.push(newMessage);
      if (!room.participants.includes(message.senderId)) {
        room.participants.push(message.senderId);
      }
    }
  }
}

export async function addParticipant(roomId: string, participantId: string): Promise<void> {
  const client = await clientPromise;

  if (client) {
    const db = client.db('chatrooms');
    await db.collection('rooms').updateOne(
      { roomId },
      { $addToSet: { participants: participantId } }
    );
  } else {
    const room = mockRooms.get(roomId);
    if (room && !room.participants.includes(participantId)) {
      room.participants.push(participantId);
    }
  }
}

export async function cleanupExpiredRooms(): Promise<void> {
  const client = await clientPromise;

  if (client) {
    const db = client.db('chatrooms');
    await db.collection('rooms').deleteMany({
      expiresAt: { $lt: new Date() }
    });
  } else {
    const now = new Date();
    for (const [id, room] of mockRooms.entries()) {
      if (room.expiresAt < now) {
        mockRooms.delete(id);
      }
    }
  }
}

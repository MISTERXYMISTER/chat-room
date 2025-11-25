import { ObjectId } from 'mongodb';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
}

export interface Room {
  _id?: ObjectId;
  roomId: string;
  messages: Message[];
  createdAt: Date;
  expiresAt: Date;
  participants: string[];
}
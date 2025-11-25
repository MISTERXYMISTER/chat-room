'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/room';

interface ChatRoomProps {
  roomId: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetch('/api/socket');

    const socket = io({
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setCurrentUserId(socket.id || '');
      socket.emit('join-room', roomId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('room-messages', (roomMessages: Message[]) => {
      setMessages(roomMessages);
    });

    socket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-joined', (userId: string) => {
      console.log('User joined:', userId);
    });

    socket.on('user-left', (userId: string) => {
      console.log('User left:', userId);
    });

    socket.on('connect_error', (err) => {
      setError('Failed to connect to chat server');
      console.error('Connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;

    socketRef.current?.emit('send-message', {
      roomId,
      message: newMessage.trim(),
    });

    setNewMessage('');
  };

  const leaveRoom = () => {
    socketRef.current?.disconnect();
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-800 mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
              Room: {roomId}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {connected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
          <button
            onClick={leaveRoom}
            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ml-2"
          >
            Leave Room
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t p-3 sm:p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                disabled={!connected}
              />
              <button
                type="submit"
                disabled={!connected || !newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

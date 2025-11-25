'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [customRoomId, setCustomRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createRoom = async () => {
    setLoading(true);
    const newRoomId = customRoomId.trim()
      ? customRoomId.trim().replace(/[^a-zA-Z0-9-_]/g, '-')
      : uuidv4().substr(0, 8);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = async () => {
    if (!roomId.trim()) return;
    setLoading(true);
    router.push(`/room/${roomId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Chat Rooms
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create or join a private chat room
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              value={customRoomId}
              onChange={(e) => setCustomRoomId(e.target.value)}
              placeholder="Custom Room Name (Optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && createRoom()}
            />
            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 text-sm sm:text-base"
            >
              {loading ? 'Creating...' : (customRoomId.trim() ? 'Create Custom Room' : 'Create Random Room')}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or join existing</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter existing room ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              onClick={joinRoom}
              disabled={loading || !roomId.trim()}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 text-sm sm:text-base"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          Rooms expire automatically after 3-7 days
        </p>
      </div>
    </div>
  );
}

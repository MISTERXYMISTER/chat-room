import ChatRoom from '@/components/ChatRoom';
import { createRoom, getRoom } from '@/lib/rooms';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: PageProps) {
  const { roomId } = await params;

  let room;
  try {
    room = await getRoom(roomId);

    if (!room) {
      room = await createRoom(roomId);
    }
  } catch (error) {
    console.error('Failed to load room:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-800 mb-2">Room Error</h2>
          <p className="text-red-600 mb-4">Unable to access this room.</p>
          <Link
            href="/"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <ChatRoom roomId={roomId} />;
}

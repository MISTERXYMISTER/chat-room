import { NextApiRequest, NextApiResponse } from 'next';
import { cleanupExpiredRooms } from '@/lib/rooms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await cleanupExpiredRooms();
    res.status(200).json({ message: 'Expired rooms cleaned up successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
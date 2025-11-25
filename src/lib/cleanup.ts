import cron from 'node-cron';
import { cleanupExpiredRooms } from '@/lib/rooms';

cron.schedule('0 2 * * *', async () => {
  console.log('Running daily cleanup of expired rooms...');
  try {
    await cleanupExpiredRooms();
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
});

console.log('Room cleanup scheduler initialized');
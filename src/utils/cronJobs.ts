import * as cron from 'node-cron';
import updateBookingStatus from './bookingStatusUpdater.ts';

export const startCronJobsSimple = () => {
  console.log('🚀 Starting cron jobs...');

  // Update booking status every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('🔄 Running booking status update cron job...');
    await updateBookingStatus();
  });

  // Run at midnight for thorough cleanup
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 Running midnight booking status update...');
    await updateBookingStatus();
  });

  console.log('✅ Cron jobs scheduled');
  
  // Run immediately on startup
  updateBookingStatus().catch(console.error);
};
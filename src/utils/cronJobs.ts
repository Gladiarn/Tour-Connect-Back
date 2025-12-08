import * as cron from 'node-cron';
import updateBookingStatus from './bookingStatusUpdater.ts';

export const startCronJobsSimple = () => {
  console.log('🚀 Starting cron jobs for booking status updates...');

  // Run every 10 minutes for testing/development
  cron.schedule('*/10 * * * *', async () => {
    console.log('⏰ Running 10-minute booking status check...');
    try {
      const result = await updateBookingStatus();
      console.log(`📊 10-minute update result:`, result);
    } catch (err) {
      console.error('❌ 10-minute cron job error:', err);
    }
  });

  // Run daily at midnight (0:00) for production
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily midnight booking status check...');
    try {
      const result = await updateBookingStatus();
      console.log(`📊 Daily update result:`, result);
    } catch (err) {
      console.error('❌ Daily cron job error:', err);
    }
  });

  // Run every hour for more frequent updates
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running hourly booking status check...');
    try {
      const result = await updateBookingStatus();
      console.log(`📊 Hourly update result:`, result);
    } catch (err) {
      console.error('❌ Hourly cron job error:', err);
    }
  });

  // Run immediately on server start
  (async () => {
    console.log('🚀 Running initial booking status update on server start...');
    try {
      const result = await updateBookingStatus();
      console.log(`📊 Initial update result:`, result);
    } catch (err) {
      console.error('❌ Initial booking update error:', err);
    }
  })();
};
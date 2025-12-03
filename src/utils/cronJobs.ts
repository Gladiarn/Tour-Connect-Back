import * as cron from 'node-cron';
import updateBookingStatus from './bookingStatusUpdater.ts';

export const startCronJobsSimple = () => {
  console.log('🚀 Starting cron jobs...');


  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('🔄 Running booking status update cron job...');
      await updateBookingStatus();
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });


  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🌙 Running midnight booking status update...');
      await updateBookingStatus();
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });

  console.log('✅ Cron jobs scheduled');
  
  (async () => {
    try {
      await updateBookingStatus();
    } catch (err) {
      console.error('Initial booking update error:', err);
    }
  })();
};

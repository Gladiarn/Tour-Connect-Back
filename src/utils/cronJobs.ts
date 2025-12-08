import * as cron from 'node-cron';
import updateBookingStatus from './bookingStatusUpdater.ts';

export const startCronJobsSimple = () => {
  console.log('🚀 Starting cron jobs...');


  cron.schedule('*/10 * * * *', async () => {
    try {
      await updateBookingStatus();
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });


  cron.schedule('0 0 * * *', async () => {
    try {

      await updateBookingStatus();
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });

  
  (async () => {
    try {
      await updateBookingStatus();
    } catch (err) {
      console.error('Initial booking update error:', err);
    }
  })();
};

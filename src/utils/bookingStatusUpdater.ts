// utils/bookingStatusUpdater.ts
import userModel from '../models/userModel.ts';

const updateBookingStatus = async () => {
  try {
    const currentDate = new Date();
    console.log(`⏰ [${currentDate.toISOString()}] Starting booking status update...`);

    const users = await userModel.find({});
    let totalUpdated = 0;

    for (const user of users) {
      let userUpdated = false;

      user.bookings.forEach((booking) => {
        const bookingDate = new Date(booking.dateStart);
        
        if ((booking.status === 'upcoming' || booking.status === 'ongoing') && 
            bookingDate < currentDate) {
          booking.status = 'completed';
          userUpdated = true;
          totalUpdated++;
          console.log(`✅ Updated booking ${booking._id} from ${booking.status} to completed`);
        }
      });

      if (userUpdated) {
        await user.save();
      }
    }

    console.log(`✅ Booking status update completed. Updated ${totalUpdated} bookings.`);
    return totalUpdated;
  } catch (error) {
    console.error('❌ Error updating booking statuses: ', error);
    throw error;
  }
};

export default updateBookingStatus;
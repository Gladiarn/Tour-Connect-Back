// utils/bookingStatusUpdater.ts
import userModel from '../models/userModel.ts';

const updateBookingStatus = async () => {
  try {
    const currentDate = new Date();
    console.log(`⏰ [${currentDate.toISOString()}] Starting booking status update...`);

    const users = await userModel.find({});
    let totalUpdated = 0;
    let packageBookingsUpdated = 0;
    let hotelBookingsUpdated = 0;
    let destinationBookingsUpdated = 0;

    for (const user of users) {
      let userUpdated = false;

      // Update destination bookings
      user.bookings.forEach((booking) => {
        const bookingDate = new Date(booking.dateStart);
        
        if ((booking.status === 'upcoming' || booking.status === 'ongoing') && 
            bookingDate < currentDate) {
          booking.status = 'completed';
          userUpdated = true;
          totalUpdated++;
          destinationBookingsUpdated++;
          console.log(`✅ Updated destination booking ${booking._id} to completed`);
        }
      });

      // Update hotel bookings
      user.hotelBookings.forEach((hotelBooking) => {
        const checkOutDate = new Date(hotelBooking.checkOutDate);
        
        if ((hotelBooking.status === 'upcoming' || hotelBooking.status === 'ongoing') && 
            checkOutDate < currentDate) {
          hotelBooking.status = 'completed';
          userUpdated = true;
          totalUpdated++;
          hotelBookingsUpdated++;
          console.log(`✅ Updated hotel booking ${hotelBooking._id} to completed`);
        }
      });

      // Update package bookings
      user.packageBookings.forEach((packageBooking) => {
        const bookingDate = new Date(packageBooking.dateStart);
        
        if ((packageBooking.status === 'upcoming' || packageBooking.status === 'ongoing') && 
            bookingDate < currentDate) {
          packageBooking.status = 'completed';
          userUpdated = true;
          totalUpdated++;
          packageBookingsUpdated++;
          console.log(`✅ Updated package booking ${packageBooking._id} to completed`);
        }
      });

      if (userUpdated) {
        await user.save();
        console.log(`💾 Saved updates for user ${user.email}`);
      }
    }

    console.log(`✅ Booking status update completed. Summary:`);
    console.log(`   Total updated: ${totalUpdated}`);
    console.log(`   Destination bookings: ${destinationBookingsUpdated}`);
    console.log(`   Hotel bookings: ${hotelBookingsUpdated}`);
    console.log(`   Package bookings: ${packageBookingsUpdated}`);
    
    return {
      totalUpdated,
      destinationBookingsUpdated,
      hotelBookingsUpdated,
      packageBookingsUpdated
    };
  } catch (error) {
    console.error('❌ Error updating booking statuses: ', error);
    throw error;
  }
};

export default updateBookingStatus;
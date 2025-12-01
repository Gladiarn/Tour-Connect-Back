import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  destinationReference: { 
    type: String, 
    required: true 
  },
  tourType: { 
    type: String, 
    enum: ['dayTour', 'overnightStay'], 
    required: true 
  },
  transportation: [{ 
    type: String, 
    enum: ['vanRental', 'boatTransfer'] 
  }],
  image: { type: String, required: true },
  dateBooked: { type: Date, default: Date.now },
  dateStart: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userType: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Destination' 
  }],
  bookings: [bookingSchema]
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
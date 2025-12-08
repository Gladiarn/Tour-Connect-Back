import mongoose from "mongoose";

// Booking Schema (for destinations)
const bookingSchema = new mongoose.Schema({
  destinationReference: {
    type: String,
    required: true,
  },
  tourType: {
    type: String,
    enum: ["dayTour", "overnightStay"],
    required: true,
  },
  transportation: [
    {
      type: String,
      enum: ["vanRental", "boatTransfer"],
    },
  ],
  image: { type: String, required: true },
  dateBooked: { type: Date, default: Date.now },
  dateStart: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
});

// Hotel Booking Schema - Matches your bookRoomTypes state
const hotelBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  nightCount: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  roomReference: {
    type: String,
    required: true,
  },
  hotelReference: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  // optional
  roomDetails: {
    name: { type: String },
    price: { type: Number },
    features: [{ type: String }],
    facilities: [{ type: String }],
    description: { type: String },
    guests: [{ type: String }],
    area: { type: String },
  },
  hotelDetails: {
    name: { type: String },
    location: { type: String },
    rating: { type: Number },
  },
  dateBooked: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
});

// Package Booking Schema - Based on what we're sending
const packageBookingSchema = new mongoose.Schema({
  packageReference: {
    type: String,
    required: true,
  },
  image: { 
    type: String, 
    required: true 
  },
  dateBooked: { 
    type: Date, 
    default: Date.now 
  },
  dateStart: { 
    type: Date, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  // Package details for reference (optional but useful)
  packageDetails: {
    name: { type: String },
    location: { type: String },
    duration: { type: String },
    packsize: {
      min: { type: Number },
      max: { type: Number }
    },
    price: { type: Number },
    pricePerHead: { type: Number },
    inclusions: [{ type: String }],
    description: { type: String }
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
  },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userType: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  favorites: [
    {
      type: String,
    },
  ],
  bookings: [bookingSchema],     
  hotelBookings: [hotelBookingSchema],
  packageBookings: [packageBookingSchema],
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
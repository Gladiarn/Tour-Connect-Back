// models/hotelModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  location: string;
  images: string[];
  duration: string;
  reference: string;
  rooms: {
    roomReference: string;
    name: string;
    image: string;
    features: string[];
    facilities: string[];
    description: string;
    price: number;
    guests: string[];
    area: string;
  }[];
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema({
  roomReference: { 
    type: String, 
    required: [true, "Room reference is required"],
    unique: true 
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  features: [{ type: String }],
  facilities: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true },
  guests: [{ type: String }],
  area: { type: String, required: true }
});

const HotelSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, "Hotel reference is required"],
      unique: true,
      trim: true,
    },
    images: [{
      type: String,
      required: [true, "At least one image is required"],
    }],
    duration: {
      type: String,
    },
    rooms: [RoomSchema],
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHotel>('Hotel', HotelSchema);
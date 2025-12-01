import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  activityType: string;
  rating: number;
  images: string[];
  description: string;
  budget: number;
  location: string;
  bestTimeToVisit: string;
  tips: string[];
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    activityType: {
      type: String,
      required: [true, "Activity type is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    images: [
      {
        type: String,
        required: [true, "At least one image is required"],
      },
    ],
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    bestTimeToVisit: {
      type: String,
      required: [true, "Best time to visit is required"],
    },
    tips: [
      {
        type: String,
      },
    ],
    reference: {
      type: String,
      required: [true, "Reference is required"],
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model<IDestination>('destination', DestinationSchema)
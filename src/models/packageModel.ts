import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  location: string;
  inclusions: string[];
  pricePerHead: number;
  duration: string;
  description: string;
  price: number;
  images: string[];
  packsize: {
    min: number;
    max: number;
  };
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  inclusions: [{
    type: String,
    required: true
  }],
  pricePerHead: {
    type: Number,
    required: [true, 'Price per head is required'],
    min: [0, 'Price per head cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  packsize: {
    min: {
      type: Number,
      required: [true, 'Minimum pack size is required'],
      min: [1, 'Minimum pack size must be at least 1']
    },
    max: {
      type: Number,
      required: [true, 'Maximum pack size is required'],
      validate: {
        validator: function(this: any, value: number) {
          return value >= this.packsize.min;
        },
        message: 'Maximum pack size must be greater than or equal to minimum'
      }
    }
  },
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});


export default mongoose.model<IPackage>('Package', PackageSchema);
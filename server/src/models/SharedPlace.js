import mongoose from 'mongoose';

const sharedPlaceSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, index: true },
    place: { type: Object, required: true }
  },
  { timestamps: true }
);

export const SharedPlace = mongoose.model('SharedPlace', sharedPlaceSchema);

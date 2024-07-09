import mongoose from "mongoose";

export interface IRating {
  _id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  restaurantId: mongoose.Types.ObjectId,
  rating: number,
  createdAt: Date,
  updatedAt: Date
};

const ratingSchema = new mongoose.Schema<IRating>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;

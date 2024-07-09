import mongoose from "mongoose";

export interface IRestaurant {
  _id: mongoose.Types.ObjectId,
  name: string,
  address: string,
  phone: string,
  createdAt: Date,
  updatedAt: Date
};

const restaurantSchema = new mongoose.Schema<IRestaurant>({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;

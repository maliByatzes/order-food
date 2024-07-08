import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId,
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string,
  createdAt: Date,
  updatedAt: Date
};

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "driver"]
  },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;

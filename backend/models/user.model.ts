import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string,
  email: string,
  phone: string,
  role: string
};

const userSchema = new mongoose.Schema({
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

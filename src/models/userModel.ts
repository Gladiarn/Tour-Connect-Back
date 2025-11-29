import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userType: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;

import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;

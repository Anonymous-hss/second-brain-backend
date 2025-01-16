import mongoose, { model, Schema } from "mongoose";
mongoose.connect("");

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);

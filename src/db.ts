import mongoose, { model, Schema } from "mongoose";
mongoose.connect(
  "mongodb+srv://h2424:h2424@cluster0.c2mlnwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);

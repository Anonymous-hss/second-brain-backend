import mongoose, { model, Schema } from "mongoose";
mongoose.connect(
  "mongodb+srv://h2424:h2424@cluster0.c2mlnwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
});

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const LinkModel = model("Links", LinkSchema);

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", contentSchema);

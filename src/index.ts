import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({ username: username, password: password });

    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Username already exists",
    });
    return;
  }
});

app.get("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await UserModel.findOne({
    username,
    password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Invalid username or password",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });

  res.json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    content,
  });
});

app.delete("/api/v1/content", async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId: contentId,
    //@ts-ignore
    userId: userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", async (req, res) => {
  const contentId = req.body;

  try {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.findOne({ _id: contentId, userId });

    if (!content) {
      res.status(404).json({ message: "Content not found" });
    }

    const shareLink = contentId._id;

    res.json({
      message: "Content Shared Successfully",
      shareLink: `/api/vi/brain/${shareLink}`,
    });
  } catch (err) {
    res.json({
      message: err + "Cannot Share the content",
    });
  }
});

// app.get(
//   "/api/v1/brain/:shareLink",
//   async (req: Request<{ shareLink: string }>, res: Response) => {
//     const { shareLink } = req.params;

//     try {
//       const content = await ContentModel.findOne({ _id: shareLink });
//       if (!content) {
//         return res.status(404).json({ message: "content not found" });
//       }

//       res.json({
//         content,
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Error retriving content" + err });
//     }
//   }
// );

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

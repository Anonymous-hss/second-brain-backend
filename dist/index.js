"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.UserModel.create({ username: username, password: password });
        res.json({
            success: true,
        });
    }
    catch (error) {
        res.json({
            success: false,
            message: "Username already exists",
        });
        return;
    }
}));
app.get("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username,
        password,
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, config_1.JWT_PASSWORD);
        res.json({
            token,
        });
    }
    else {
        res.status(403).json({
            message: "Invalid username or password",
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: [],
    });
    res.json({
        message: "Content Added",
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({
        userId: userId,
    }).populate("userId", "username");
    res.json({
        content,
    });
}));
app.delete("/api/v1/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.ContentModel.deleteMany({
        contentId: contentId,
        //@ts-ignore
        userId: userId,
    });
    res.json({
        message: "Deleted",
    });
}));
app.post("/api/v1/brain/share", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body;
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = yield db_1.ContentModel.findOne({ _id: contentId, userId });
        if (!content) {
            res.status(404).json({ message: "Content not found" });
        }
        const shareLink = contentId._id;
        res.json({
            message: "Content Shared Successfully",
            shareLink: `/api/vi/brain/${shareLink}`,
        });
    }
    catch (err) {
        res.json({
            message: err + "Cannot Share the content",
        });
    }
}));
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

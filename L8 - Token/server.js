import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rootRouterV1 from "./api/routers/index.js";
import authMiddleware from "./api/middleware/auth.js";
dotenv.config();
// await mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

app.use("/api/v1", rootRouterV1);

app.get("/protected", authMiddleware.verifyToken, (req, res) => {
  res.send({
    message: "Welcome to the protected route!",
    userId: req.user.userId,
  });
});

// Kết nối tới MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Bắt đầu server sau khi kết nối thành công
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rootRouterV1 from "./api/routers/index.js";

dotenv.config();
await mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

app.use("/api/v1", rootRouterV1);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import rootRouterV1 from "./api/routers/index.js";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.DATABASE_URL);
const app = express();
app.use(express.json());

app.use("/api/v1", rootRouterV1);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

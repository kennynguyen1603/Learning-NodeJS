import express from "express";
import mongoose from "mongoose";
import rootRouterV1 from "./api/routers/index.js";

await mongoose.connect(
  "mongodb+srv://kennynguyen1603young:590199@kennynguyen.ezzwilu.mongodb.net/learningmgdb?retryWrites=true&w=majority&appName=KennyNguyen"
);

const app = express();

app.use(express.json());

app.use("/api/v1", rootRouterV1);

app.listen(8080, () => {
  console.log("Server is running at 8080");
});

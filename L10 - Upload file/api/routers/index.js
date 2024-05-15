import { Router } from "express";
import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
import UsersModel from "../models/users.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const rootRouterV1 = Router();

cloudinary.config({
  cloud_name: "dlotuochc",
  api_key: "476264771374938",
  api_secret: "65AJv0n7cnjaAGzpQci4LruSwZI",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

rootRouterV1.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    // console.log(postId);
    const existingPost = await PostsModel.findById(postId);
    console.log(existingPost);
    if (!existingPost) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
        data: null,
      });
    }
    const allComments = await CommentsModel.find({ postId: postId })
      .populate("authorId")
      .exec();

    res.status(200).send({
      data: allComments,
      message: "Comments retrieved successfully",
      succcess: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve comments",
      success: false,
      data: null,
    });
  }
});

rootRouterV1.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorId } = req.body;
    if (!content) throw new Error("Content is required!");
    if (!authorId) throw new Error("AuthorId is required!");
    if (!postId) throw new Error("PostId is required!");

    const existedPost = await PostsModel.findById(postId);
    if (!existedPost) throw new Error("Post is not valid");

    const existedUser = await UsersModel.findById(authorId);
    if (!existedUser) throw new Error("User is not valid");

    const createComment = await CommentsModel.create({
      postId,
      content,
      authorId,
    });

    res.status(201).send({
      data: createComment,
      message: "create comment successfull",
      succcess: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// tạo bài post với file hinh ảnh (xử lí nếu không có hình ảnh thì tạo bài post ko có hỉnh ảnh)
rootRouterV1.post("/posts/upload", upload.single("file"), async (req, res) => {
  try {
    const { authorId, content } = req.body;
    const file = req.file;

    if (!authorId) throw new Error("Author is required");
    if (!content) throw new Error("Content is required");
    if (file) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];

      try {
        const result = await cloudinary.uploader.upload(dataUrl, {
          public_id: fileName,
          resource_type: "auto",
        });

        const post = await PostsModel.create({
          authorId,
          content,
          file: result.secure_url,
        });

        res.status(201).send({
          message: "Post created successfully.",
          data: post,
          success: true,
        });
      } catch (uploadError) {
        res.status(500).send({
          message: "Failed to upload image.",
          error: uploadError.message,
          success: false,
        });
      }
    } else {
      const post = await PostsModel.create({
        authorId,
        content,
      });
      res.status(201).send({
        message: "Post created successfully.",
        data: post,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message, success: false });
  }
});

// sửa đổi bài post
rootRouterV1.put("/posts/:postId", upload.single("file"), async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const file = req.file;
    let imageUrl;

    const existingPost = await PostsModel.findById(postId);
    if (!existingPost) {
      return res
        .status(404)
        .send({ message: "Post not found", success: false });
    }

    // kiem tra nguoi dang sua co phai la author cua bai post khong?

    // Nếu có file mới được tải lên, cập nhật hình ảnh trên Cloudinary
    if (file) {
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const fileName = file.originalname.split(".")[0];

      const uploadResult = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        resource_type: "auto",
      });

      imageUrl = uploadResult.secure_url;
    } else {
      imageUrl = existingPost.file; // Giữ nguyên URL nếu không có file mới
    }

    existingPost.content = content || existingPost.content;
    existingPost.file = imageUrl;
    await existingPost.save();

    res.status(200).send({
      message: "Post updated successfully",
      data: existingPost,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to update post",
      error: error.message,
      success: false,
    });
  }
});

// tạo bài post có thể upload nhiều file
rootRouterV1.post(
  "/posts/upload-multiple-files",
  upload.array("files"),
  async (req, res) => {
    try {
      const { authorId, content } = req.body;
      const listFiles = req.files;
      const listResult = [];
      if (!authorId) throw new Error("Author is required");
      if (!content) throw new Error("Content is required");
      if (!listFiles || listFiles.length === 0) {
        return res
          .status(400)
          .send({ message: "Please upload files", success: false });
      }
      for (const file of listFiles) {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        const fileName = file.originalname.split(".")[0];

        const result = await cloudinary.uploader.upload(dataUrl, {
          public_id: fileName,
          resource_type: "auto",
        });
        listResult.push(result.secure_url); // Push kết quả vào mảng listResult
      }
      const post = await PostsModel.create({
        authorId,
        content,
        file: listResult,
      });
      res.status(201).send({
        message: "Post created successfully.",
        data: post,
        success: true,
      });
    } catch (error) {
      res.status(500).send({
        message: "Failed to update post",
        error: error.message,
        success: false,
      });
    }
  }
);

// xóa 1 ảnh trên cloudinary
rootRouterV1.delete("/posts/delete-file/:public_id", async (req, res) => {
  try {
    const { public_id } = req.params;
    if (!public_id)
      return res
        .status(400)
        .send({ message: "Public ID is required", success: false });

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res
        .status(200)
        .send({ message: "File deleted successfully", success: true });
    } else {
      return res
        .status(500)
        .send({ message: "Failed to delete file", success: false });
    }
  } catch (error) {
    res.status(error.status || 500).send({
      data: null,
      message: error.Error || "Internal error server",
      success: false,
    });
  }
});

// xóa nhiều ảnh trên cloudinary
rootRouterV1.delete("/posts/delete-files", async (req, res) => {
  try {
    const { publicIds } = req.body;
    if (!publicIds || publicIds.length === 0) {
      return res
        .status(400)
        .send({ message: "Public IDs are required", success: false });
    }
    const deletionResults = [];
    for (const publicId of publicIds) {
      const deletionResult = await cloudinary.uploader.destroy(publicId);
      deletionResults.push(deletionResult);
    }

    const failedDeletions = deletionResults.filter(
      (result) => result.result !== "ok"
    );

    if (failedDeletions.length === 0) {
      return res
        .status(200)
        .send({ message: "All files deleted successfully", success: true });
    } else {
      return res.status(500).send({
        message: "Some files failed to delete",
        success: false,
        failedDeletions,
      });
    }
  } catch (error) {
    res.status(error.status || 500).send({
      data: null,
      message: error.Error || "Internal error server",
      success: false,
    });
  }
});

export default rootRouterV1;

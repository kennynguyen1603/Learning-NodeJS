import express from "express";
import axios from "axios";
import crypto from "crypto";
const app = express();

const API_JSON_SERVER = "http://localhost:3000";

app.use(express.json());

app.get("", (req, res) => {
  res.send({
    message: "Hello kenny",
  });
});

// Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US (ví dụ: US8823).
app.post("/users", async (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName)
      throw {
        message: "Ban chua cung cap ten nguoi dung",
        statusCode: 403,
      };
    const newId = `US${crypto.randomUUID()}`;
    const newUser = {
      id: newId,
      userName,
    };
    const createUser = await axios.post(`${API_JSON_SERVER}/users`, newUser);
    res.status(201).send({
      message: "Dang ki nguoi dung thanh cong",
      data: createUser.data,
    });
  } catch (error) {
    res.status(error.statusCode).send({
      ...error,
      data: null,
    });
  }
});

// Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/posts", async (req, res) => {
  try {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
      throw {
        message: !content
          ? "Chưa có nội dung của bài đăng!"
          : !authorId
          ? "Không xác định được người dùng"
          : "Bài đăng chưa có nội dung, không xác định được người dùng!",
        statusCode: 403,
      };
    }
    const checkUser = await axios.get(`${API_JSON_SERVER}/users/${authorId}`);
    if (!checkUser.data) {
      throw {
        message: "UserId không hợp lệ",
        statusCode: 404,
      };
    }
    const newPost = {
      id: `PS${crypto.randomUUID()}`,
      content: content,
      authorID: authorId,
    };

    const createPost = await axios.post(`${API_JSON_SERVER}/posts`, newPost);
    res.status(201).send({
      message: "Tạo bài post thành công",
      success: true,
      data: createPost.data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "Có lỗi xảy ra",
      data: null,
    });
  }
});

// Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/posts/:postId", async (req, res) => {
  try {
    const { id } = req.params.postId;
    const { content, authorId } = req.body;
    if (!content || !authorId)
      throw {
        message: "Thong tin bai post khong day du",
        statusCode: 400,
      };
    // const checkPost
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "Có lỗi xảy ra",
      data: null,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});

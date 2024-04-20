import express from "express";
import axios from "axios";
import crypto from "crypto";
const app = express();

const API_JSON_SERVER = "http://localhost:3000";

app.use(express.json());
const ERROR_MESSAGES = {
  BadRequest: "Bad request. Invalid input data.",
  Forbidden: "Forbidden. You don't have permission.",
  NotFound: "Resource not found.",
  ServerError: "Internal server error.",
};

function handleError(res, error) {
  const statusCode = error.response ? error.response.status : 500;
  const message = error.response
    ? error.response.data.message
    : ERROR_MESSAGES.ServerError;
  res.status(statusCode).send({ message, data: null });
}

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
    const id = req.params.postId;
    const { content, authorId } = req.body;

    if (!content || !authorId) {
      console.log(content, authorId);
      throw {
        message: "chua du thong tin de chinh sua",
        statusCode: 400,
      };
    }

    const checkPost = await axios.get(`${API_JSON_SERVER}/posts/${id}`);
    console.log(checkPost);
    if (!checkPost || !checkPost.data) {
      throw {
        message: "PostId không tồn tại",
        statusCode: 404,
      };
    }

    if (checkPost.data.authorId !== authorId) {
      throw {
        message: "Ban khong co quyen chinh sua bai viet nay",
        statusCode: 403,
      };
    }

    const updatedPost = {
      id: id,
      content: content,
      authorId: authorId,
    };

    const updatePost = await axios.put(
      `${API_JSON_SERVER}/posts/${id}`,
      updatedPost
    );

    res.status(200).send({
      message: "Chinh sua bai viet thanh cong",
      data: updatePost.data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "Có lỗi xảy ra",
      data: null,
    });
  }
});

// Viết API cho phép user được comment vào bài post

app.listen(8080, () => {
  console.log("Server is running!");
});

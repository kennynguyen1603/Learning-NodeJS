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

// Viết API cho phép user được comment vào bài post.
app.post("/posts/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, authorId } = req.body;
    if (!content || !authorId) {
      throw {
        message: "chua co noi dung comment hoac thong tin nguoi comment",
        statusCode: 400,
      };
    }
    const checkPost = await axios.get(`${API_JSON_SERVER}/posts/${postId}`);
    if (!checkPost) {
      throw {
        message: "Bai viet khong ton tai",
        statusCode: 404,
      };
    }
    const checkUser = await axios.get(`${API_JSON_SERVER}/users/${authorId}`);
    if (!checkUser) {
      throw {
        message: "Nguoi dung khong ton tai",
        statusCode: 404,
      };
    }
    const newComment = {
      id: `CMT${crypto.randomUUID()}`,
      postId,
      content,
      authorId,
    };

    const updatedPost = {
      ...checkPost.data,
      comments: [...(checkPost.data.comments || []), newComment],
    };

    const createComment = await axios.post(
      `${API_JSON_SERVER}/comments`,
      newComment
    );

    const updatePost = await axios.put(
      `${API_JSON_SERVER}/posts/${checkPost.data.id}`,
      updatedPost
    );

    res.status(201).send({
      message: "Dang comment thanh cong",
      data: {
        comment: createComment.data,
        updatedPost: updatePost.data,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "co loi khi comment vao bai post",
      data: null,
    });
  }
});

// Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa).
app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, authorId } = req.body;
    if (!content || !authorId) {
      throw {
        message: "Thông tin người dùng hoặc nội dung comment không hợp lệ.",
        statusCode: 400,
      };
    }
    const checkPost = await axios.get(`${API_JSON_SERVER}/posts/${postId}`);
    if (!checkPost || !checkPost.data) {
      throw {
        message: "Bài post không tồn tại.",
        statusCode: 404,
      };
    }

    const checkComment = await axios.get(
      `${API_JSON_SERVER}/comments/${commentId}`
    );
    if (!checkComment || !checkComment.data) {
      throw {
        message: "Comment không tồn tại.",
        statusCode: 404,
      };
    }
    if (checkComment.data.authorId !== authorId) {
      throw {
        message: "Bạn không có quyền chỉnh sửa comment này.",
        statusCode: 403,
      };
    }

    const updatedComment = {
      ...checkComment.data,
      content: content,
    };

    const updateComment = await axios.put(
      `${API_JSON_SERVER}/comments/${commentId}`,
      updatedComment
    );

    res.status(200).send({
      message: "Chỉnh sửa comment thành công.",
      data: updateComment.data,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "co loi khi sua comment",
      data: null,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});

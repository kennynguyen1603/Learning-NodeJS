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

    // const updatedPost = {
    //   ...checkPost.data,
    //   comments: [...(checkPost.data.comments || []), newComment],
    // };

    const createComment = await axios.post(
      `${API_JSON_SERVER}/comments`,
      newComment
    );

    // const updatePost = await axios.put(
    //   `${API_JSON_SERVER}/posts/${checkPost.data.id}`,
    //   updatedPost
    // );

    res.status(201).send({
      message: "Dang comment thanh cong",
      data: createComment.data,
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

// Viết API lấy tất cả comment của một bài post.
app.get("/posts/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const checkPost = await axios.get(`${API_JSON_SERVER}/posts/${postId}`);

    if (!checkPost || !checkPost.data) {
      throw {
        message: "Bai post khong ton tai",
        statusCode: 404,
      };
    }

    const getComments = await axios.get(`${API_JSON_SERVER}/comments`);

    const listComments = [...getComments.data];

    const commentsOfPost = listComments.filter(
      (comment) => comment.postId === postId
    );

    res.send({
      message: "Lay comments cua bai post thanh cong",
      data: commentsOfPost,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "co loi khi lay comment cua bai viet",
      data: null,
    });
  }
});

// Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId.
app.get("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    const checkPost = await axios.get(`${API_JSON_SERVER}/posts/${postId}`);
    if (!checkPost || !checkPost.data)
      throw {
        message: "Khong tim thay bai viet",
        statusCode: 404,
      };
    const postData = checkPost.data;
    const checkComments = await axios.get(`${API_JSON_SERVER}/comments`);
    const allComments = checkComments.data;
    const commentsOfPost = allComments.filter(
      (comment) => comment.postId === postId
    );
    res.send({
      message: "Lấy bài post và comment thành công",
      data: {
        post: postData,
        comments: commentsOfPost,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "co loi khi lay comment cua bai viet",
      data: null,
    });
  }
});

// Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user
app.get("/posts-with-comments", async (req, res) => {
  try {
    const postResponse = await axios.get(`${API_JSON_SERVER}/posts`);
    const allPosts = postResponse.data;

    const commentResponse = await axios.get(`${API_JSON_SERVER}/comments`);
    const allComments = commentResponse.data;

    // Map posts to include the first three comments
    const postsWithComments = await Promise.all(
      allPosts.map(async (post) => {
        const postComments = allComments
          .filter((comment) => comment.postId === post.id)
          .slice(0, 3);
        return {
          ...post,
          comments: postComments,
        };
      })
    );

    res.status(200).send({
      message: "Lấy bài viết cùng với ba bình luận đầu thành công",
      data: postsWithComments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({
      message: error.message || "co loi xay ra khi lay bai viet va binh luan",
      data: null,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});

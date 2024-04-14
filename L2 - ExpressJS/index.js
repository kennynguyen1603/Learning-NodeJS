import express from "express";
import { posts, users } from "./data.js";
const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

// Viết API lấy thông tin của user với id được truyền trên params
app.get("/users/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const user = users.find((user) => user.id === idParam);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});
//Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
app.post("/users/add/", (req, res) => {
  const dataBody = req.body;
  const exists = users.some((user) => user.email === dataBody.email);
  if (exists) {
    return res.status(400).send("User already exists");
  } else {
    const randomID = crypto.randomUUID();
    users.push({
      id: randomID,
      ...dataBody,
    });
    res.send(users);
  }
});
// Viết API lấy ra các bài post của user được truyền userId trên params.
app.get("/users/:id/posts", (req, res) => {
  const { id } = req.params;
  const existedUser = users.find((user) => user.id === id);
  if (!existedUser) {
    res.send("Không tồn tại người dùng!");
  } else {
    const listPost = posts.filter((post) => post.userId === id);
    res.send(listPost);
  }
});

// Viết API thực hiện tạo bài post với id của user được truyền trên params.
app.post("/users/:id/posts", (req, res) => {
  const { id } = req.params;
  const existedUser = users.find((user) => user.id === id);
  if (!existedUser) {
    res.send("Không tồn tại người dùng!");
  } else {
    posts.push({
      userId: id,
      postId: crypto.randomUUID(),
      createdAt: new Date(),
      ...req.body,
    });
    res.send(posts);
  }
});

// Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const dataPostUpdate = req.body;
  const crrPost = posts.find((post) => post.postId === postId);

  if (!crrPost) {
    return res.status(404).send("Không tồn tại bài post!");
  }

  const existedUser = users.find((user) => user.id === crrPost.userId);
  if (!existedUser) {
    return res.status(404).send("Không tồn tại người dùng!");
  }

  if (crrPost.userId === userId) {
    Object.keys(dataPostUpdate).forEach((key) => {
      if (key !== "userId" && key !== "postId") {
        crrPost[key] = dataPostUpdate[key];
      }
    });
    return res.status(200).json(crrPost);
  } else {
    return res.status(403).send("Người dùng không có quyền chỉnh sửa!");
  }
});

// Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
app.delete("/posts/:id", (req, res) => {
  const userId = req.query.userId;
  const postId = req.params.id;

  const postIndex = posts.findIndex((p) => p.postId === postId);

  if (postIndex === -1) {
    return res.status(404).send("Không tìm thấy bài đăng!");
  }

  if (userId !== posts[postIndex].userId) {
    return res.status(403).send("Người dùng không có quyền xóa bài đăng này!");
  }

  posts.splice(postIndex, 1);

  res.status(200).send("Xóa bài đăng thành công!");
  z;
});

// Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.
app.get("/posts/:content", (req, res) => {
  const content = req.params.content;
  const existedContent = posts.filter((p) => p.content === content);
  if (existedContent) {
    res.send(existedContent);
  } else {
    res.send("no exist content");
  }
});

// Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
app.get("/posts/public", (req, res) => {
  const publicPosts = posts.filter((post) => post.isPublic === true);
  res.status(200).json(publicPosts);
});
// app.get("/posts", (req, res) => {
//   const searchContent = req.query.content;

//   // Nếu query param 'content' không tồn tại hoặc trống
//   if (!searchContent) {
//     return res.status(400).send("Vui lòng cung cấp nội dung để tìm kiếm!");
//   }

//   // Tìm kiếm các bài đăng có nội dung chứa chuỗi tìm kiếm
//   const foundPosts = posts.filter((post) =>
//     post.content.includes(searchContent)
//   );

//   // Trả về kết quả tìm kiếm
//   res.status(200).json(foundPosts);
// });

// Middleware to validate postId and userId
// function validatePostAndUser(req, res, next) {
//   const postId = req.params.id;
//   const userId = req.user.id;
//   const post = posts.find((p) => p.postId === postId);
//   if (!post) {
//     return res.status(404).send("Không tồn tại bài post!");
//   }

//   const user = users.find((u) => u.id === post.userId);
//   if (!user) {
//     return res.status(404).send("Không tồn tại người dùng!");
//   }

//   if (post.userId !== userId) {
//     return res.status(403).send("Người dùng không có quyền chỉnh sửa!");
//   }

//   req.post = post;
//   next();
// }

// app.put("/posts/:id", validatePostAndUser, (req, res) => {
//   const dataPostUpdate = req.body;
//   const post = req.post;

//   Object.keys(dataPostUpdate).forEach((key) => {
//     if (key !== "userId" && key !== "postId") {
//       post[key] = dataPostUpdate[key];
//     }
//   });

//   res.status(200).json(post);
// });

//localhost:8080/users/12345/posts/123

URL: http: app.listen(8080, () => {
  console.log("Server is running");
});

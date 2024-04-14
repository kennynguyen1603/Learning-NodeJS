import http from "http";
// import url from "url";
import { users } from "./data.js";

const app = http.createServer((request, response) => {
  // const parsedUrl = url.parse(request.url, true);
  const { method, url } = request;

  const parsedUrl = new URL(`http://localhost:8080${url}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;
  switch (pathname) {
    case "/":
      response.end("Chao mung ban");
      break;

    case "/users":
      if (method === "GET") {
        response.end(JSON.stringify(users));
      }
      break;

    case "/users/old":
      if (method === "GET") {
        response.end(JSON.stringify(users.filter((item) => item.age >= 50)));
      }
      break;

    case "/users/add-random":
      if (method === "GET") {
        const newUser = {
          id: 5,
          userName: "Kenny",
          email: "Kenny@gmail.com",
          address: "Vietnam",
          age: 60,
        };
        users.push(newUser);
        response.end(JSON.stringify(users));
      }
      break;

    case "/users/add":
      if (method === "GET") {
        // http://localhost:8080/users/add?userName="MindX School"&email="mindx@edu.vn"&address="Hà Nội"&age=8
        // const { userName, email, address, age } = query;
        // if (userName && email && address && age) {
        //   const newUser = {
        //     id: users.length + 1,
        //     userName,
        //     email,
        //     address,
        //     age: parseInt(age, 10),
        //   };
        //   users.push(newUser);
        //   response.end(JSON.stringify(newUser));
        // } else {
        //   response.statusCode = 400;
        //   response.end("Missing required information");
        // }
        const newUser = {};
        searchParams.forEach((value, key) => {
          console.log(value, key);
          newUser[key] = value;
        });
        if (Object.keys(newUser).length === 0) {
          response.statusCode = 400;
          response.end("Missing required information");
          return;
        }

        users.push(newUser);

        response.writeHead(201, { "Content-Type": "application/json" });
        response.end(JSON.stringify(newUser));
      }
      break;

    default:
      response.statusCode = 404;
      response.end("404 Not Found");
      break;
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// const userData = endpoint.split("/users/add/");
//     const userData1 = userData[1].split("&");
//     const newUser = {};
//     newUser.id = users.length + 1;
//     userData1.forEach((item) => {
//       const [key, value] = item.split("=");
//       if (key === "age") {
//         newUser[key] = parseInt(value, 10);
//       } else {
//         newUser[key] = value;
//       }
//     });
//     users.push(newUser);
//     response.end(JSON.stringify(users));
//   } else {
//     response.end("404 Notfound");

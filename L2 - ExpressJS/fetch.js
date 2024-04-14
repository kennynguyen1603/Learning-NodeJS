fetch("http://localhost:8080/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userName: "Xeko",
    email: "xeko@gmail.com",
    address: "Tokyo",
  }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Data received:", data);
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });

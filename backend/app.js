const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.get("/api/posts", (req, res) => {
  const posts = [
    {
      title: "Primer post",
      summary: "Este es un post",
      content: "Nuestro primer post desde el servidor",
    },
    {
      title: "Segundo post",
      summary: "Este es un post",
      content: "FELICITACIONES",
    },
  ];
  res.status(200).json(posts);
});

app.post("/api/posts", (req, res) => {
  console.log(req.body);
  res.status(201).json({
    message: "Post agregado",
  });
});

module.exports = app;

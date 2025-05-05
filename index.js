import express from "express";
import users from "./data/users.js"
import posts from "./data/posts.js";
import comments from "./data/comments.js";

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json

// Existing routes (simplified for brevity)
app.get("/api/users", (req, res) => res.json(users));
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) res.json(user);
  else res.status(404).send("User not found");
});
// ... other existing user and post routes ...

// New routes
app.get("/api/users/:id/posts", (req, res) => {
  const userPosts = posts.filter(
    (post) => post.userId === parseInt(req.params.id)
  );
  res.json(userPosts);
});

app.get("/api/posts", (req, res) => {
  if (req.query.userId) {
    const userPosts = posts.filter(
      (post) => post.userId === parseInt(req.query.userId)
    );
    res.json(userPosts);
  } else {
    res.json(posts);
  }
});

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.post("/comments", (req, res) => {
  const newComment = {
    id: Date.now(), // Simple unique ID
    userId: req.body.userId,
    postId: req.body.postId,
    body: req.body.body,
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

app.get("/comments/:id", (req, res) => {
  const comment = comments.find((c) => c.id === parseInt(req.params.id));
  if (comment) res.json(comment);
  else res.status(404).send("Comment not found");
});

app.patch("/comments/:id", (req, res) => {
  const commentIndex = comments.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (commentIndex > -1) {
    comments[commentIndex] = { ...comments[commentIndex], body: req.body.body };
    res.json(comments[commentIndex]);
  } else {
    res.status(404).send("Comment not found");
  }
});

app.delete("/comments/:id", (req, res) => {
  const initialLength = comments.length;
  comments = comments.filter((c) => c.id !== parseInt(req.params.id));
  if (comments.length < initialLength) res.status(204).send();
  else res.status(404).send("Comment not found");
});

app.get("/comments", (req, res) => {
  if (req.query.userId) {
    const userComments = comments.filter(
      (c) => c.userId === parseInt(req.query.userId)
    );
    res.json(userComments);
  } else if (req.query.postId) {
    const postComments = comments.filter(
      (c) => c.postId === parseInt(req.query.postId)
    );
    res.json(postComments);
  } else {
    res.json(comments);
  }
});

app.get("/posts/:id/comments", (req, res) => {
  const postComments = comments.filter(
    (c) => c.postId === parseInt(req.params.id)
  );
  res.json(postComments);
});

app.get("/users/:id/comments", (req, res) => {
  const userComments = comments.filter(
    (c) => c.userId === parseInt(req.params.id)
  );
  res.json(userComments);
});

app.get("/users/:id/comments", (req, res) => {
  const userId = parseInt(req.params.id);
  const postId = req.query.postId ? parseInt(req.query.postId) : null;

  let filteredComments = comments.filter(
    (comment) => comment.userId === userId
  );

  if (postId !== null) {
    filteredComments = filteredComments.filter(
      (comment) => comment.postId === postId
    );
  }

  res.json(filteredComments);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

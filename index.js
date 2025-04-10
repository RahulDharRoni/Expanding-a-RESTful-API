// routes/comments.js
const express = require("express");
const router = express.Router();
const comments = require("../data/comments");
const posts = require("../data/posts");
const users = require("../data/users");

let nextId = 1;

// GET /comments (optional filters: userId, postId)
router.get("/", (req, res) => {
  const { userId, postId } = req.query;
  let result = comments;

  if (userId) result = result.filter((c) => c.userId == userId);
  if (postId) result = result.filter((c) => c.postId == postId);

  res.json(result);
});

// POST /comments
router.post("/", (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId || !postId || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newComment = {
    id: nextId++,
    userId,
    postId,
    body,
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// GET /comments/:id
router.get("/:id", (req, res) => {
  const comment = comments.find((c) => c.id == req.params.id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  res.json(comment);
});

// PATCH /comments/:id
router.patch("/:id", (req, res) => {
  const comment = comments.find((c) => c.id == req.params.id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  if (req.body.body) comment.body = req.body.body;
  res.json(comment);
});

// DELETE /comments/:id
router.delete("/:id", (req, res) => {
  const index = comments.findIndex((c) => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Comment not found" });

  const deleted = comments.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;

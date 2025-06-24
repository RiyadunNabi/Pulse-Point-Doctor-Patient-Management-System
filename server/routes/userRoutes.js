const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Route for getting all users and creating a new user
router.route("/")
  .get(getUsers)
  .post(createUser);

// Route for updating and deleting a specific user by ID
router.route("/:id")
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;


/* const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

// GET all users
router.get("/", getUsers);

// POST: Register a new user
router.post("/", createUser);

module.exports = router; */

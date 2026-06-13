const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");
const authenticateToken = require('../middleware/authMiddleware');




// Public registration
router.post('/', createUser);

// All others protected
router.get('/', authenticateToken, getUsers);
router.patch('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);


module.exports = router;

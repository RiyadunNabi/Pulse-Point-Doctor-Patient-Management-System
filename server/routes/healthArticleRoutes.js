const express = require("express");
const router = express.Router();
const { uploadArticleImage } = require('../middleware/upload');
const healthArticleController = require("../controllers/healthArticleController");

router.route('/')
    .get(healthArticleController.getAllArticles)
    .post(uploadArticleImage.single('articleImage'), healthArticleController.createArticle);

router.route('/:id')
    .get(healthArticleController.getArticleById)
    .patch(uploadArticleImage.single('articleImage'), healthArticleController.updateArticle)
    .delete(healthArticleController.deleteArticle);

module.exports = router;

/* 

const express = require("express");
const router = express.Router();

// Step 1: Import the entire module without destructuring
const uploadMiddlewareObject = require('../middleware/upload');

// Step 2: Log the imported object to the console to see what it contains
console.log('--- DEBUG: The object imported from upload.js contains: ---');
console.log(uploadMiddlewareObject);
console.log('--- END DEBUG ---');

// Using a placeholder middleware for now to prevent the crash
const placeholderMiddleware = (req, res, next) => next();

const healthArticleController = require("../controllers/healthArticleController");

router.route('/')
    .get(healthArticleController.getAllArticles)
    // Step 3: Using the placeholder on the routes
    .post(placeholderMiddleware, healthArticleController.createArticle);

router.route('/:id')
    .get(healthArticleController.getArticleById)
    .patch(placeholderMiddleware, healthArticleController.updateArticle)
    .delete(healthArticleController.deleteArticle);

module.exports = router; */
const express = require("express");
const router = express.Router();
const healthArticleController = require("../controllers/healthArticleController");

router.get("/", healthArticleController.getAllArticles);
router.post("/", healthArticleController.createArticle);
router.patch("/:article_id", healthArticleController.updateArticle);
router.delete("/:article_id", healthArticleController.deleteArticle);

module.exports = router;

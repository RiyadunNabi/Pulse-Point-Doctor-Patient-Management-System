const pool = require("../db/connection");

// CREATE - Add new article
exports.createArticle = async (req, res) => {
  const { doctor_id, title, content, image_path, category } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO health_article (doctor_id, title, content, image_path, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [doctor_id, title, content, image_path, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding article:", err);
    res.status(500).send("Error adding article");
  }
};

// READ - Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM health_article ORDER BY published_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).send("Error fetching articles");
  }
};

// UPDATE - Edit an article (PATCH)
exports.updateArticle = async (req, res) => {
  const { article_id } = req.params;
  const { title, content, image_path, category } = req.body;
  try {
    const result = await pool.query(
      `UPDATE health_article
         SET title = COALESCE($1, title),
             content = COALESCE($2, content),
             image_path = COALESCE($3, image_path),
             category = COALESCE($4, category),
             updated_at = CURRENT_TIMESTAMP
       WHERE article_id = $5
       RETURNING *`,
      [title, content, image_path, category, article_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating article:", err);
    res.status(500).send("Error updating article");
  }
};

// DELETE - Remove an article
exports.deleteArticle = async (req, res) => {
  const { article_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM health_article WHERE article_id = $1 RETURNING *`,
      [article_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).send("Error deleting article");
  }
};

const pool = require('../db/connection');
const fs = require('fs');
const path = require('path');

/**
 * @route   POST /api/health-articles
 */
const createArticle = async (req, res) => {
    const { doctor_id, title, content, category } = req.body;
    if (!doctor_id || !title || !content) {
        return res.status(400).json({ error: 'doctor_id, title, and content are required.' });
    }
    const image_path = req.file ? req.file.path : null;

    try {
        const result = await pool.query(
            `INSERT INTO health_article (doctor_id, title, content, image_path, category)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [doctor_id, title, content, image_path, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating article:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @route   GET /api/health-articles
 */
const getAllArticles = async (req, res) => {
    const { category, doctorId } = req.query;
    try {
        let query = `
            SELECT a.article_id, a.title, a.category, a.published_at, d.first_name, d.last_name
            FROM health_article a
            JOIN doctor d ON a.doctor_id = d.doctor_id
        `;
        const queryParams = [];
        let whereClauses = [];

        if (category) {
            queryParams.push(category);
            whereClauses.push(`a.category = $${queryParams.length}`);
        }
        if (doctorId) {
            queryParams.push(doctorId);
            whereClauses.push(`a.doctor_id = $${queryParams.length}`);
        }
        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }
        query += ' ORDER BY a.published_at DESC';

        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching articles:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @route   GET /api/health-articles/:id
 */
const getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT a.*, d.first_name, d.last_name 
             FROM health_article a
             JOIN doctor d ON a.doctor_id = d.doctor_id
             WHERE a.article_id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Article not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching article:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @route   PATCH /api/health-articles/:id
 */
const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const new_image_path = req.file ? req.file.path : null;

    try {
        if (new_image_path) {
            const oldArticle = await pool.query('SELECT image_path FROM health_article WHERE article_id = $1', [id]);
            if (oldArticle.rows.length > 0 && oldArticle.rows[0].image_path) {
                fs.unlink(oldArticle.rows[0].image_path, (err) => {
                    if (err) console.error("Error deleting old article image:", err);
                });
            }
        }
        
        const result = await pool.query(
            `UPDATE health_article
             SET title = COALESCE($1, title), content = COALESCE($2, content),
                 category = COALESCE($3, category), image_path = COALESCE($4, image_path),
                 updated_at = CURRENT_TIMESTAMP
             WHERE article_id = $5 RETURNING *`,
            [title, content, category, new_image_path, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating article:", err);
        res.status(500).json({ error: "Server error" });
    }
};

/**
 * @route   DELETE /api/health-articles/:id
 */
const deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM health_article WHERE article_id = $1 RETURNING image_path`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Article not found" });
        }
        
        const imagePath = result.rows[0].image_path;
        if (imagePath) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting article image file:", err);
            });
        }
        
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting article:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
};
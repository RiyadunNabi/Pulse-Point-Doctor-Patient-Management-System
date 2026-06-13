const pool = require('../db/connection');


// @desc    Create a new department
// @route   POST /api/departments
const createDepartment = async (req, res) => {
    const { department_name, description } = req.body;

    if (!department_name) {
        return res.status(400).json({ error: "department_name is a required field." });
    }

    try {
        const result = await pool.query(
            "INSERT INTO department (department_name, description) VALUES ($1, $2) RETURNING *",
            [department_name, description || null] // Use null if description is not provided
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding department:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a department
// @route   PATCH /api/departments/:id
const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { department_name, description } = req.body;

    if (!department_name && !description) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    try {
        const result = await pool.query(
            `UPDATE department SET 
         department_name = COALESCE($1, department_name), 
         description = COALESCE($2, description) 
         WHERE department_id = $3 RETURNING *`,
            [department_name, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Department not found." });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating department:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get all departments
// @route   GET /api/departments
const getAllDepartments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM department ORDER BY department_id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching departments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Get departments with aggregated stats+search functionality
// @route   GET /api/departments/stats
const getDepartmentsWithStats = async (req, res) => {
    const { search } = req.query;
    try {
        let sql = 'SELECT * FROM get_departments_with_stats()';
        const params = [];

        if (search) {
            sql = `
          SELECT * FROM get_departments_with_stats()
          WHERE department_name ILIKE $1
            OR description      ILIKE $1
        `;
            params.push(`%${search}%`);
        }

        const { rows } = await pool.query(sql, params);
        const departments = rows.map(d => ({
            ...d,
            doctor_count: parseInt(d.doctor_count, 10),
            avg_department_rating: d.avg_department_rating
                ? parseFloat(d.avg_department_rating).toFixed(1)
                : null,
            avg_consultation_fee: d.avg_consultation_fee
                ? parseFloat(d.avg_consultation_fee).toFixed(2)
                : null,
            min_consultation_fee: d.min_consultation_fee
                ? parseFloat(d.min_consultation_fee).toFixed(2)
                : null,
            max_consultation_fee: d.max_consultation_fee
                ? parseFloat(d.max_consultation_fee).toFixed(2)
                : null,
        }));

        res.status(200).json(departments);
    } catch (err) {
        console.error("Error fetching departments with stats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};




// @desc    Delete a department
// @route   DELETE /api/departments/:id
const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM department WHERE department_id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Department not found." });
        }
        res.status(204).send();
    } catch (err) {
        if (err.code === '23503') {
            return res.status(409).json({ error: "Cannot delete department. It is currently assigned to one or more doctors." });
        }
        console.error("Error deleting department:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    getAllDepartments,
    getDepartmentsWithStats,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};
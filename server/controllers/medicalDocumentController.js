const pool = require("../db/connection");

// Create a new medical document record
exports.createMedicalDocument = async (req, res) => {
  const { patient_id, file_name, file_path, description, last_checkup_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO medical_documents 
        (patient_id, file_name, file_path, description, last_checkup_date) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [patient_id, file_name, file_path, description, last_checkup_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating medical document:", err);
    res.status(500).json({ error: "Failed to create medical document" });
  }
};

// Get all docs for a patient
exports.getDocumentsByPatient = async (req, res) => {
  const { patient_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM medical_documents WHERE patient_id = $1 ORDER BY upload_date DESC`,
      [patient_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch medical documents" });
  }
};

// Delete a medical document by ID
exports.deleteMedicalDocument = async (req, res) => {
  const { document_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM medical_documents WHERE document_id = $1 RETURNING *`,
      [document_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully", document: result.rows[0] });
  } catch (err) {
    console.error("Error deleting medical document:", err);
    res.status(500).json({ error: "Failed to delete medical document" });
  }
};

// Update a medical document by ID
exports.updateMedicalDocument = async (req, res) => {
  const { document_id } = req.params;
  const { file_name, file_path, description, last_checkup_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE medical_documents
       SET file_name = COALESCE($1, file_name),
           file_path = COALESCE($2, file_path),
           description = COALESCE($3, description),
           last_checkup_date = COALESCE($4, last_checkup_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE document_id = $5
       RETURNING *`,
      [file_name, file_path, description, last_checkup_date, document_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(200).json({ message: "Document updated successfully", document: result.rows[0] });
  } catch (err) {
    console.error("Error updating medical document:", err);
    res.status(500).json({ error: "Failed to update medical document" });
  }
};


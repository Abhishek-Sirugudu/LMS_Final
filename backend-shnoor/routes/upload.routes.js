import express from "express";
import multer from "multer";
import pool from "../db/postgres.js";

const router = express.Router();

// 1. Setup Multer (Memory Storage for simplicity, can be S3/GCS later)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// 2. Upload Endpoint
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { originalname, mimetype, buffer } = req.file;

        // Save to 'files' table (re-using the table created for chat)
        // Ensure 'files' table exists (it should from chat module)
        const newFile = await pool.query(
            "INSERT INTO files (filename, mime_type, data) VALUES ($1, $2, $3) RETURNING file_id",
            [originalname, mimetype, buffer]
        );

        const fileId = newFile.rows[0].file_id;

        // Construct a permanent URL using the existing serve endpoint logic
        // We'll expose a generic serve route: /api/upload/files/:id
        const fileUrl = `${process.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/files/${fileId}`;

        console.log(`✅ File uploaded: ${originalname} (ID: ${fileId})`);
        res.json({
            success: true,
            file_url: fileUrl,
            file_id: fileId,
            filename: originalname
        });

    } catch (err) {
        console.error("❌ Upload Error:", err);
        res.status(500).json({ message: "File upload failed" });
    }
});

// 3. Serve Endpoint (similar to chat.controller serveFile)
router.get("/files/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate UUID vs Integer based on your schema. 
        // Chat schema used SERIAL (integer) for file_id.
        const file = await pool.query("SELECT * FROM files WHERE file_id = $1", [id]);

        if (file.rows.length === 0) return res.status(404).send("File not found");

        const { mime_type, data, filename } = file.rows[0];

        // Set headers for inline display (images/pdf)
        res.setHeader('Content-Type', mime_type);
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.send(data);

    } catch (err) {
        console.error("❌ Serve File Error:", err);
        res.status(500).send("Error serving file");
    }
});

export default router;

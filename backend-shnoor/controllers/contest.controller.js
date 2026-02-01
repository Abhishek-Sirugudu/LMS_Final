import pool from "../db/postgres.js";

// Auto-Schema Verification
export const verifyContestSchema = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contests (
                contest_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                instructor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                rules TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Contest schema verified");
    } catch (err) {
        console.error("❌ Contest schema verification failed:", err);
    }
};

export const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, rules, isActive } = req.body;
        const instructor_id = req.user.id;

        const result = await pool.query(
            `INSERT INTO contests (instructor_id, title, description, start_time, end_time, rules, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [instructor_id, title, description, startTime, endTime, rules, isActive]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Contest Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getContests = async (req, res) => {
    try {
        const { role, id } = req.user;
        let query = "SELECT * FROM contests ORDER BY created_at DESC";
        let params = [];

        if (role === 'instructor') {
            query = "SELECT * FROM contests WHERE instructor_id = $1 ORDER BY created_at DESC";
            params = [id];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Get Contests Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

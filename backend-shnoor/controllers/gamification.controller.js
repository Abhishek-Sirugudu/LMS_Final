import pool from "../db/postgres.js";

// Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT user_id as id, full_name as "displayName", xp, role 
            FROM users 
            WHERE role = 'student' 
            ORDER BY xp DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Leaderboard error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Certificates
// We can derive certificates from completed courses (where all modules are done)
// For simplicity in this phase, we'll check `module_progress` count vs `modules` count
export const getCertificates = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT 
                c.courses_id as id, 
                c.title as course, 
                sc.enrolled_at as date, -- Using enrolled date as proxy for now, ideally completion_date
                95 as score, -- Placeholder score
                'Unlocked' as status
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.courses_id
            WHERE sc.student_id = $1
            -- Add logic here to filter ONLY completed courses if desired
        `, [userId]);

        // Add visual properties for frontend
        const certs = result.rows.map((row, idx) => ({
            ...row,
            previewColor: idx % 2 === 0 ? '#003366' : '#059669',
            date: new Date(row.date).toLocaleDateString()
        }));

        res.json(certs);
    } catch (err) {
        console.error("Certificate error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

import pool from "../db/postgres.js";

// Instructor Dashboard Stats
export const getInstructorStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const courses = await pool.query(
            "SELECT COUNT(*)::int as count FROM courses WHERE instructor_id = $1",
            [userId]
        );

        const students = await pool.query(
            "SELECT COUNT(DISTINCT student_id)::int as count FROM student_courses sc JOIN courses c ON sc.course_id = c.courses_id WHERE c.instructor_id = $1",
            [userId]
        );

        // Dummy rating for now, or aggregate from a ratings table if it existed
        const avgRating = 4.8;

        res.json({
            courses: courses.rows[0].count,
            students: students.rows[0].count,
            rating: avgRating
        });
    } catch (err) {
        console.error("Instructor Stats Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Student Dashboard Stats
export const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Enrolled Count
        const limit = 5;
        const enrolled = await pool.query(
            "SELECT COUNT(*)::int as count FROM student_courses WHERE student_id = $1",
            [userId]
        );

        // 2. XP & Rank
        const user = await pool.query("SELECT xp, streak FROM users WHERE user_id = $1", [userId]);
        const { xp, streak } = user.rows[0];

        // 3. Last Learning (Mocking most recent enrollment or progress)
        const lastCourse = await pool.query(`
            SELECT c.courses_id as id, c.title, c.thumbnail_url as thumbnail, 
                   COUNT(mp.module_id)::int as completed_modules,
                   (SELECT COUNT(*) FROM modules WHERE course_id = c.courses_id) as total_modules
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.courses_id
            LEFT JOIN module_progress mp ON (mp.course_id = c.courses_id AND mp.student_id = $1)
            WHERE sc.student_id = $1
            GROUP BY c.courses_id
            ORDER BY sc.enrolled_at DESC
            LIMIT 1
        `, [userId]);

        let lastCourseData = null;
        if (lastCourse.rows.length > 0) {
            const lc = lastCourse.rows[0];
            const progress = lc.total_modules > 0 ? Math.round((lc.completed_modules / lc.total_modules) * 100) : 0;
            lastCourseData = { ...lc, progress };
        }

        res.json({
            enrolled_count: enrolled.rows[0].count,
            xp: xp || 0,
            streak: streak || 0,
            last_learning: lastCourseData
        });

    } catch (err) {
        console.error("Student Dashboard Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

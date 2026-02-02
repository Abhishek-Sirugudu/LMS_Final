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

        // 3. Last Learning
        const lastCourse = await pool.query(`
            SELECT c.courses_id as id, c.title, c.thumbnail_url as thumbnail, 
                   COUNT(mp.module_id)::int as completed_modules,
                   (SELECT COUNT(*) FROM modules WHERE course_id = c.courses_id) as total_modules
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.courses_id
            LEFT JOIN module_progress mp ON (mp.course_id = c.courses_id AND mp.student_id = $1)
            WHERE sc.student_id = $1
            GROUP BY c.courses_id, c.title, c.thumbnail_url, sc.enrolled_at
            ORDER BY sc.enrolled_at DESC
            LIMIT 1
        `, [userId]);

        let lastCourseData = null;
        if (lastCourse.rows.length > 0) {
            const lc = lastCourse.rows[0];
            const progress = lc.total_modules > 0 ? Math.round((lc.completed_modules / lc.total_modules) * 100) : 0;

            // Get current/next module
            const currentModule = await pool.query(`
                SELECT title 
                FROM modules m
                WHERE m.course_id = $1
                AND NOT EXISTS (
                    SELECT 1 FROM module_progress mp 
                    WHERE mp.module_id = m.module_id AND mp.student_id = $2
                )
                ORDER BY m.module_order ASC
                LIMIT 1
            `, [lc.id, userId]);

            const current_module = currentModule.rows.length > 0 ? currentModule.rows[0].title : 'Completed';
            lastCourseData = { ...lc, progress, current_module };
        }

        // 4. Upcoming Deadlines (Assignments)
        // Check if assignments table exists before querying to avoid crashes if migration not run
        // Assuming 'assignments' table exists based on homeworkController.js
        const deadlines = await pool.query(`
            SELECT a.assignment_id as id, a.title, c.title as course, c.courses_id as "courseId", a.due_date as "dueDate",
            CASE WHEN a.due_date < NOW() + INTERVAL '2 days' THEN true ELSE false END as "isUrgent"
            FROM assignments a
            JOIN student_courses sc ON a.course_id = sc.course_id
            JOIN courses c ON c.courses_id = a.course_id
            WHERE sc.student_id = $1
            AND a.due_date > NOW()
            AND NOT EXISTS (SELECT 1 FROM assignment_submissions s WHERE s.assignment_id = a.assignment_id AND s.student_id = $1)
            ORDER BY a.due_date ASC
            LIMIT 5
        `, [userId]);

        // 5. Recent Activity (Exams & Assignments)
        const recentExams = await pool.query(`
            SELECT e.exam_id as id, e.title, 'quiz' as type, 
                   COALESCE(r.percentage, 0) as score, 
                   s.submitted_at as date
            FROM exam_submissions s
            JOIN exams e ON s.exam_id = e.exam_id
            LEFT JOIN exam_results r ON (r.exam_id = s.exam_id AND r.student_id = s.student_id)
            WHERE s.student_id = $1
            ORDER BY s.submitted_at DESC
            LIMIT 5
        `, [userId]);

        // Recent Activity list
        const recentActivity = recentExams.rows;

        res.json({
            enrolled_count: enrolled.rows[0].count,
            xp: xp || 0,
            streak: streak || 0,
            last_learning: lastCourseData,
            upcoming_deadlines: deadlines.rows,
            recent_activity: recentActivity
        });

    } catch (err) {
        console.error("Student Dashboard Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ============================================
   INSTRUCTOR: GET ENROLLED STUDENTS WITH PERFORMANCE
   ============================================ */
export const getInstructorStudents = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const { rows } = await pool.query(`
            SELECT 
                u.user_id as student_id,
                u.full_name as student_name,
                u.email as student_email,
                c.title as course_title,
                c.courses_id,
                sc.enrolled_at,
                -- Calculate module progress
                (SELECT COUNT(*) FROM module_progress mp 
                 WHERE mp.student_id = u.user_id AND mp.course_id = c.courses_id AND mp.completed = true) as completed_modules,
                (SELECT COUNT(*) FROM modules m 
                 WHERE m.course_id = c.courses_id) as total_modules,
                -- Calculate average exam score for this student
                COALESCE((
                    SELECT AVG(er.percentage) 
                    FROM exam_results er 
                    JOIN exams e ON er.exam_id = e.exam_id
                    WHERE er.student_id = u.user_id 
                    AND (e.course_id = c.courses_id OR e.course_id IS NULL)
                ), 0) as avg_score
            FROM student_courses sc
            JOIN users u ON sc.student_id = u.user_id
            JOIN courses c ON sc.course_id = c.courses_id
            WHERE c.instructor_id = $1
            ORDER BY sc.enrolled_at DESC
        `, [instructorId]);

        // Calculate status based on avg_score
        const studentsWithStatus = rows.map(student => {
            const avgScore = parseFloat(student.avg_score) || 0;
            let status = 'Good';
            if (avgScore >= 80) status = 'Excellent';
            else if (avgScore < 60) status = 'At Risk';

            const totalModules = parseInt(student.total_modules) || 1;
            const completedModules = parseInt(student.completed_modules) || 0;
            const progress = Math.round((completedModules / totalModules) * 100);

            return {
                ...student,
                avg_score: Math.round(avgScore),
                progress,
                status
            };
        });

        res.json(studentsWithStatus);
    } catch (err) {
        console.error('Get Instructor Students Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


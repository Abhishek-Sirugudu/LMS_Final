import express from "express";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import attachUser from "../middlewares/attachUser.js";
import roleGuard from "../middlewares/roleGuard.js";
import {
    createAssignment,
    getAssignmentsByCourse,
    submitAssignment,
    getSubmissions,
    gradeSubmission,
    deleteAssignment
} from "../controllers/homeworkController.js";

const router = express.Router();

// Create (Instructor)
router.post(
    "/",
    firebaseAuth,
    attachUser,
    roleGuard("instructor"),
    createAssignment
);

// List by Course (Student/Instructor)
router.get(
    "/course/:courseId",
    firebaseAuth,
    attachUser,
    roleGuard("instructor", "student", "learner"),
    getAssignmentsByCourse
);

// Submit (Student)
router.post(
    "/:id/submit",
    firebaseAuth,
    attachUser,
    roleGuard("student", "learner"),
    submitAssignment
);

// View Submissions (Instructor)
router.get(
    "/:id/submissions",
    firebaseAuth,
    attachUser,
    roleGuard("instructor"),
    getSubmissions
);

// Grade (Instructor)
router.post(
    "/submission/:subId/grade",
    firebaseAuth,
    attachUser,
    roleGuard("instructor"),
    gradeSubmission
);

// Delete Assignment (Instructor)
router.delete(
    "/:id",
    firebaseAuth,
    attachUser,
    roleGuard("instructor"),
    deleteAssignment
);

export default router;

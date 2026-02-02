import express from "express";
import { getInstructorStats, getStudentDashboard, getInstructorStudents } from "../controllers/analytics.controller.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.use(firebaseAuth);
router.use(attachUser);


router.get("/instructor", getInstructorStats);
router.get("/instructor/students", getInstructorStudents);
router.get("/student", getStudentDashboard);

export default router;

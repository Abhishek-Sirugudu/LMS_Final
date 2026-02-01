import express from "express";
import { getLeaderboard, getCertificates } from "../controllers/gamification.controller.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard); // Public? Or auth protected.
router.get("/certificates", firebaseAuth, attachUser, getCertificates);

export default router;

import express from "express";
import { createContest, getContests } from "../controllers/contest.controller.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";
import attachUser from "../middlewares/attachUser.js";

const router = express.Router();

router.use(firebaseAuth);
router.use(attachUser);

router.post("/", createContest);
router.get("/", getContests);

export default router;

import express from "express";
import { getChallenges, getChallengeById } from "../controllers/practice.controller.js";
import firebaseAuth from "../middlewares/firebaseAuth.js";

const router = express.Router();

router.use(firebaseAuth);

router.get("/", getChallenges);
router.get("/:id", getChallengeById);

export default router;

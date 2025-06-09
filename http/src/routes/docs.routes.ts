import { Router } from "express";
import { createDoc, getSingleDoc } from "../controllers/docs.controllers";

const router = Router();

router.post("/create-docs", createDoc);
router.get("/:id", getSingleDoc);

export default router;

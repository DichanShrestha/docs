import { Router } from "express";
import {
  addCollaborator,
  generateCollaborateLink,
  healthCheck,
} from "../controllers/collaboration.controllers";

const router = Router();

router.get("/", addCollaborator);
router.post("/docs/:docId", generateCollaborateLink);
router.get("/health-check", healthCheck);

export default router;

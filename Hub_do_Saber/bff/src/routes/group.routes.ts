// routes/group.routes.ts
import { Router } from "express";
import { getGroupDetail, joinGroup } from "../controllers/group.controller";

const router = Router();

router.get("/:id", getGroupDetail);
router.post("/:id/join", joinGroup);

export default router;

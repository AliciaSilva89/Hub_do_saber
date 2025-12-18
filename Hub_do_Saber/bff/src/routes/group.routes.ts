import { Router } from "express";
import {
  getGroupDetail,
  joinGroup,
  createGroup,
  getMyGroups,
} from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Meus grupos (nova rota)
router.get("/", authMiddleware, getMyGroups);

// Detalhes de um grupo específico
router.get("/:id", authMiddleware, getGroupDetail);

// Entrar em um grupo
router.post("/:id/join", authMiddleware, joinGroup);

// Criar novo grupo
router.post("/", authMiddleware, createGroup);

export default router;

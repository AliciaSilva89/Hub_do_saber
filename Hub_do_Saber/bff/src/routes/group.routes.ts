import { Router } from "express";
// 1. Adicione o 'createGroup' na lista de importações do controller
import {
  getGroupDetail,
  joinGroup,
  createGroup,
} from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Rota para buscar detalhes de um grupo
router.get("/:id", authMiddleware, getGroupDetail);

// Rota para entrar em um grupo
router.post("/:id/join", authMiddleware, joinGroup);

// 2. Rota para criar um novo grupo (POST /bff/group)
router.post("/", authMiddleware, createGroup);

export default router;

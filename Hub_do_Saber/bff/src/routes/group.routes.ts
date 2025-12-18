import { Router } from "express";
import * as groupController from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Listar todos os grupos
router.get("/", authMiddleware, groupController.getAllGroups);

// ⚠️ IMPORTANTE: /my deve vir ANTES de /:id
router.get("/my", authMiddleware, groupController.getMyGroups);

// Buscar detalhes de um grupo específico
router.get("/:id", authMiddleware, groupController.getGroupDetail);

// Entrar em um grupo
router.post("/:id/join", authMiddleware, groupController.joinGroup);

// Criar novo grupo
router.post("/", authMiddleware, groupController.createGroup);

export default router;

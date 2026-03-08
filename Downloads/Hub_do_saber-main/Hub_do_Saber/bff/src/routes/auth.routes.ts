import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// ✅ Rota de login — proxy para o Spring Boot
router.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/login`, req.body, {
      headers: { "Content-Type": "application/json" },
    });
    res.status(response.status).json(response.data);
  } catch (err: any) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: "Erro ao autenticar" });
  }
});

// Logout já existente
router.post("/logout", (req: Request, res: Response) => {
  res.status(204).send();
});

export default router;

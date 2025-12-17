// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  // O Spring Boot exige o prefixo "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token inválido" });
  }

  next();
}

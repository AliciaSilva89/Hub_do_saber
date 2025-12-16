import { Request, Response, NextFunction } from "express";

/**
 * Middleware de autenticação do BFF.
 * Ele NÃO valida o JWT (quem valida é o Spring Boot).
 * Apenas garante que o token exista e o repassa adiante.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1️⃣ Tenta pegar do header Authorization
  const authHeader = req.headers.authorization;

  // 2️⃣ Ou, se preferir, de um cookie (mais seguro)
  // const authHeader = req.cookies?.token;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  // Se vier como "Bearer xxx"
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token inválido" });
  }

  // 3️⃣ Anexa o token à requisição para uso nos controllers
  req.headers.authorization = authHeader;

  next();
}

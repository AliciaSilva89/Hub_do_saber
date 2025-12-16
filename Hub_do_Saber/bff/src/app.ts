import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import groupRoutes from "./routes/group.routes";

const app = express();

// =======================
// 🔧 Middlewares globais
// =======================

// Permite JSON no body
app.use(express.json());

// Cookies (se usar auth via cookie)
app.use(cookieParser());

// CORS (ajuste conforme seu front)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =======================
// 📌 Rotas do BFF
// =======================

app.use("/bff/group", groupRoutes);

// =======================
// 🚨 Tratamento global de erro
// =======================

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Erro interno no BFF" });
  }
);

export default app;

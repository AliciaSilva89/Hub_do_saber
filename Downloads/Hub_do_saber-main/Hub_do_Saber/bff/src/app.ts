import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes"; 

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
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081"; 
const DEFAULT_ALLOWED = [FRONTEND_URL, "http://localhost:8080"];
console.log("🔒 CORS allowed origins:", DEFAULT_ALLOWED.join(", "));

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like mobile apps or curl
      if (!origin) return callback(null, true);
      if (DEFAULT_ALLOWED.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed by BFF"));
    },
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

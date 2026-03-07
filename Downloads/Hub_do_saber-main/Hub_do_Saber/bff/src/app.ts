import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import feedbackRoutes from "./routes/feedbackRoutes"; // ✅ adicionar

const app = express();

// =======================
// 🔧 Middlewares globais
// =======================

app.use(express.json());
app.use(cookieParser());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081";
const DEFAULT_ALLOWED = [FRONTEND_URL, "http://localhost:8080"];
console.log("🔒 CORS allowed origins:", DEFAULT_ALLOWED.join(", "));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (DEFAULT_ALLOWED.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed by BFF"));
    },
    credentials: true,
  }),
);

// =======================
// 📌 Rotas do BFF
// =======================

app.use("/bff/group", groupRoutes);
app.use("/feedbacks", feedbackRoutes); // ✅ adicionar

// =======================
// 🚨 Tratamento global de erro
// =======================

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ message: "Erro interno no BFF" });
  },
);

export default app;

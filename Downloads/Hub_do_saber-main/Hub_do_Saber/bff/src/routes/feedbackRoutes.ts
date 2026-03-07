import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

router.get("/", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(`${BACKEND_URL}/api/feedbacks`, {
      headers: { Authorization: req.headers.authorization || "" }, // ✅ repassa token
    });
    res.json(data);
  } catch (err: any) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: "Erro" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/api/feedbacks`,
      req.body,
      {
        headers: { Authorization: req.headers.authorization || "" }, // ✅ repassa token
      },
    );
    res.status(201).json(data);
  } catch (err: any) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { message: "Erro" });
  }
});

export default router;

import { Router, Request, Response } from "express";

const router = Router();

router.post("/logout", (req: Request, res: Response) => {
  // Como o token é JWT stateless via header, apenas confirmamos o logout
  // O frontend é responsável por remover o token
  res.status(204).send();
});

export default router;

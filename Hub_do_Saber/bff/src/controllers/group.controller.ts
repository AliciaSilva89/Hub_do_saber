// controllers/group.controller.ts
import { Request, Response } from "express";
import * as groupService from "../services/group.service";

export async function getGroupDetail(req: Request, res: Response) {
  try {
    const group = await groupService.fetchGroupDetail(req.params.id);
    res.json(group);
  } catch (e) {
    res.status(500).json({ message: "Erro ao buscar grupo" });
  }
}

export async function joinGroup(req: Request, res: Response) {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Não autorizado" });

    await groupService.joinGroup(req.params.id, token);
    res.sendStatus(200);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

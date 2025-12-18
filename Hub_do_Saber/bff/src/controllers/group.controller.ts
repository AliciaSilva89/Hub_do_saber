import { Request, Response } from "express";
import * as groupService from "../services/group.service";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export async function getGroupDetail(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const token = req.headers.authorization!;
    const groupId = req.params.id;

    console.log(`📥 Recebendo requisição para grupo ${groupId}`);

    const group = await groupService.fetchGroupDetail(groupId, token);

    res.json(group);
  } catch (err) {
    console.error("❌ Erro no controller getGroupDetail:", err);

    let status = 500;
    let message = "Erro ao buscar grupo";

    if (err instanceof Error) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        status = axiosError.response.status;
        message = axiosError.response.data?.message || message;
      }
    }

    res.status(status).json({ message });
  }
}

export async function getMyGroups(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    console.log("📥 Recebendo requisição para meus grupos");

    const groups = await groupService.fetchMyGroups(token);
    res.json(groups);
  } catch (err) {
    console.error("❌ Erro no controller getMyGroups:", err);
    res.status(500).json({ message: "Erro ao buscar seus grupos" });
  }
}

export async function joinGroup(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    const groupId = req.params.id;

    console.log(`📥 Recebendo requisição para entrar no grupo ${groupId}`);

    await groupService.joinGroup(groupId, token);

    res.json({ message: "Entrou no grupo com sucesso" });
  } catch (err) {
    console.error("❌ Erro no controller joinGroup:", err);

    let status = 500;
    let message = "Erro ao entrar no grupo";

    if (err instanceof Error) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        status = axiosError.response.status;
        message = axiosError.response.data?.message || message;
      }
    }

    res.status(status).json({ message });
  }
}

export async function createGroup(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    console.log("📥 Criando grupo:", req.body);

    const groupId = await groupService.createGroup(req.body, token);
    res.status(201).json({ id: groupId });
  } catch (err: any) {
    console.error("❌ Erro no controller createGroup:", err);

    let status = 400;
    let message = err.message || "Erro ao criar grupo";

    res.status(status).json({ message });
  }
}

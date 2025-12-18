import { Request, Response } from "express";
import * as groupService from "../services/group.service";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

/**
 * Lista todos os grupos disponíveis
 */
export async function getAllGroups(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    console.log("📥 BFF: Recebendo requisição para listar todos os grupos");
    const groups = await groupService.fetchAllGroups(token);
    res.json(groups);
  } catch (err) {
    console.error("❌ Erro no controller getAllGroups:", err);
    res.status(500).json({ message: "Erro ao buscar grupos" });
  }
}

/**
 * Busca detalhes de um grupo específico
 */
export async function getGroupDetail(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const token = req.headers.authorization!;
    const groupId = req.params.id;
    console.log(`📥 BFF: Buscando grupo ${groupId}`);
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

/**
 * Busca os grupos do usuário logado
 */
export async function getMyGroups(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    console.log("📥 BFF: Buscando meus grupos");
    const groups = await groupService.fetchMyGroups(token);
    res.json(groups);
  } catch (err) {
    console.error("❌ Erro no controller getMyGroups:", err);
    res.status(500).json({ message: "Erro ao buscar seus grupos" });
  }
}

/**
 * Entra em um grupo específico
 */
export async function joinGroup(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    const groupId = req.params.id;
    console.log(`📥 BFF: Entrando no grupo ${groupId}`);
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

/**
 * Cria um novo grupo
 */
export async function createGroup(req: Request, res: Response): Promise<void> {
  try {
    const token = req.headers.authorization!;
    console.log("📥 BFF: Criando grupo:", req.body);
    const groupId = await groupService.createGroup(req.body, token);
    res.status(201).json({ id: groupId });
  } catch (err: any) {
    console.error("❌ Erro no controller createGroup:", err);
    let status = 400;
    let message = err.message || "Erro ao criar grupo";
    res.status(status).json({ message });
  }
}

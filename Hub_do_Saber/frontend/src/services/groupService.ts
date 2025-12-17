// services/groupService.ts
import axios, { AxiosError } from "axios";

const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:3000";

export interface GroupDetail {
  id: string;
  name: string;
  description: string;
  ownerName: string; // BFF envia ownerName
  maxMembers: number;
  members: any[]; // BFF envia members como array
  disciplineName: string; // BFF envia disciplineName
  universityName: string; // BFF envia universityName
  schedule: string; // BFF envia schedule
}

interface ErrorResponse {
  message: string;
}

/**
 * Busca os detalhes de um grupo específico
 */
export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  try {
    // Pega o token do localStorage (SEM o prefixo Bearer)
    const token = localStorage.getItem("hubdosaber-token");

    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    // Envia para o BFF com o prefixo Bearer
    const response = await axios.get<GroupDetail>(
      `${BFF_URL}/bff/group/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar detalhes do grupo:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("hubdosaber-token");
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    }

    throw new Error("Não foi possível carregar os detalhes do grupo.");
  }
}

/**
 * Entra em um grupo específico
 */
export async function joinGroup(
  groupId: string,
  token?: string
): Promise<void> {
  try {
    // Se não recebeu token como parâmetro, pega do localStorage
    const authToken = token || localStorage.getItem("hubdosaber-token");

    if (!authToken) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    // Remove o prefixo Bearer se já existir (para evitar duplicação)
    const cleanToken = authToken.replace(/^Bearer\s+/i, "");

    // Envia para o BFF com o prefixo Bearer
    await axios.post(
      `${BFF_URL}/bff/group/${groupId}/join`,
      {}, // body vazio
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Erro ao entrar no grupo:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        localStorage.removeItem("hubdosaber-token");
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (axiosError.response?.status === 400) {
        throw new Error(
          axiosError.response.data?.message || "Erro ao processar requisição."
        );
      }
    }

    throw new Error("Não foi possível entrar no grupo.");
  }
}

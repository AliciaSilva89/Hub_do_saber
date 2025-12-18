// services/groupService.ts

import axios, { AxiosError } from "axios";

const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:3000";

// ✅ Interface para grupo resumido (lista)
export interface Group {
  id: string;
  name: string;
  description: string;
  disciplineName: string;
  universityName?: string;
  maxMembers: number;
  currentMembers?: number;
  schedule?: string;
}

// Interface para detalhes completos do grupo
export interface GroupDetail {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  maxMembers: number;
  members: any[];
  disciplineName: string;
  universityName: string;
  schedule: string;
}

interface ErrorResponse {
  message: string;
}

/**
 * ✅ NOVA FUNÇÃO: Busca todos os grupos disponíveis
 */
export async function fetchAllGroups(): Promise<Group[]> {
  try {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    console.log("📥 Frontend: Buscando todos os grupos...");
    const response = await axios.get(`${BFF_URL}/bff/group`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Frontend: Grupos carregados:", response.data.length);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Erro ao buscar grupos:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("hubdosaber-token");
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    }
    throw new Error("Não foi possível carregar os grupos.");
  }
}

/**
 * Busca os detalhes de um grupo específico
 */
export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  try {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    console.log(`📥 Frontend: Buscando detalhes do grupo ${groupId}...`);
    const response = await axios.get(`${BFF_URL}/bff/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao buscar detalhes do grupo:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
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
    const authToken = token || localStorage.getItem("hubdosaber-token");
    if (!authToken) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    const cleanToken = authToken.replace(/^Bearer\s+/i, "");

    console.log(`📥 Frontend: Entrando no grupo ${groupId}...`);
    await axios.post(
      `${BFF_URL}/bff/group/${groupId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      }
    );
    console.log("✅ Frontend: Entrou no grupo com sucesso");
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

/**
 * ✅ NOVA FUNÇÃO: Busca os grupos do usuário logado
 */
export async function fetchMyGroups(): Promise<Group[]> {
  try {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    console.log("📥 Frontend: Buscando meus grupos...");
    const response = await axios.get(`${BFF_URL}/bff/group/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Frontend: Meus grupos carregados:", response.data.length);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Erro ao buscar meus grupos:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("hubdosaber-token");
        throw new Error("Sessão expirada. Faça login novamente.");
      }
    }
    throw new Error("Não foi possível carregar seus grupos.");
  }
}

/**
 * ✅ NOVA FUNÇÃO: Cria um novo grupo
 */
export async function createGroup(groupData: any): Promise<string> {
  try {
    const token = localStorage.getItem("hubdosaber-token");
    if (!token) {
      throw new Error("Token não encontrado. Faça login novamente.");
    }

    console.log("📥 Frontend: Criando novo grupo...");
    const response = await axios.post(`${BFF_URL}/bff/group`, groupData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Frontend: Grupo criado com sucesso");
    return response.data.id;
  } catch (error: any) {
    console.error("❌ Erro ao criar grupo:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        localStorage.removeItem("hubdosaber-token");
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw new Error(
        axiosError.response?.data?.message || "Erro ao criar grupo"
      );
    }
    throw new Error("Erro ao criar grupo");
  }
}

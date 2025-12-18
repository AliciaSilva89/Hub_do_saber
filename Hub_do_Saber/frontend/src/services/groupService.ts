import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface Group {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  monitoring: boolean; // ✅ Propriedade de monitoria
  active: boolean;
  disciplineId: string;
  disciplineName: string;
  courseName: string;
  universityName: string;
  ownerId: string;
  ownerName: string;
  currentMembers: number;
  schedule?: string;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  type: string; // OWNER, MEMBER
  courseName?: string;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
}

// Buscar todos os grupos
export const fetchAllGroups = async (): Promise<Group[]> => {
  const token = localStorage.getItem("hubdosaber-token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await axios.get(`${API_URL}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar grupos:", error);
    if (error.response?.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw new Error(error.response?.data?.message || "Erro ao carregar grupos");
  }
};

// Buscar grupos do usuário logado
export const fetchMyGroups = async (): Promise<Group[]> => {
  const token = localStorage.getItem("hubdosaber-token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await axios.get(`${API_URL}/groups/my-groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar meus grupos:", error);
    if (error.response?.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw new Error(
      error.response?.data?.message || "Erro ao carregar seus grupos"
    );
  }
};

// Buscar detalhes de um grupo específico
export const fetchGroupDetail = async (
  groupId: string
): Promise<GroupDetail> => {
  const token = localStorage.getItem("hubdosaber-token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await axios.get(`${API_URL}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do grupo:", error);
    if (error.response?.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw new Error(
      error.response?.data?.message || "Erro ao carregar detalhes do grupo"
    );
  }
};

// Entrar em um grupo
export const joinGroup = async (groupId: string): Promise<void> => {
  const token = localStorage.getItem("hubdosaber-token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    await axios.post(
      `${API_URL}/groups/${groupId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro ao entrar no grupo:", error);
    if (error.response?.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw new Error(error.response?.data?.message || "Erro ao entrar no grupo");
  }
};

// Criar um novo grupo
export const createGroup = async (groupData: {
  name: string;
  description: string;
  disciplineId: string;
  maxMembers: number;
  monitoring: boolean;
}): Promise<Group> => {
  const token = localStorage.getItem("hubdosaber-token");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const response = await axios.post(`${API_URL}/groups`, groupData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar grupo:", error);
    if (error.response?.status === 401) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }
    throw new Error(error.response?.data?.message || "Erro ao criar grupo");
  }
};

export default {
  fetchAllGroups,
  fetchMyGroups,
  fetchGroupDetail,
  joinGroup,
  createGroup,
};

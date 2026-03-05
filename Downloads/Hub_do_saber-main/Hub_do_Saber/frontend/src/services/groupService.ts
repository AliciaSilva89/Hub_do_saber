import axiosInstance from "./axiosConfig";

export interface Group {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  monitoring: boolean;
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

// ✅ CORRIGIDO: Buscar todos os grupos
export const fetchAllGroups = async (): Promise<Group[]> => {
  try {
    // axiosInstance já tem /api no baseURL, então use apenas /group
    const response = await axiosInstance.get("/group");
    console.log("✅ Grupos carregados:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar grupos:", error);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
    throw new Error(error.response?.data?.message || "Erro ao carregar grupos");
  }
};

// ✅ CORRIGIDO: Buscar grupos do usuário logado
export const fetchMyGroups = async (): Promise<Group[]> => {
  try {
    // Use o parâmetro mygroup=true conforme o GroupController
    const response = await axiosInstance.get("/group", {
      params: { mygroup: true },
    });
    console.log("✅ Meus grupos carregados:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar meus grupos:", error);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
    throw new Error(
      error.response?.data?.message || "Erro ao carregar seus grupos"
    );
  }
};

// ✅ CORRIGIDO: Buscar detalhes de um grupo específico
export const fetchGroupDetail = async (
  groupId: string
): Promise<GroupDetail> => {
  try {
    const response = await axiosInstance.get(`/group/${groupId}`);
    console.log("✅ Detalhes do grupo carregados:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar detalhes do grupo:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao carregar detalhes do grupo"
    );
  }
};

// ✅ CORRIGIDO: Entrar em um grupo
export const joinGroup = async (groupId: string): Promise<void> => {
  try {
    // Conforme GroupController: /api/group/join?groupId=xxx
    await axiosInstance.post("/group/join", null, {
      params: { groupId },
    });
    console.log("✅ Entrou no grupo com sucesso");
  } catch (error: any) {
    console.error("❌ Erro ao entrar no grupo:", error);
    throw new Error(error.response?.data?.message || "Erro ao entrar no grupo");
  }
};

// ✅ CORRIGIDO: Criar um novo grupo
export const createGroup = async (groupData: {
  name: string;
  description: string;
  disciplineId: string;
  maxMembers: number;
  monitoring: boolean;
}): Promise<string> => {
  try {
    const response = await axiosInstance.post("/group", groupData);
    console.log("✅ Grupo criado com sucesso:", response.data);
    return response.data; // Retorna o ID do grupo
  } catch (error: any) {
    console.error("❌ Erro ao criar grupo:", error);
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

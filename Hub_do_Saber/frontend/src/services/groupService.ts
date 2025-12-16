import axios from "axios";

export interface GroupDetail {
  id: string;
  name: string;
  description: string;
  maxMembers: number;
  monitoring?: boolean;
  active?: boolean;
  disciplineName: string;
  courseName: string;
  universityName?: string;
  ownerName: string;
  members: any[]; // Simplificando por enquanto
  schedule?: string;
  location?: string;
}

// Usa variável de ambiente Vite se definida, caso contrário usa localhost
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080/api/group";

export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  try {
    const response = await axios.get<GroupDetail>(`${API_BASE_URL}/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do grupo:", error);
    throw new Error("Não foi possível carregar os detalhes do grupo.");
  }
}

export async function joinGroup(groupId: string, token: string): Promise<void> {
  const url = `${API_BASE_URL}/join?groupId=${groupId}`;

  try {
    await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as { message?: string };
      throw new Error(data.message || `Erro ao ingressar: Status ${error.response.status}`);
    }
    throw new Error("Erro de rede.");
  }
}

import axios from "axios";

interface DisciplineRequest {
  disciplineId: string;
}

interface CreateGroupData {
  groupName: string;
  description: string;
  participants: string;
  hasMonitoring: string;
  disciplineId: string;
}

interface ApiGroupResponse {
  id: string;
  name: string;
  description: string;
  ownerName?: string;
  maxMembers: number;
  members?: unknown[];
  disciplineName?: string;
  universityName?: string;
  schedule?: string;
}

interface MappedGroup {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  maxMembers: number;
  members: unknown[];
  disciplineName: string;
  universityName: string;
  schedule: string;
}

const JAVA_API_URL = process.env.JAVA_API_URL || "http://localhost:8080";
const API_URL = `${JAVA_API_URL}/api/group`;

export async function fetchGroupDetail(
  groupId: string,
  token: string
): Promise<MappedGroup> {
  try {
    const response = await axios.get<ApiGroupResponse>(
      `${API_URL}/${groupId}`,
      {
        headers: { Authorization: token },
      }
    );
    return mapGroup(response.data);
  } catch (error: unknown) {
    handleAxiosError(error, "buscar detalhes do grupo");
    throw error;
  }
}

export async function fetchMyGroups(token: string): Promise<MappedGroup[]> {
  try {
    // Fallback para quando endpoint Java não existir ainda
    const response = await axios.get<any>(`${API_URL}/mygroups`, {
      headers: { Authorization: token },
    });
    return Array.isArray(response.data) ? response.data.map(mapGroup) : [];
  } catch (error: unknown) {
    console.log(
      "⚠️ Endpoint /mygroups não encontrado, retornando grupos vazios"
    );
    return []; // Graceful fallback
  }
}

export async function joinGroup(groupId: string, token: string): Promise<void> {
  try {
    await axios.post(`${API_URL}/join`, null, {
      params: { groupId },
      headers: { Authorization: token },
    });
  } catch (error: unknown) {
    handleAxiosError(error, "entrar no grupo");
    throw error;
  }
}

export async function createGroup(
  groupData: CreateGroupData,
  token: string
): Promise<string> {
  try {
    const maxMembersValue = groupData.participants.includes("-")
      ? parseInt(groupData.participants.split("-")[1])
      : parseInt(groupData.participants);

    const payload = {
      name: groupData.groupName,
      description: groupData.description,
      maxMembers: maxMembersValue || 10,
      monitoring: groupData.hasMonitoring === "yes",
      disciplineId: groupData.disciplineId,
    };

    const response = await axios.post<string>(API_URL, payload, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, "criar grupo");
    throw error;
  }
}

function mapGroup(apiGroup: ApiGroupResponse): MappedGroup {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    description: apiGroup.description,
    ownerName: apiGroup.ownerName || "Organizador",
    maxMembers: apiGroup.maxMembers || 0,
    members: Array.isArray(apiGroup.members) ? apiGroup.members : [],
    disciplineName: apiGroup.disciplineName || "Geral",
    universityName: apiGroup.universityName || "Hub do Saber",
    schedule: apiGroup.schedule || "A definir",
  };
}

function handleAxiosError(error: unknown, context: string): void {
  if (axios.isAxiosError(error)) {
    console.error(
      `❌ BFF: Erro ao ${context}:`,
      error.response?.data || error.message
    );
  } else {
    console.error(`❌ BFF: Erro desconhecido ao ${context}:`, error);
  }
}

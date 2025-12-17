import axios from "axios";

// 1. Definição das Interfaces (Tipagem)
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

// Configuração de URLs
const JAVA_API_URL = process.env.JAVA_API_URL || "http://localhost:8080";
const API_URL = `${JAVA_API_URL}/api/group`;

/**
 * Busca detalhes de um grupo específico.
 */
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

/**
 * Solicita entrada em um grupo via Query Parameter.
 */
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

/**
 * Cria um novo grupo enviando os dados mapeados para o Backend Java.
 */
export async function createGroup(
  groupData: CreateGroupData,
  token: string
): Promise<string> {
  try {
    // Tratamento para extrair o número de participantes de strings como "5-10"
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

/**
 * Mapeia os dados brutos do Java (ApiGroupResponse) para o formato do React (MappedGroup).
 */
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

/**
 * Função utilitária para log de erros sem usar 'any' no catch.
 */
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

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

/**
 * ✅ NOVA FUNÇÃO: Busca todos os grupos disponíveis
 */
export async function fetchAllGroups(token: string): Promise<MappedGroup[]> {
  try {
    console.log("📥 BFF: Buscando todos os grupos...");
    const response = await axios.get(API_URL, {
      headers: { Authorization: token },
    });

    const groups = Array.isArray(response.data) ? response.data : [];
    console.log(`✅ BFF: ${groups.length} grupos encontrados`);
    return groups.map(mapGroup);
  } catch (error: unknown) {
    handleAxiosError(error, "buscar todos os grupos");
    throw error;
  }
}

/**
 * Busca detalhes de um grupo específico
 */
export async function fetchGroupDetail(
  groupId: string,
  token: string
): Promise<MappedGroup> {
  try {
    console.log(`📥 BFF: Buscando detalhes do grupo ${groupId}...`);
    const response = await axios.get(`${API_URL}/${groupId}`, {
      headers: { Authorization: token },
    });
    return mapGroup(response.data);
  } catch (error: unknown) {
    handleAxiosError(error, "buscar detalhes do grupo");
    throw error;
  }
}

/**
 * Busca os grupos do usuário logado
 */
export async function fetchMyGroups(token: string): Promise<MappedGroup[]> {
  try {
    console.log("📥 BFF: Buscando meus grupos...");
    const response = await axios.get(`${API_URL}?mygroup=true`, {
      headers: { Authorization: token },
    });
    return Array.isArray(response.data) ? response.data.map(mapGroup) : [];
  } catch (error: unknown) {
    console.log(
      "⚠️ Endpoint mygroups não encontrado, retornando grupos vazios"
    );
    return []; // Graceful fallback
  }
}

/**
 * Entra em um grupo específico
 */
export async function joinGroup(groupId: string, token: string): Promise<void> {
  try {
    console.log(`📥 BFF: Usuário entrando no grupo ${groupId}...`);
    await axios.post(`${API_URL}/join`, null, {
      params: { groupId },
      headers: { Authorization: token },
    });
    console.log("✅ BFF: Usuário entrou no grupo com sucesso");
  } catch (error: unknown) {
    handleAxiosError(error, "entrar no grupo");
    throw error;
  }
}

/**
 * Cria um novo grupo
 */
export async function createGroup(
  groupData: CreateGroupData,
  token: string
): Promise<string> {
  try {
    console.log("📥 BFF: Criando novo grupo...");

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

    const response = await axios.post(API_URL, payload, {
      headers: { Authorization: token },
    });

    console.log("✅ BFF: Grupo criado com sucesso");
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, "criar grupo");
    throw error;
  }
}

/**
 * Mapeia a resposta da API Java para o formato esperado pelo frontend
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
 * Trata erros do Axios de forma centralizada
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

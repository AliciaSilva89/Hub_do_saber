// src/services/groupService.ts
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerName: string;
  maxMembers: number;
  currentMembers: number;
  members: unknown[];
  disciplineName: string;
  courseName: string;
  universityName: string;
  schedule: string;
  monitoring: boolean;
  image?: string;
}

export interface GroupDetail extends Group {
  disciplineId: string;
  ownerId: string;
  onlineMembers: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem("hubdosaber-token");
  return { Authorization: `Bearer ${token}` };
}

function mapGroup(apiGroup: any): Group {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    description: apiGroup.description || "",
    ownerName: apiGroup.ownerName || "Organizador",
    maxMembers: apiGroup.maxMembers || 0,
    currentMembers: apiGroup.currentMembers ?? 0,
    members: Array.isArray(apiGroup.members) ? apiGroup.members : [],
    disciplineName: apiGroup.disciplineName || "Geral",
    courseName: apiGroup.courseName || "",
    universityName: apiGroup.universityName || "Hub do Saber",
    schedule: apiGroup.schedule || "A definir",
    monitoring: apiGroup.monitoring || false,
    image: apiGroup.image || null,
  };
}

export async function fetchAllGroups(): Promise<Group[]> {
  const response = await axios.get(`${API_BASE}/group`, {
    headers: getAuthHeaders(),
  });
  const groups = Array.isArray(response.data) ? response.data : [];
  console.log(`✅ Todos os grupos: ${groups.length}`);
  return groups.map(mapGroup);
}

export async function fetchMyGroups(): Promise<Group[]> {
  try {
    // ✅ CORRIGIDO: usa ?mygroup=true igual ao GroupController.java
    const response = await axios.get(`${API_BASE}/group`, {
      params: { mygroup: true },
      headers: getAuthHeaders(),
    });
    const groups = Array.isArray(response.data) ? response.data : [];
    console.log(`✅ Meus grupos: ${groups.length}`);
    return groups.map(mapGroup);
  } catch (error) {
    console.error("❌ Erro ao buscar meus grupos:", error);
    return [];
  }
}

export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  const response = await axios.get(`${API_BASE}/group/${groupId}`, {
    headers: getAuthHeaders(),
  });
  const g = response.data;
  return {
    ...mapGroup(g),
    disciplineId: g.disciplineId || "",
    ownerId: g.ownerId || "",
    onlineMembers: g.onlineMembers || 0,
  };
}

export async function joinGroup(groupId: string): Promise<void> {
  await axios.post(`${API_BASE}/group/join`, null, {
    params: { groupId },
    headers: getAuthHeaders(),
  });
}

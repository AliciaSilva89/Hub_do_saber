// src/services/groupService.ts
import axiosInstance from "./axiosConfig"; // ✅ substituído

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
  const response = await axiosInstance.get("/group", {}); // ✅ URL relativa
  const groups = Array.isArray(response.data) ? response.data : [];
  console.log(`✅ Todos os grupos: ${groups.length}`);
  return groups.map(mapGroup);
}

export async function fetchMyGroups(): Promise<Group[]> {
  try {
    const response = await axiosInstance.get("/group", {
      // ✅ URL relativa
      params: { mygroup: true },
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
  const response = await axiosInstance.get(`/group/${groupId}`); // ✅ URL relativa
  const g = response.data;
  return {
    ...mapGroup(g),
    disciplineId: g.disciplineId || "",
    ownerId: g.ownerId || "",
    onlineMembers: g.onlineMembers || 0,
  };
}

export async function joinGroup(groupId: string): Promise<void> {
  await axiosInstance.post("/group/join", null, {
    // ✅ URL relativa
    params: { groupId },
  });
}

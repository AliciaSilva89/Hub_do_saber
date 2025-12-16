// services/group.service.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/group";

export async function fetchGroupDetail(groupId: string) {
  const response = await axios.get(`${API_URL}/${groupId}`);
  return mapGroup(response.data);
}

export async function joinGroup(groupId: string, token: string) {
  await axios.post(
    `${API_URL}/join?groupId=${groupId}`,
    {},
    { headers: { Authorization: token } }
  );
}

function mapGroup(apiGroup: any) {
  return {
    id: apiGroup.id,
    name: apiGroup.name,
    description: apiGroup.description,
    ownerName: apiGroup.ownerName,
    maxMembers: apiGroup.maxMembers,
    membersCount: apiGroup.members.length,
    disciplineName: apiGroup.disciplineName,
  };
}

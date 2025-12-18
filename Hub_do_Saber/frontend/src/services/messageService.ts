// messageService.ts
import api from "./api";

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content?: string;
  imageUrl?: string;
  createdAt: string;
}

export const messageService = {
  async getMessages(groupId: string): Promise<Message[]> {
    const response = await api.get(`/groups/${groupId}/messages`);
    return response.data;
  },

  async sendMessage(
    groupId: string,
    content: string,
    imageUrl?: string
  ): Promise<Message> {
    const response = await api.post(`/groups/${groupId}/messages`, {
      content,
      imageUrl,
    });
    return response.data;
  },
};

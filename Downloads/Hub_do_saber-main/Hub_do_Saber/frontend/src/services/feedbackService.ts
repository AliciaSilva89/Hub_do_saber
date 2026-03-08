// src/services/feedbackService.ts
import axios from "axios";

// ✅ Instância separada para o BFF — sem o /api do axiosInstance
const bffInstance = axios.create({
  baseURL: "/bff",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Adiciona token automaticamente
bffInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("hubdosaber-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface FeedbackDTO {
  id?: number;
  userId: string;
  authorName: string;
  courseName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  profilePicture?: string;
}

export const getFeedbacks = async (): Promise<FeedbackDTO[]> => {
  const { data } = await bffInstance.get("/feedbacks");
  return data;
};

export const createFeedback = async (
  dto: Omit<FeedbackDTO, "id" | "createdAt">,
): Promise<FeedbackDTO> => {
  const { data } = await bffInstance.post("/feedbacks", dto);
  return data;
};

import axios from "axios";

const BFF_URL = import.meta.env.VITE_BFF_URL || "http://localhost:3000";

export interface FeedbackDTO {
  id?: number;
  userId: string;
  authorName: string;
  courseName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  profilePicture?: string; // ✅ adicionar
}


const getHeaders = () => {
  const token = localStorage.getItem("hubdosaber-token");
  return { Authorization: `Bearer ${token}` };
};

export const getFeedbacks = async (): Promise<FeedbackDTO[]> => {
  const { data } = await axios.get(`${BFF_URL}/feedbacks`, {
    headers: getHeaders(),
  });
  return data;
};

export const createFeedback = async (
  dto: Omit<FeedbackDTO, "id" | "createdAt">,
): Promise<FeedbackDTO> => {
  const { data } = await axios.post(`${BFF_URL}/feedbacks`, dto, {
    headers: getHeaders(),
  });
  return data;
};

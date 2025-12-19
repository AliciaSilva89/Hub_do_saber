// src/services/userService.ts
import axiosInstance from "./axiosConfig";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  matriculation?: string;
  course?: {
    id: string;
    name: string;
  };
  disciplineInterests?: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  profilePicture?: string;
}

// ✅ Buscar perfil do usuário atual
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get("/users/me");
    console.log("✅ Perfil do usuário carregado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao carregar perfil:", error);
    throw new Error(error.response?.data?.message || "Erro ao carregar perfil");
  }
};

// ✅ Atualizar perfil do usuário atual
export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put("/users/me", data);
    console.log("✅ Perfil atualizado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao atualizar perfil:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar perfil"
    );
  }
};

// ✅ Upload de foto de perfil (APENAS UMA DECLARAÇÃO)
export const uploadProfilePicture = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(
      "📂 Arquivo selecionado:",
      file.name,
      "Tamanho:",
      file.size,
      "bytes"
    );

    if (!file.type.startsWith("image/")) {
      reject(new Error("Por favor, selecione apenas arquivos de imagem"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("A imagem deve ter no máximo 5MB"));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;

        console.log("📤 Base64 gerado com sucesso!");
        console.log("📏 Tamanho do Base64:", base64String.length, "caracteres");
        console.log(
          "🔍 Primeiros 100 caracteres:",
          base64String.substring(0, 100)
        );

        const response = await updateUserProfile({
          profilePicture: base64String,
        });

        console.log("✅ Resposta do servidor:", response);
        console.log(
          "🖼️ ProfilePicture retornado:",
          response.profilePicture
            ? `SIM (${response.profilePicture.length} caracteres)`
            : "NULL"
        );

        resolve(response.profilePicture || "");
      } catch (error) {
        console.error("❌ Erro ao enviar foto:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsDataURL(file);
  });
};

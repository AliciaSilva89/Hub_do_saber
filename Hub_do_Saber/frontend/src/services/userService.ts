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

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    console.log("✅ Perfil do usuário carregado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao carregar perfil:", error);
    throw new Error(error.response?.data?.message || "Erro ao carregar perfil");
  }
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, data);
    console.log("✅ Perfil atualizado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao atualizar perfil:", error);
    throw new Error(
      error.response?.data?.message || "Erro ao atualizar perfil"
    );
  }
};

export const uploadProfilePicture = async (
  userId: string,
  file: File
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      reject(new Error("Por favor, selecione apenas arquivos de imagem"));
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("A imagem deve ter no máximo 5MB"));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;

        // Atualizar perfil com a imagem em base64
        const response = await updateUserProfile(userId, {
          profilePicture: base64String,
        });

        console.log("✅ Foto de perfil enviada com sucesso");
        resolve(response.profilePicture || "");
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    // Converter para Base64
    reader.readAsDataURL(file);
  });
};

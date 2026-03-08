import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

let isRedirecting = false;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hubdosaber-token");

    if (token) {
      console.log("🔑 Token encontrado, adicionando ao header");
      console.log("📍 URL da requisição:", config.baseURL + config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ Nenhum token encontrado no localStorage");
    }

    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  },
);

// Interceptor de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Resposta bem-sucedida:",
      response.config.url,
      response.status,
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error("❌ Erro na resposta:");
    console.error("  Status:", status);
    console.error("  URL:", url);
    console.error("  Mensagem:", error.response?.data);

    if (
      status === 401 &&
      !isRedirecting &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/cadastro") &&
      !url?.includes("/auth/")
    ) {
      console.warn("🔒 Token inválido (401). Redirecionando para login...");
      isRedirecting = true;

      localStorage.removeItem("hubdosaber-token");
      window.location.href = "/login";

      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

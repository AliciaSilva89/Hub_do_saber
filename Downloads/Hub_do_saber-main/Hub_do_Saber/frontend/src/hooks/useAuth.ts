import { useEffect, useState } from "react";

export interface AuthState {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
}

// Hook simples para consumir um token armazenado no localStorage.
// Ajuste para integrar ao seu contexto/fluxo real de autenticação quando necessário.
export const useAuth = (): AuthState => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      setToken(storedToken);
      setUserId(storedUserId);
    } catch (e) {
      // Em ambientes sem window/localStorage, deixamos os valores nulos
      setToken(null);
      setUserId(null);
    }
  }, []);

  return {
    token,
    userId,
    isAuthenticated: !!token,
  };
};

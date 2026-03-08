import { useNavigate } from "react-router-dom";

export const useLogoLink = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const token = localStorage.getItem("hubdosaber-token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return handleLogoClick;
};

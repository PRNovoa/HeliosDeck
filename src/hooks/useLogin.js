import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/api/authClient.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROUTES } from "@/app/routes.js";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data);
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
  });
}

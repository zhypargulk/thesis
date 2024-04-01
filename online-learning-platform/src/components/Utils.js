import { useAuth } from "../context/AuthContext";

export const useAuthenticatedUser = () => {
  const user = useAuth();

  return user;
};

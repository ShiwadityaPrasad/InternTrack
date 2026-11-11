
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { getCurrentUser } from "../api";

const AuthContext = createContext();

function getSavedUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser || savedUser === "undefined") {
    localStorage.removeItem("user");
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(getSavedUser);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    verifySession();
  }, []);

  function login(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

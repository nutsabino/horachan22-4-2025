"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define user type
type User = {
  id: number;
  username?: string;
  email: string;
  [key: string]: any;
};

// Define auth status type
type AuthStatus = "loading" | "authorized" | "unauthorized";

// Define context type
type AuthContextType = {
  status: AuthStatus;
  user: User | undefined;
  jwt: string | null;
  updateAuthStatus: (
    status: AuthStatus,
    user?: User,
    jwt?: string | null
  ) => void;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  status: "loading",
  user: undefined,
  jwt: null,
  updateAuthStatus: () => {},
  logout: () => {},
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [jwt, setJwt] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.user && parsedAuth.jwt) {
          setUser(parsedAuth.user);
          setJwt(parsedAuth.jwt);
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      } catch (error) {
        console.error("Error parsing stored auth:", error);
        setStatus("unauthorized");
      }
    } else {
      setStatus("unauthorized");
    }
  }, []);

  // Update auth status
  const updateAuthStatus = (
    newStatus: AuthStatus,
    newUser?: User,
    newJwt?: string | null
  ) => {
    setStatus(newStatus);

    if (newStatus === "authorized" && newUser && newJwt) {
      setUser(newUser);
      setJwt(newJwt);

      // Store in localStorage for persistence
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: newUser,
          jwt: newJwt,
        })
      );
    } else if (newStatus === "unauthorized") {
      setUser(undefined);
      setJwt(null);
      localStorage.removeItem("auth");
    }
  };

  // Logout function
  const logout = () => {
    updateAuthStatus("unauthorized", undefined, null);
  };

  return (
    <AuthContext.Provider
      value={{ status, user, jwt, updateAuthStatus, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = () => useContext(AuthContext);

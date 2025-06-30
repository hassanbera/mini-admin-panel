import { createContext, useContext, useState } from "react";
import axios from "axios";
import { message } from "antd";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Giriş yapan kullanıcı
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/users", {
        params: { email, password },
      });

      if (res.data.length > 0) {
        setUser(res.data[0]); // Giriş başarılı
        return true;
      } else {
        setError("Geçersiz e-posta veya şifre.");
        return false;
      }
    } catch (err) {
      setError("Sunucu hatası!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    message.info("Çıkış yapıldı.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

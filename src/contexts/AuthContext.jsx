import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Giriş yapan kullanıcı
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde localStorage'den kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user'); // Bozuk veri varsa temizle
        console.error('Invalid stored user data:', err);
      }
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/users", {
        params: { email, password },
      });

      if (res.data.length > 0) {
        const userData = res.data[0];
        setUser(userData); // Giriş başarılı
        
        // localStorage'a kullanıcı bilgilerini kaydet
        localStorage.setItem('user', JSON.stringify(userData));
        
        message.success(`Hoş geldiniz, ${userData.name}!`);
        return true;
      } else {
        setError("Geçersiz e-posta veya şifre.");
        message.error("Geçersiz e-posta veya şifre.");
        return false;
      }
    } catch (err) {
      setError("Sunucu hatası!");
      message.error("Sunucu hatası!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user'); // localStorage'dan temizle
    message.info("Çıkış yapıldı.");
  };

  // CRUD işlemleri için permission kontrolü
  const canCreate = () => {
    return user?.role === 'admin';
  };

  const canUpdate = () => {
    return user?.role === 'admin';
  };

  const canDelete = () => {
    return user?.role === 'admin';
  };

  const canRead = () => {
    return !!user; // Hem admin hem viewer okuyabilir
  };

  // Genel permission kontrolü
  const hasPermission = (permission) => {
    if (!user) return false;

    switch (permission) {
      case 'create':
        return canCreate();
      case 'update':
        return canUpdate();
      case 'delete':
        return canDelete();
      case 'read':
        return canRead();
      default:
        return false;
    }
  };

  // Role kontrolü (artık sadece authentication kontrolü için)
  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Her iki role de aynı sayfalara erişebilir
    return user.role === requiredRole || (requiredRole === 'viewer' && !!user);
  };

  // Context value
  const value = {
    // Mevcut özellikler
    user,
    login,
    logout,
    loading,
    error,
    
    // Yeni CRUD permission özellikler
    hasRole,
    hasPermission,
    canCreate,
    canUpdate,
    canDelete,
    canRead,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isViewer: user?.role === 'viewer',
    
    // Kullanıcı bilgileri
    userName: user?.name || '',
    userRole: user?.role || '',
    userEmail: user?.email || ''
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
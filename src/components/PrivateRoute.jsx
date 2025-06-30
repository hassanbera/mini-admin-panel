import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // AuthContext'inizin yolunu doğru ayarladık
import { message } from 'antd'; // Ant Design mesajlarını kullanmak için

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // AuthContext'ten kullanıcı ve yüklenme durumunu al
  const navigate = useNavigate();

  // loading durumu, AuthContext'in kullanıcı bilgisini yüklemesi veya API çağrısı yapması sırasında önemlidir.
  // Gerçek bir uygulamada burada bir yükleme spinner'ı gösterilebilir.
  if (loading) {
    return <div>Yükleniyor...</div>; // Veya Ant Design'dan bir Spin bileşeni
  }

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    // Mesaj göstermeden direkt login sayfasına yönlendir, çünkü bu standart bir akış.
    return <Navigate to="/login" replace />;
  }

  // Kullanıcı giriş yapmışsa, rol kontrolü yap
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />; // İzinliyse alt rotayı render et (nested routes için)
  } else {
    // Kullanıcının rolü izin verilen roller arasında değilse
    useEffect(() => {
      message.warning('Bu sayfaya erişim yetkiniz yok.');
      navigate('/dashboard', { replace: true }); // Yetkisiz kullanıcıyı dashboard'a yönlendir
    }, [navigate]);
    return null; // Yönlendirme yapılırken hiçbir şey render etme
  }
};

export default PrivateRoute;

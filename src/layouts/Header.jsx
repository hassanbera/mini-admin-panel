import { Layout } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;

const AppHeader = () => {
  const { user } = useAuth();
  return (
    <Header style={{ background: "#fff", padding: "0 16px" }}>
      Hoş geldin, {user?.name} ({user?.role})
    </Header>
  );
};

export default AppHeader;

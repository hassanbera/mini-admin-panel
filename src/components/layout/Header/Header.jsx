import { Layout, Space } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle';
import './Header.css';
const { Header } = Layout;

const AppHeader = () => {
  const { user } = useAuth();
  return (
    <Header className="header-container">
      <span>Hoş geldin, {user?.name} ({user?.role})</span>
      <Space>
        <ThemeToggle />
      </Space>
    </Header>
  );
};

export default AppHeader;

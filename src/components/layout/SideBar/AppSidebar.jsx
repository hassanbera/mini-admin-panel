import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import './AppSidebar.css';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AppSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 992); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/customers", icon: <UserOutlined />, label: "Customers" },
    { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout", danger: true },
  ];

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && !collapsed && (
        <div 
          className="mobile-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={handleCollapse}
        className={`app-sidebar ${isMobile ? 'mobile' : 'desktop'}`}
      >
        <div className="sidebar-logo">
          Mini Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </Sider>
    </>
  );
};

export default AppSidebar;
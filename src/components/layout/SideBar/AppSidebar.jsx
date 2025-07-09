import { Layout, Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import './AppSidebar.css';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const AppSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and set initial state
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 992; // lg breakpoint
      setIsMobile(mobile);
      
      // Set initial collapsed state only when device type changes
      if (mobile !== isMobile) {
        setCollapsed(mobile); // Start collapsed on mobile, expanded on desktop
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isMobile]);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  const handleCollapse = (collapsed) => {
    // Only auto-collapse on mobile, don't auto-expand on desktop
    if (isMobile || !collapsed) {
      setCollapsed(collapsed);
    }
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
      
      {/* Sidebar toggle button - only shown on mobile */}
      {isMobile && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={`sidebar-toggle-btn ${collapsed ? 'sidebar-collapsed' : ''}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      )}
      
      <Sider 
        breakpoint={isMobile ? "lg" : undefined}
        collapsedWidth={isMobile ? "0" : "80"} 
        collapsed={collapsed}
        onCollapse={handleCollapse}
        className={`app-sidebar ${isMobile ? 'mobile' : 'desktop'}`}
        trigger={null} 
      >
        <div className="sidebar-logo">
          {!collapsed ? "Mini Admin" : "MA"}
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
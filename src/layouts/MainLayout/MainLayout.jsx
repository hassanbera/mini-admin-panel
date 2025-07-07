import { Layout } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AppSidebar from "../../components/layout/SideBar/AppSidebar";
import AppHeader from "../../components/layout/Header/Header";
import ContentWrapper from "../../components/layout/Content/Content";
import AppFooter from "../../components/layout/Footer/Footer";
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Add global styles to prevent body overflow
  useEffect(() => {
    // Ensure body doesn't have unwanted overflow
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <Layout className="main-layout">
      <AppSidebar/>
      <Layout className="main-layout-content">
        <AppHeader />
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
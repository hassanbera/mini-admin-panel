import { Layout } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import AppHeader from "./Header";
import ContentWrapper from "./Content";
import AppFooter from "./Footer";

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <Layout style={{ minHeight: "100vh"}}>
      <AppSidebar  />
      <Layout>
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

"use client";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "antd";
import { dashboardContainer } from "./styles";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  return (
    <MainLayout>
    <div style={dashboardContainer}>
      <h1>Welcome, {user?.name}!</h1>
      <p>Your role: <strong>{user?.role}</strong></p>
      <Button type="primary" danger onClick={handleLogout}>Logout</Button>
    </div>
    </MainLayout>
  );
};

export default Dashboard;

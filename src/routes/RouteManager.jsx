import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage/LoginPage";
import Dashboard from "../pages/DashboardPage/DashboardPage";
import Customers from "../pages/CustomersPage/CustomersPage";
import Orders from "../pages/OrdersPage/OrdersPage";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../layouts/MainLayout";

function RouteManager(){
return (
<Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            {/* Ana sayfa dashboard'a yönlendir */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Tüm sayfalar hem admin hem viewer erişebilir */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

    );
}
export default RouteManager; 
    

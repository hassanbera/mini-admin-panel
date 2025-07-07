import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/DashboardPage/DashboardPage"
import Customers from "../pages/CustomersPage/CustomersPage";
import Orders from "../pages/OrdersPage/OrdersPage";
import PrivateRoute from "./PrivateRoute";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";

function RouteManager(){
return (
<Router> 
        <Routes> 
          {/* Giriş sayfası */}
          <Route path="/login" element={<LoginPage/>} />
          
          {/* Tüm sayfalara erişim için PrivateRoute kullanımı */}
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
          
          {/* Geçersiz rotalar için yönlendirme */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

    );
}
export default RouteManager; 
    

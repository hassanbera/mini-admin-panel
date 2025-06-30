import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Orders from "./pages/Orders/Orders";
import { useAuth } from "./contexts/AuthContext";
import './App.css'

function App() {

const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/customers"
          element={user ? <Customers /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orders"
          element={user ? <Orders /> : <Navigate to="/login" replace />}
        />
        {/* TODO: add more protected routes like /customers, /orders */}
      </Routes>
    </Router>
  );
}

export default App

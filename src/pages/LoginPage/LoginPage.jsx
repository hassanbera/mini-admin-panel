// src/pages/Auth/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/Forms/Login/LoginForm"; // Adjust path if needed
import style from "./styles"; // Assuming styles are in a separate file in the same directory

/**
 * LoginPage Component
 * This component acts as the container for the login functionality.
 * It manages authentication state, handles successful login navigation,
 * and renders the LoginForm component.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth(); // Destructure login, error, and loading from AuthContext

  /**
   * Handles the form submission from LoginForm.
   * Calls the login function from AuthContext and navigates on success.
   * @param {object} values - Form values containing email and password.
   */
  const handleLoginSubmit = async (values) => {
    const success = await login(values.email, values.password);
    if (success) {
      navigate("/dashboard"); // Navigate to dashboard on successful login
    }
  };

  return (
    <div style={style.loginContainerStyle}>
      <div style={style.loginBoxStyle}>
        {/* Page Title */}
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#333', textAlign: 'center' }}>
          Giriş Yap
        </h2>

        {/* Render the LoginForm component, passing necessary props */}
        <LoginForm
          onFinish={handleLoginSubmit}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { Card, Typography, message, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle';
import LoginForm from '../../components/Forms/Login/LoginForm';
import './LoginPage.css';

const { Title } = Typography;

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the login function from AuthContext
      const success = await login(values.email, values.password);
      
      if (success) {
        message.success('Giriş başarılı!');
        navigate('/dashboard');
      } else {
        setError('Geçersiz e-posta veya şifre!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-theme-toggle">
        <ThemeToggle size="large" />
      </div>
      <Row className="login-row">
        <Col xs={24} lg={12} className="login-left-col">
          <Card className="login-card login-card-fullscreen">
            <div className="login-content-wrapper">
              <div className="login-header login-header-spacing">
                <Title level={2} className="login-title login-title-spacing">
                  Mini Admin Panel
                </Title>
                <p className="login-subtitle login-subtitle-spacing">
                  Hesabınıza giriş yapın
                </p>
              </div>
              
              <div className="login-form-wrapper">
                <LoginForm 
                  onFinish={handleLogin}
                  error={error}
                  loading={loading}
                />
              </div>
              
              <div className="login-footer">
                <p className="login-demo-info login-demo-info-compact">
                  Demo Hesaplar:<br />
                  <strong>Admin:</strong> admin@example.com / 123456<br />
                  <strong>Viewer:</strong> viewer@example.com / 654321
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12} className="login-right-col">
         <iframe 
  title="Character248 Rigged Mascot" 
  allow="autoplay;" 
  execution-while-not-rendered
  src="https://sketchfab.com/models/ec31c075cce24687b9385892c4686e30/embed?autostart=1&camera=0&transparent=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_watermark=0"
  style={{
    border: 'none', 
    outline: 'none', 
    width: '130%', 
    height: '130%', 
    top: '-10%',   
    left: '-10%',       
    borderRadius: '12px',
  }}
  onFocus={(e) => e.target.blur()}
  tabIndex="-1"
/>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;

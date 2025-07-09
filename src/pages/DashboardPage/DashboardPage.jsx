import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Tag } from 'antd';
import { UserOutlined, ShoppingCartOutlined, TrophyOutlined, DollarOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { customersService } from '../../services/customersService';
import { orderService } from '../../services/orderService';
import './DashboardPage.css';

const { Title } = Typography;

const DashboardPage = () => {
  const { userName, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customers = await customersService.getAll();
        
        // Fetch orders
        const orders = await orderService.getAll();
        
        // Calculate stats
        const totalCustomers = customers.length;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0);
        
        setStats({
          totalCustomers,
          totalOrders,
          pendingOrders,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Toplam Müşteri',
      value: stats.totalCustomers,
      icon: <UserOutlined />,
      type: 'customer',
      color: '#1890ff'
    },
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders,
      icon: <ShoppingCartOutlined />,
      type: 'order',
      color: '#52c41a'
    },
    {
      title: 'Bekleyen Siparişler',
      value: stats.pendingOrders,
      icon: <TrophyOutlined />,
      type: 'pending',
      color: '#faad14'
    },
    {
      title: 'Toplam Gelir',
      value: stats.totalRevenue,
      prefix: '₺',
      precision: 2,
      icon: <DollarOutlined />,
      type: 'revenue',
      color: '#f5222d'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">Dashboard</Title>
        <div className="dashboard-welcome">
          <span className="dashboard-welcome-text">
            Hoş geldiniz, <strong>{userName}</strong>!
          </span>
          <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
            {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
          </Tag>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row className="dashboard-stats-row">
  {statCards.map((card, index) => (
    <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6} key={index}>
      <div className="stat-card-wrapper">
        <Card
          hoverable
          className={`dashboard-stat-card stat-card-${card.type}`}
        >
          <Statistic
            title={<span className="stat-title">{card.title}</span>}
            value={card.value}
            prefix={card.prefix}
            precision={card.precision}
            valueStyle={{ color: card.color }}
            suffix={card.icon}
            className="stat-value"
          />
        </Card>
      </div>
    </Col>
  ))}
</Row>

      {/* System Information Card */}
      <Row className="dashboard-system-row">
        <Col span={24}>
          <Card title="Sistem Bilgileri" className="dashboard-system-info">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div>
                  <span className="system-title">Kullanıcı Rolü:</span>
                  <div className="system-value">
                    {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <span className="system-title">Son Güncelleme:</span>
                  <div className="system-value">
                    {new Date().toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <span className="system-title">Sistem Durumu:</span>
                  <div className="system-value">
                    <Tag color="green">Aktif</Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
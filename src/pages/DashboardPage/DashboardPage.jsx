
import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Tag } from 'antd';
import { UserOutlined, ShoppingCartOutlined, TrophyOutlined, DollarOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { customersService } from '../../services/customersService';
import { orderService } from '../../services/orderService';

const { Title } = Typography;

const Dashboard = () => {
  const { userName, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Müşteri sayısı
      const customers = await customersService.getAll();
      
      // Sipariş verileri
      const orders = await orderService.getAll();
      
      // İstatistikleri hesapla
      const pendingOrders = orders.filter(order => order.status === 'Pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

      setStats({
        totalCustomers: customers.length,
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Toplam Müşteri',
      value: stats.totalCustomers,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders,
      icon: <ShoppingCartOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Bekleyen Siparişler',
      value: stats.pendingOrders,
      icon: <TrophyOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: 'Toplam Gelir',
      value: stats.totalRevenue,
      prefix: '₺',
      precision: 2,
      icon: <DollarOutlined style={{ color: '#f5222d' }} />,
      color: '#f5222d'
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Hoş geldin mesajı */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Dashboard</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>
            Hoş geldiniz, <strong>{userName}</strong>!
          </span>
          <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
            {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
          </Tag>
        </div>
      </div>

      {/* İstatistik kartları */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              style={{
                borderLeft: `4px solid ${card.color}`,
                borderRadius: 8
              }}
            >
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.prefix}
                precision={card.precision}
                valueStyle={{ color: card.color }}
                suffix={card.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Ek bilgi kartı */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Sistem Bilgileri" style={{ borderRadius: 8 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Aktif Kullanıcı"
                  value={userName}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Kullanıcı Rolü"
                  value={userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Son Güncelleme"
                  value={new Date().toLocaleDateString('tr-TR')}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
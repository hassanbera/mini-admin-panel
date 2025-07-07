import { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import OrderForm from '../../components/Forms/Orders/OrderForm';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const { canCreate, canUpdate, canDelete, userName, userRole } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      message.error('Siparişler yüklenirken hata oluştu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order = null, view = false) => {
    setSelectedOrder(order);
    setViewMode(view);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalVisible(false);
    setViewMode(false);
  };

  const handleDelete = async (id) => {
    try {
      await orderService.delete(id);
      message.success('Sipariş silindi');
      fetchOrders();
    } catch (err) {
      message.error('Silme işlemi başarısız');
    }
  };

  const columns = [
    {
      title: 'Müşteri',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tarih',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      render: value => `₺${Number(value).toFixed(2)}`
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const colors = {
          Pending: 'orange',
          Completed: 'green',
          Cancelled: 'red'
        };
        return <Tag color={colors[status] || 'blue'}>{status}</Tag>;
      }
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => openModal(record, true)}
          />
          {canUpdate() && (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => openModal(record)}
            />
          )}
          {canDelete() && (
            <Popconfirm 
              title="Silmek istediğinizden emin misiniz?" 
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="orders-page-wrapper">
      <div className="orders-container">
        <h1 className="orders-title">Sipariş Yönetimi</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Kullanıcı: {userName}</span>
          <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
            {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
          </Tag>
          {canCreate() && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => openModal()}
            >
              Yeni Sipariş
            </Button>
          )}
        </div>
      </div>

      <div className="orders-table-container">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={viewMode ? 'Sipariş Detayı' : selectedOrder ? 'Siparişi Düzenle' : 'Yeni Sipariş'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={600}
      >
        <OrderForm
          order={selectedOrder}
          viewMode={viewMode}
          onSuccess={() => {
            closeModal();
            fetchOrders();
          }}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default OrdersPage;
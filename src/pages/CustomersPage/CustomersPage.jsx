// pages/Customers/Customers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Input, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import RoleGuard from '../../utils/RoleGuard';
import CustomerForm from '../../components/Forms/Customers/CustomerForm';
import { customersService } from '../../services/customersService';
import './CustomersPage.css';

const { Search } = Input;

const CustomersPage = () => {
  const { canCreate, canUpdate, canDelete, userRole, userName } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Dynamic columns using Ant Design's built-in responsive features
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Ad Soyad',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        ellipsis: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        ellipsis: true,
        responsive: ['sm'],
      },
      {
        title: 'Telefon',
        dataIndex: 'phone',
        key: 'phone',
        responsive: ['md'],
      },
      {
        title: 'Adres',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        responsive: ['lg'],
      },
      {
        title: 'İşlemler',
        key: 'actions',
        className: 'actions-column',
        width:300,
        render: (_, record) => (
          <Space 
            size="small" 
            className="action-buttons-space"
          >
            <Button
              type="view"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
              className="action-button view-button"
            >
              <span className="button-text">Görüntüle</span>
            </Button>
            
            <RoleGuard 
              permission="update"
              showTooltip={true}
              tooltipTitle="Düzenleme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="edit"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
                disabled={!canUpdate()}
                className="action-button edit-button"
              >
                <span className="button-text">Düzenle</span>
              </Button>
            </RoleGuard>
            
            <RoleGuard 
              permission="delete"
              showTooltip={true}
              tooltipTitle="Silme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="delete"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(record)}
                disabled={!canDelete()}
                className="action-button delete-button"
              >
                <span className="button-text">Sil</span>
              </Button>
            </RoleGuard>
          </Space>
        ),
      },
    ];

    return baseColumns;
  };

  const handleView = (customer) => {
    setEditingCustomer(customer);
    setViewMode(true);
    setModalVisible(true);
  };

  const handleEdit = (customer) => {
    if (!canUpdate()) {
      message.warning('Düzenleme yetkisi sadece admin kullanıcıda bulunur.');
      return;
    }
    setEditingCustomer(customer);
    setViewMode(false);
    setModalVisible(true);
  };

  const handleDelete = (customer) => {
    if (!canDelete()) {
      message.warning('Silme yetkisi sadece admin kullanıcıda bulunur.');
      return;
    }

    Modal.confirm({
      title: 'Müşteriyi silmek istediğinizden emin misiniz?',
      content: `${customer.name} adlı müşteri silinecektir.`,
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: async () => {
        try {
          await customersService.delete(customer.id);
          message.success('Müşteri başarıyla silindi');
          fetchCustomers();
        } catch (error) {
          message.error('Müşteri silinirken hata oluştu');
        }
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.email.toLowerCase().includes(value.toLowerCase()) ||
        customer.phone.includes(value) ||
        customer.address.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customersService.getAll();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      message.error('Müşteriler yüklenirken hata oluştu');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="customers-container">
      <Card className="customers-card">
        <div className="customer-page-container">
          <div className="header-section">
            <h2 className="customer-page-title">
              Müşteri Yönetimi
            </h2>
              <span>Kullanıcı: {userName}</span>
              <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
                {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
              </Tag>
          </div>
          
          <div className="action-button-container">
            <RoleGuard 
              permission="create"
              showTooltip={true}
              tooltipTitle="Yeni müşteri ekleme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="plus"
                icon={<PlusOutlined />}
                className="add-customer-button"
                onClick={() => {
                  if (!canCreate()) {
                    message.warning('Yeni müşteri ekleme yetkisi sadece admin kullanıcıda bulunur.');
                    return;
                  }
                  setEditingCustomer(null);
                  setViewMode(false);
                  setModalVisible(true);
                }}
                disabled={!canCreate()}
              >
                <span className="button-text">Yeni Müşteri</span>
              </Button>
            </RoleGuard>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <Search
            placeholder="Müşteri ara..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <Table
          columns={getColumns()}
          dataSource={filteredCustomers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} müşteri`,
          }}
          scroll={{ x: 800 }}
          size="default"
          className="customers-table"
        />
      </Card>

      <Modal
        title={
          viewMode 
            ? 'Müşteri Detayları' 
            : editingCustomer 
              ? 'Müşteri Düzenle' 
              : 'Yeni Müşteri'
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setViewMode(false);
        }}
        footer={viewMode ? null : undefined}
        width={800}
        className="customers-modal"
        centered
      >
        <CustomerForm
          customer={editingCustomer}
          viewMode={viewMode}
          onSuccess={() => {
            setModalVisible(false);
            setViewMode(false);
            fetchCustomers();
          }}
          onCancel={() => {
            setModalVisible(false);
            setViewMode(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default CustomersPage;
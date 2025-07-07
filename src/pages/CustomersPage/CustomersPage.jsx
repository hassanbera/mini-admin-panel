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
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

  // Responsive breakpoint detection
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint = 'desktop';
      
      if (width <= 480) {
        breakpoint = 'verySmall';
      } else if (width <= 575) {
        breakpoint = 'mobile';
      } else if (width <= 767) {
        breakpoint = 'tablet';
      } else if (width <= 991) {
        breakpoint = 'tablet';
      } else {
        breakpoint = 'desktop';
      }
      
      setCurrentBreakpoint(breakpoint);
    };

    const applyResponsiveStyles = () => {
      const width = window.innerWidth;
      const customersElement = document.querySelector('.customers-container');
      
      if (!customersElement) return;

      // Remove all responsive classes
      customersElement.classList.remove(
        'customers-mobile', 
        'customers-small-tablet', 
        'customers-medium-tablet',
        'customers-large-tablet',
        'customers-extra-large',
        'customers-very-small'
      );

      // Add appropriate class based on screen size
      if (width <= 480) {
        customersElement.classList.add('customers-very-small');
      } else if (width <= 575) {
        customersElement.classList.add('customers-mobile');
      } else if (width <= 767) {
        customersElement.classList.add('customers-small-tablet');
      } else if (width <= 991) {
        customersElement.classList.add('customers-medium-tablet');
      } else if (width <= 1199) {
        customersElement.classList.add('customers-large-tablet');
      } else {
        customersElement.classList.add('customers-extra-large');
      }
    };

    updateBreakpoint();
    applyResponsiveStyles();
    
    window.addEventListener('resize', updateBreakpoint);
    window.addEventListener('resize', applyResponsiveStyles);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
      window.removeEventListener('resize', applyResponsiveStyles);
    };
  }, []);

  // Get responsive configurations - now handled via CSS
  // Dynamic columns based on screen size
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Ad Soyad',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        ellipsis: currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
        ellipsis: currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall',
        responsive: currentBreakpoint === 'verySmall' ? ['sm'] : [],
      },
      {
        title: 'Telefon',
        dataIndex: 'phone',
        key: 'phone',
        responsive: currentBreakpoint === 'verySmall' ? ['md'] : [],
      },
      {
        title: 'Adres',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        width: currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall' ? 150 : 250,
        responsive: currentBreakpoint === 'verySmall' ? ['lg'] : [],
      },
      {
        title: 'İşlemler',
        key: 'actions',
        width: currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall' ? 200 : 250,
        fixed: currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall' ? 'right' : false,
        render: (_, record) => (
          <Space 
            size="small" 
            direction={currentBreakpoint === 'verySmall' ? 'vertical' : 'horizontal'}
            style={currentBreakpoint === 'verySmall' ? { width: '100%' } : {}}
          >
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleView(record)}
            >
              {currentBreakpoint === 'verySmall' ? '' : 'Görüntüle'}
            </Button>
            
            <RoleGuard 
              permission="update"
              showTooltip={true}
              tooltipTitle="Düzenleme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(record)}
                disabled={!canUpdate()}
              >
                {currentBreakpoint === 'verySmall' ? '' : 'Düzenle'}
              </Button>
            </RoleGuard>
            
            <RoleGuard 
              permission="delete"
              showTooltip={true}
              tooltipTitle="Silme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(record)}
                disabled={!canDelete()}
              >
                {currentBreakpoint === 'verySmall' ? '' : 'Sil'}
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
            <div className="user-container">
              <span>Kullanıcı: {userName}</span>
              <Tag color={userRole === 'admin' ? 'green' : 'blue'}>
                {userRole === 'admin' ? 'Yönetici' : 'Görüntüleyici'}
              </Tag>
            </div>
          </div>
          
          <div className="action-button-container">
            <RoleGuard 
              permission="create"
              showTooltip={true}
              tooltipTitle="Yeni müşteri ekleme yetkisi sadece admin kullanıcıda bulunur."
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size={currentBreakpoint === 'verySmall' ? 'small' : 'default'}
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
                {currentBreakpoint === 'verySmall' ? 'Yeni' : 'Yeni Müşteri'}
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
        centered={currentBreakpoint === 'mobile' || currentBreakpoint === 'verySmall'}
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
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Button, 
  Avatar, 
  Menu, 
  Dropdown, 
  Typography, 
  Badge,
  Progress,
  Spin,
  Alert
} from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  OrderedListOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { useOnboardingState } from '../hooks/useOnboardingState';
import { restaurantAPI, dashboardAPI } from '../services/api';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Use simplified onboarding state hook
  const { onboardingState, loading: onboardingLoading } = useOnboardingState();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Only fetch stats if user has a restaurant
        if (onboardingState?.restaurantId) {
          const statsResponse = await dashboardAPI.getStats(onboardingState.restaurantId);
          if (statsResponse.data) {
            setStats(statsResponse.data);
          }
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (!onboardingLoading) {
      fetchDashboardData();
    }
  }, [onboardingState?.restaurantId, onboardingLoading]);

  // Handle continue onboarding
  const handleContinueOnboarding = () => {
    navigate('/onboarding');
  };

  // Check if onboarding is complete
  const isOnboardingComplete = onboardingState?.currentStep === 'COMPLETE';

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: 'Orders',
    },
    {
      key: 'menu',
      icon: <MenuOutlined />,
      label: 'Menu Management',
    },
    {
      key: 'restaurant',
      icon: <ShopOutlined />,
      label: 'Restaurant Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={250} theme="light" style={{ background: 'white' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0, color: '#dc2626' }}>
            Ding Partner
          </Title>
          <Text type="secondary">{user?.name}</Text>
        </div>
        
        <Menu
          mode="vertical"
          defaultSelectedKeys={['dashboard']}
          style={{ border: 'none', marginTop: '20px' }}
          items={menuItems}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ 
          background: 'white', 
          padding: '0 24px', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ margin: 0 }}>
            Dashboard
          </Title>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button type="text" icon={<BellOutlined />} />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                {user?.name}
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ margin: '24px', background: '#f5f5f5' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px' }}>
            
            {/* Onboarding Incomplete Alert */}
            {!onboardingLoading && !isOnboardingComplete && (
              <Alert
                message="Complete Your Restaurant Setup"
                description={`You're ${onboardingState?.progress || 0}% done! Complete your onboarding to start receiving orders.`}
                type="warning"
                showIcon
                style={{ marginBottom: '24px' }}
                action={
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleContinueOnboarding}
                  >
                    Continue Setup
                  </Button>
                }
              />
            )}

            <Row gutter={[24, 24]}>
              {/* Stats Cards */}
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Orders"
                    value={stats.totalOrders}
                    loading={loading}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={stats.totalRevenue}
                    prefix="₹"
                    loading={loading}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Average Order Value"
                    value={stats.avgOrderValue}
                    prefix="₹"
                    loading={loading}
                  />
                </Card>
              </Col>
              
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    loading={loading}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              {/* Quick Actions */}
              <Col xs={24} lg={16}>
                <Card title="Quick Actions" style={{ height: '100%' }}>
                  <div className="space-y-4">
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      size="large"
                      style={{ marginRight: '12px', marginBottom: '12px' }}
                    >
                      Add Menu Item
                    </Button>
                    <Button 
                      icon={<OrderedListOutlined />} 
                      size="large"
                      style={{ marginRight: '12px', marginBottom: '12px' }}
                    >
                      View Orders
                    </Button>
                    <Button 
                      icon={<ShopOutlined />} 
                      size="large"
                      style={{ marginRight: '12px', marginBottom: '12px' }}
                    >
                      Update Restaurant Info
                    </Button>
                  </div>
                </Card>
              </Col>

              {/* Onboarding Progress */}
              <Col xs={24} lg={8}>
                <Card title="Setup Progress" style={{ height: '100%' }}>
                  {onboardingLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Spin />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Progress 
                        type="circle" 
                        percent={onboardingState?.progress || 0}
                        width={80}
                        style={{ display: 'block', textAlign: 'center', marginBottom: '16px' }}
                      />
                      
                      {onboardingState?.availableSteps?.map((step) => (
                        <div key={step.key} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span>{step.completed ? '✅' : '⏳'} {step.title}</span>
                          <Badge 
                            status={step.completed ? "success" : "warning"} 
                            text={step.completed ? "Complete" : "Pending"} 
                          />
                        </div>
                      ))}
                      
                      {!isOnboardingComplete && (
                        <Button 
                          type="primary" 
                          className="mt-4" 
                          block
                          onClick={handleContinueOnboarding}
                        >
                          Continue Setup ({onboardingState?.progress || 0}%)
                        </Button>
                      )}
                      
                      {isOnboardingComplete && (
                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                          <Badge status="success" text="Setup Complete!" />
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                            Your restaurant is ready to receive orders!
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage; 
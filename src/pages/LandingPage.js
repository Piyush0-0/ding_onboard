import React from 'react';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ShopOutlined,
  DollarOutlined,
  LineChartOutlined,
  CustomerServiceOutlined,
  ClockCircleOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DollarOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: 'Increase Revenue',
      description: 'Reach more customers and boost your sales with our digital ordering platform.'
    },
    {
      icon: <LineChartOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: 'Analytics & Insights',
      description: 'Get detailed insights about your customers and orders to make data-driven decisions.'
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: 'Quick Setup',
      description: 'Get your restaurant online in minutes with our simple onboarding process.'
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is here to help you succeed every step of the way.'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: 'Secure Payments',
      description: 'Accept payments securely with integrated payment processing and instant settlements.'
    },
    {
      icon: <ShopOutlined style={{ fontSize: '32px', color: '#dc2626' }} />,
      title: 'Easy Management',
      description: 'Manage your menu, orders, and customers from one simple dashboard.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)' }}>
      {/* Header */}
      <header style={{ background: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>Ding</h1>
              <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>for Partners</span>
            </div>
            <div className="space-x-4">
              <Button type="text" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button type="primary" onClick={() => navigate('/onboarding')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Title level={1} style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
            Grow Your Restaurant Business
            <br />
            <span className="text-primary-600">with Ding</span>
          </Title>
          <Paragraph style={{ fontSize: '20px', color: '#4b5563', marginBottom: '32px', maxWidth: '768px', margin: '0 auto 32px' }}>
            Join thousands of restaurants using Ding to increase their revenue, 
            reach more customers, and streamline their operations. Start accepting 
            online orders today!
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              style={{ height: '48px', padding: '0 32px', fontSize: '18px' }}
              onClick={() => navigate('/onboarding')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="large" 
              style={{ height: '48px', padding: '0 32px', fontSize: '18px' }}
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </Space>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 0', background: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8" style={{ marginBottom: '64px' }}>
            <Title level={2} style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              Why Choose Ding?
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#4b5563', maxWidth: '512px', margin: '0 auto' }}>
              Everything you need to take your restaurant online and grow your business
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Card 
                  className="h-full text-center"
                  style={{ 
                    height: '100%', 
                    textAlign: 'center',
                    transition: 'box-shadow 0.3s',
                    border: 'none'
                  }}
                  hoverable
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4} className="mb-2">{feature.title}</Title>
                  <Paragraph className="text-gray-600">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 0', background: '#dc2626', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-6">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={24} md={8}>
              <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>10,000+</Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                Restaurants Trust Ding
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>₹50L+</Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                Monthly Revenue Processed
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={2} style={{ color: 'white', marginBottom: '8px' }}>30%</Title>
              <Paragraph style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                Average Revenue Increase
              </Paragraph>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: '#f9fafb' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Title level={2} style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Ready to Get Started?
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#4b5563', marginBottom: '32px' }}>
            Join Ding today and start growing your restaurant business. 
            Setup takes less than 10 minutes!
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            style={{ height: '48px', padding: '0 32px', fontSize: '18px' }}
            onClick={() => navigate('/onboarding')}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '32px 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Paragraph style={{ color: '#9ca3af', margin: 0 }}>
            © 2024 Ding. All rights reserved.
          </Paragraph>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
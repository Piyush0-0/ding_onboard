import React from 'react';
import { Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const CompleteStep = ({ restaurantId, restaurantName }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-8">
      <CheckCircleOutlined style={{ fontSize: '64px', color: '#10b981', marginBottom: '24px' }} />
      <Title level={2} style={{ color: '#10b981' }}>
        Welcome to Ding! 🎉
      </Title>
      <Title level={3} style={{ marginBottom: '8px' }}>
        {restaurantName || 'Your Restaurant'} is now live!
      </Title>
      {restaurantId && (
        <Paragraph style={{ fontSize: '16px', color: '#6b7280' }}>
          Restaurant ID: <strong>#{restaurantId}</strong>
        </Paragraph>
      )}
      <div style={{ 
        background: '#f0f9ff', 
        padding: '24px', 
        borderRadius: '12px', 
        margin: '24px 0',
        border: '1px solid #bae6fd'
      }}>
        <Title level={4} style={{ color: '#0369a1', marginBottom: '16px' }}>
          🚀 What's Next?
        </Title>
        <ul style={{ 
          textAlign: 'left', 
          listStyle: 'none', 
          padding: 0,
          margin: 0 
        }}>
          <li style={{ marginBottom: '8px' }}>✅ Your restaurant profile is complete</li>
          <li style={{ marginBottom: '8px' }}>✅ POS integration is configured</li>
          <li style={{ marginBottom: '8px' }}>✅ Menu is synced and ready</li>
          <li style={{ marginBottom: '8px' }}>🎯 Start receiving orders!</li>
        </ul>
      </div>
      
      <Paragraph style={{ color: '#6b7280', marginBottom: '32px' }}>
        You can now manage orders, update your menu, and track your business growth 
        from your personalized dashboard.
      </Paragraph>
      
      <Button 
        type="primary" 
        size="large"
        onClick={() => navigate('/dashboard')}
        style={{ 
          height: '48px', 
          padding: '0 32px', 
          fontSize: '16px',
          borderRadius: '8px'
        }}
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default CompleteStep; 
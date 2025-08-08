import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login(values.phoneNumber, values.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Title level={2} className="text-primary-600">Welcome Back</Title>
          <Paragraph className="text-gray-600">
            Sign in to your Ding partner account
          </Paragraph>
        </div>

        <Card className="shadow-lg">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <Form
            name="login"
            layout="vertical"
            onFinish={handleLogin}
            size="large"
          >
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[6-9]\d{9}$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>New to Ding?</Divider>

          <div className="text-center">
            <Button
              type="default"
              size="large"
              className="w-full h-12"
              onClick={() => navigate('/onboarding')}
            >
              Create Partner Account
            </Button>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-primary-600 hover:text-primary-700">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 
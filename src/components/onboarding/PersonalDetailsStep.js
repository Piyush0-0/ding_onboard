import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const PersonalDetailsStep = ({ 
  onStepComplete, 
  onStepEdit, 
  existingData, 
  isCurrentStep = true 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { register, user } = useAuth();

  // Initialize form with existing data
  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        name: existingData.name,
        email: existingData.email,
        phone: existingData.phone
      });
    }
  }, [existingData, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('[PersonalDetailsStep] Form submitted with values:', values);
      setSubmitting(true);
      
      if (isCurrentStep) {
        // New registration flow
        const registrationData = {
          name: values.name,
          email: values.email,
          phoneNumber: values.phone,
          password: values.password,
          role: 'RESTAURANT_OWNER'
        };

        console.log('[PersonalDetailsStep] Calling register with data:', registrationData);
        const result = await register(registrationData);
        
        console.log('[PersonalDetailsStep] Registration result:', result);
        
        if (!result.success) {
          throw new Error(result.message || 'Registration failed');
        }
        
        message.success('Account created successfully!');
        
        // Call step completion callback
        console.log('[PersonalDetailsStep] Calling onStepComplete');
        if (onStepComplete) {
          onStepComplete('PERSONAL_DETAILS');
        }
        
      } else {
        // Edit existing personal details
        // TODO: Implement API call to update personal details
        message.success('Personal details updated successfully!');
        
        // Call step edit callback
        console.log('[PersonalDetailsStep] Calling onStepEdit');
        if (onStepEdit) {
          onStepEdit('PERSONAL_DETAILS');
        }
      }
      
    } catch (error) {
      console.error('[PersonalDetailsStep] Form submission failed:', error);
      message.error(error.message || 'Failed to save personal details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {isCurrentStep ? 'Create Your Account' : 'Edit Personal Details'}
        </Title>
        <Paragraph style={{ margin: '8px 0 0', color: '#6b7280' }}>
          {isCurrentStep 
            ? 'Please provide your basic information to get started with your restaurant onboarding.'
            : 'Update your personal information below.'
          }
        </Paragraph>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please enter your full name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                ...(isCurrentStep 
                  ? [{ required: true, message: 'Please enter your email' }]
                  : []
                ),
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
                disabled={!isCurrentStep} // Can't change email after registration
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
                size="large"
              />
            </Form.Item>
          </Col>
          {isCurrentStep && (
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter a password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />}
                  placeholder="Create a password"
                  size="large"
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        {isCurrentStep && (
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            style={{ width: '100%' }}
          >
            {isCurrentStep ? 'Create Account and Continue' : 'Update Personal Details'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PersonalDetailsStep; 
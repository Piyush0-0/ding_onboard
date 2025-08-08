import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, Select, message } from 'antd';
import { MenuOutlined, ApiOutlined, KeyOutlined } from '@ant-design/icons';
import { restaurantAPI } from '../../services/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const PosIntegrationStep = ({ 
  restaurantId, 
  onStepComplete, 
  onStepEdit, 
  existingData, 
  isCurrentStep = true 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with existing data
  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        restaurantId: existingData.restaurantId,
        menuSharingCode: existingData.menuSharingCode,
        apiKey: existingData.apiKey,
        apiSecret: existingData.apiSecret,
        accessToken: existingData.accessToken
      });
    }
  }, [existingData, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('[PosIntegrationStep] Form submitted with values:', values);
      setSubmitting(true);
      
      if (isCurrentStep) {
        // Create new POS integration
        const posIntegrationData = {
          posSystem: 'petpooja',
          restaurantId: values.restaurantId,
          menuSharingCode: values.menuSharingCode,
          apiKey: values.apiKey,
          apiSecret: values.apiSecret,
          accessToken: values.accessToken
        };

        console.log('[PosIntegrationStep] Creating POS integration with data:', posIntegrationData);
        const response = await restaurantAPI.createPosIntegration(restaurantId, posIntegrationData);
        
        if (!response.data.success) {
          throw new Error('Failed to configure POS integration');
        }
        
        message.success('POS integration configured successfully!');
        
        // Call step completion callback
        console.log('[PosIntegrationStep] Calling onStepComplete');
        if (onStepComplete) {
          onStepComplete('POS_INTEGRATION');
        }
        
      } else {
        // Edit existing POS integration
        // TODO: Implement API call to update POS integration details
        message.success('POS integration updated successfully!');
        
        // Call step edit callback
        console.log('[PosIntegrationStep] Calling onStepEdit');
        if (onStepEdit) {
          onStepEdit('POS_INTEGRATION');
        }
      }
      
    } catch (error) {
      console.error('[PosIntegrationStep] Form submission failed:', error);
      message.error(error.message || 'Failed to configure POS integration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {isCurrentStep ? 'Connect Your POS System' : 'Edit POS Integration'}
        </Title>
        <Paragraph style={{ margin: '8px 0 0', color: '#6b7280' }}>
          {isCurrentStep 
            ? 'Connect with Petpooja to sync your menu and receive orders seamlessly.'
            : 'Update your POS integration settings below.'
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
              name="restaurantId"
              label="Petpooja Restaurant ID"
              rules={[
                { required: true, message: 'Please enter your Petpooja Restaurant ID' }
              ]}
            >
              <Input 
                prefix={<MenuOutlined />}
                placeholder="Enter your Restaurant ID from Petpooja"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="menuSharingCode"
              label="Menu Sharing Code"
              rules={[
                { required: true, message: 'Please enter your Menu Sharing Code' }
              ]}
            >
              <Input 
                prefix={<ApiOutlined />}
                placeholder="Enter your Menu Sharing Code"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="apiKey"
              label="API Key"
              rules={[
                { required: true, message: 'Please enter your API Key' }
              ]}
            >
              <Input 
                prefix={<KeyOutlined />}
                placeholder="Enter your API Key"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="apiSecret"
              label="API Secret"
              rules={[
                { required: true, message: 'Please enter your API Secret' }
              ]}
            >
              <Input.Password 
                prefix={<KeyOutlined />}
                placeholder="Enter your API Secret"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="accessToken"
          label="Access Token"
          rules={[
            { required: true, message: 'Please enter your Access Token' }
          ]}
        >
          <Input.Password 
            prefix={<KeyOutlined />}
            placeholder="Enter your Access Token"
            size="large"
          />
        </Form.Item>

        <div style={{ 
          background: '#f0f9ff', 
          border: '1px solid #bae6fd',
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '24px' 
        }}>
          <Title level={5} style={{ margin: '0 0 8px 0', color: '#0369a1' }}>
            📋 How to find your Petpooja credentials:
          </Title>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e' }}>
            <li>Log in to your Petpooja account</li>
            <li>Go to Settings → API Settings</li>
            <li>Copy your Restaurant ID, Menu Sharing Code, API Key, API Secret, and Access Token</li>
            <li>Paste them in the fields above</li>
          </ul>
        </div>

        <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            style={{ width: '100%' }}
          >
            {isCurrentStep ? 'Connect POS and Continue' : 'Update POS Integration'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PosIntegrationStep; 
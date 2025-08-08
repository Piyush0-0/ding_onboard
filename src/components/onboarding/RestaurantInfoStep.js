import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Typography, Select, message } from 'antd';
import { ShopOutlined, EnvironmentOutlined, TagOutlined } from '@ant-design/icons';
import { restaurantAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RestaurantInfoStep = ({ 
  onStepComplete, 
  onStepEdit, 
  existingData, 
  isCurrentStep = true 
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();

  // Initialize form with existing data
  useEffect(() => {
    if (existingData) {
      form.setFieldsValue({
        restaurantName: existingData.restaurantName,
        address: existingData.address,
        city: existingData.city,
        state: existingData.state,
        zipCode: existingData.zipCode,
        cuisine: existingData.cuisine,
        description: existingData.description
      });
    }
  }, [existingData, form]);

  const handleSubmit = async (values) => {
    try {
      console.log('[RestaurantInfoStep] Form submitted with values:', values);
      setSubmitting(true);
      
      if (isCurrentStep) {
        // Create new restaurant
        const restaurantData = {
          restaurantName: values.restaurantName,
          address: values.address,
          city: values.city,
          state: values.state || 'India',
          zipCode: values.zipCode || '000000',
          contact: user?.phone_number || user?.phoneNumber,
          cuisineType: values.cuisine,
          description: values.description || `A ${values.cuisine} restaurant`
        };

        console.log('[RestaurantInfoStep] Creating restaurant with data:', restaurantData);
        const response = await restaurantAPI.createRestaurant(restaurantData);
        
        if (!response.data.success) {
          throw new Error('Failed to create restaurant');
        }
        
        message.success('Restaurant created successfully!');
        
        // Refresh user data to include restaurant information
        await refreshUser();
        
        // Call step completion callback
        console.log('[RestaurantInfoStep] Calling onStepComplete');
        if (onStepComplete) {
          onStepComplete('RESTAURANT_INFO');
        }
        
      } else {
        // Edit existing restaurant
        // TODO: Implement API call to update restaurant details
        message.success('Restaurant information updated successfully!');
        
        // Call step edit callback
        console.log('[RestaurantInfoStep] Calling onStepEdit');
        if (onStepEdit) {
          onStepEdit('RESTAURANT_INFO');
        }
      }
      
    } catch (error) {
      console.error('[RestaurantInfoStep] Form submission failed:', error);
      message.error(error.message || 'Failed to save restaurant information');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {isCurrentStep ? 'Restaurant Information' : 'Edit Restaurant Details'}
        </Title>
        <Paragraph style={{ margin: '8px 0 0', color: '#6b7280' }}>
          {isCurrentStep 
            ? 'Tell us about your restaurant to help customers find and connect with you.'
            : 'Update your restaurant information below.'
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
              name="restaurantName"
              label="Restaurant Name"
              rules={[
                { required: true, message: 'Please enter your restaurant name' },
                { min: 2, message: 'Restaurant name must be at least 2 characters' }
              ]}
            >
              <Input 
                prefix={<ShopOutlined />}
                placeholder="Enter your restaurant name"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cuisine"
              label="Cuisine Type"
              rules={[
                { required: true, message: 'Please select your cuisine type' }
              ]}
            >
              <Select 
                placeholder="Select your cuisine type"
                size="large"
              >
                <Option value="North Indian">North Indian</Option>
                <Option value="South Indian">South Indian</Option>
                <Option value="Chinese">Chinese</Option>
                <Option value="Italian">Italian</Option>
                <Option value="Continental">Continental</Option>
                <Option value="Fast Food">Fast Food</Option>
                <Option value="Desserts">Desserts</Option>
                <Option value="Beverages">Beverages</Option>
                <Option value="Multi-Cuisine">Multi-Cuisine</Option>
                <Option value="Street Food">Street Food</Option>
                <Option value="Gujarati">Gujarati</Option>
                <Option value="Punjabi">Punjabi</Option>
                <Option value="Bengali">Bengali</Option>
                <Option value="Maharashtrian">Maharashtrian</Option>
                <Option value="Rajasthani">Rajasthani</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Restaurant Address"
          rules={[
            { required: true, message: 'Please enter your restaurant address' },
            { min: 10, message: 'Address must be at least 10 characters' }
          ]}
        >
          <TextArea 
            placeholder="Enter your complete restaurant address"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: 'Please enter your city' }
              ]}
            >
              <Input 
                prefix={<EnvironmentOutlined />}
                placeholder="Enter your city"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="state"
              label="State"
              rules={[
                { required: true, message: 'Please enter your state' }
              ]}
            >
              <Input 
                placeholder="Enter your state"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="zipCode"
              label="PIN Code"
              rules={[
                { required: true, message: 'Please enter your PIN code' },
                { pattern: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit PIN code' }
              ]}
            >
              <Input 
                placeholder="Enter PIN code"
                size="large"
                maxLength={6}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Restaurant Description (Optional)"
          rules={[
            { max: 500, message: 'Description must be less than 500 characters' }
          ]}
        >
          <TextArea 
            placeholder="Tell customers about your restaurant, specialties, ambiance, etc."
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            style={{ width: '100%' }}
          >
            {isCurrentStep ? 'Save Restaurant Details and Continue' : 'Update Restaurant Details'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RestaurantInfoStep; 
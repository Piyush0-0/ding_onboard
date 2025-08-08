import React, { useState, useEffect } from 'react';
import { Button, Typography, Spin, Alert, Card, Row, Col, Tag, message, Collapse, Divider, Space } from 'antd';
import { MenuOutlined, CheckCircleOutlined, EyeOutlined, CaretRightOutlined } from '@ant-design/icons';
import { restaurantAPI } from '../../services/api';

const { Title, Paragraph, Text } = Typography;

const MenuPreviewStep = ({ 
  restaurantId, 
  onStepComplete, 
  onStepEdit, 
  existingData, 
  isCurrentStep = true 
}) => {
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch menu preview from POS
  const fetchMenuPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[MenuPreviewStep] Fetching menu preview for restaurant:', restaurantId);
      const response = await restaurantAPI.getMenuPreview(restaurantId);
      
      if (response.data.success) {
        setMenuData(response.data.menu);
        console.log('[MenuPreviewStep] Menu preview fetched:', response.data.menu);
      } else {
        throw new Error(response.data.error || 'Failed to fetch menu preview');
      }
      
    } catch (err) {
      console.error('[MenuPreviewStep] Error fetching menu preview:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save menu to database
  const saveMenu = async () => {
    try {
      setSaving(true);
      
      console.log('[MenuPreviewStep] Saving menu for restaurant:', restaurantId);
      const response = await restaurantAPI.saveMenu(restaurantId);
      
      if (response.data.success) {
        message.success('Menu saved successfully!');
        
        if (isCurrentStep) {
          // Call step completion callback
          console.log('[MenuPreviewStep] Calling onStepComplete');
          if (onStepComplete) {
            onStepComplete('MENU_PREVIEW');
          }
        } else {
          // Call step edit callback  
          console.log('[MenuPreviewStep] Calling onStepEdit');
          if (onStepEdit) {
            onStepEdit('MENU_PREVIEW');
          }
        }
        
      } else {
        throw new Error(response.data.error || 'Failed to save menu');
      }
      
    } catch (err) {
      console.error('[MenuPreviewStep] Error saving menu:', err);
      message.error(err.message || 'Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  // Load menu preview on component mount
  useEffect(() => {
    if (restaurantId) {
      fetchMenuPreview();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading your menu from POS system...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>Menu Preview</Title>
          <Paragraph style={{ margin: '8px 0 0', color: '#6b7280' }}>
            There was an error loading your menu preview.
          </Paragraph>
        </div>
        
        <Alert
          message="Error Loading Menu"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={fetchMenuPreview}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {isCurrentStep ? 'Review Your Menu' : 'Edit Menu Preview'}
        </Title>
        <Paragraph style={{ margin: '8px 0 0', color: '#6b7280' }}>
          {isCurrentStep 
            ? 'Review your menu items synced from your POS system before going live.'
            : 'Your current menu preview. You can resync with your POS system anytime.'
          }
        </Paragraph>
      </div>

      {menuData && (
        <>
          {/* Restaurant Info */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <MenuOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#dc2626' }} />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {menuData.restaurantInfo?.name || 'Your Restaurant'}
                </Title>
                <Text type="secondary">
                  Restaurant ID: {menuData.restaurantInfo?.restaurantId}
                </Text>
              </div>
            </div>
          </Card>

          {/* Menu Categories with Items */}
          <div style={{ marginBottom: '24px' }}>
            <Title level={5}>Menu Categories & Items ({menuData.categories?.length || 0} categories)</Title>
            
            <Collapse
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ background: '#fff' }}
              size="small"
            >
              {menuData.categories?.map((category, index) => (
                <Collapse.Panel
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Space>
                        <Text strong style={{ fontSize: '16px' }}>{category.name}</Text>
                        <Tag color="blue">{category.items?.length || 0} items</Tag>
                      </Space>
                    </div>
                  }
                  key={category.id || index}
                >
                  {category.items && category.items.length > 0 ? (
                    <Row gutter={[16, 16]} style={{ marginTop: '12px' }}>
                      {category.items.map((item, itemIndex) => (
                        <Col span={12} key={item.id || itemIndex}>
                          <Card size="small" style={{ background: '#fafafa' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <Text strong style={{ fontSize: '14px', display: 'block' }}>
                                  {item.name}
                                </Text>
                                
                                {item.description && (
                                  <Text 
                                    type="secondary" 
                                    style={{ 
                                      fontSize: '12px', 
                                      display: 'block', 
                                      marginTop: '4px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    {item.description}
                                  </Text>
                                )}
                                
                                <div style={{ marginTop: '8px' }}>
                                  <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626' }}>
                                    ₹{item.price || 0}
                                  </Text>
                                </div>
                                
                                <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {item.isVeg ? (
                                    <Tag color="green" size="small">🟢 Veg</Tag>
                                  ) : (
                                    <Tag color="red" size="small">🔴 Non-Veg</Tag>
                                  )}
                                  
                                  {item.isAvailable ? (
                                    <Tag color="blue" size="small">Available</Tag>
                                  ) : (
                                    <Tag color="default" size="small">Out of Stock</Tag>
                                  )}
                                  
                                  {item.variations && item.variations.length > 0 && (
                                    <Tag color="purple" size="small">
                                      {item.variations.length} variations
                                    </Tag>
                                  )}
                                  
                                  {item.addons && item.addons.length > 0 && (
                                    <Tag color="orange" size="small">
                                      {item.addons.length} add-ons
                                    </Tag>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <Text type="secondary">No items found in this category</Text>
                    </div>
                  )}
                </Collapse.Panel>
              ))}
            </Collapse>
            
            {(!menuData.categories || menuData.categories.length === 0) && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">No menu categories found. Please check your POS integration.</Text>
              </div>
            )}
          </div>

          {/* Summary */}
          <Card style={{ background: '#f8fafc', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Menu Summary</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">
                    {menuData.categories?.length || 0} categories • {' '}
                    {menuData.categories?.reduce((total, cat) => total + (cat.items?.length || 0), 0) || 0} total items
                  </Text>
                </div>
              </div>
              <CheckCircleOutlined style={{ fontSize: '24px', color: '#10b981' }} />
            </div>
          </Card>

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              loading={saving}
              onClick={saveMenu}
              style={{ minWidth: '200px' }}
            >
              {isCurrentStep ? 'Save Menu and Continue' : 'Update Menu'}
            </Button>
            
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                You can modify item availability and prices from your dashboard later
              </Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuPreviewStep; 
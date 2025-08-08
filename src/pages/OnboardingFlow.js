import React, { useState, useEffect } from 'react';
import { Card, Progress, Steps, Typography, Spin, Alert, Button } from 'antd';
import { CheckCircleOutlined, UserOutlined, ShopOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { restaurantAPI } from '../services/api';

// Step Components
import PersonalDetailsStep from '../components/onboarding/PersonalDetailsStep';
import RestaurantInfoStep from '../components/onboarding/RestaurantInfoStep';
import PosIntegrationStep from '../components/onboarding/PosIntegrationStep';
import MenuPreviewStep from '../components/onboarding/MenuPreviewStep';
import CompleteStep from '../components/onboarding/CompleteStep';

const { Title } = Typography;

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [onboardingData, setOnboardingData] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch onboarding state from backend
  const fetchOnboardingState = async () => {
    try {
      console.log('[OnboardingFlow] Fetching onboarding state for user:', user?.id);
      setLoading(true);
      setError(null);
      
      const response = await restaurantAPI.getOnboardingState();
      console.log('[OnboardingFlow] Backend response:', response.data);
      
      if (response.data.success) {
        setOnboardingData(response.data);
        setActiveStep(response.data.currentStep);
        console.log('[OnboardingFlow] Set active step to:', response.data.currentStep);
      } else {
        throw new Error('Failed to fetch onboarding state');
      }
      
    } catch (err) {
      console.error('[OnboardingFlow] Error fetching onboarding state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchOnboardingState();
    } else if (!authLoading) {
      // No user - set up for personal details
      setActiveStep('PERSONAL_DETAILS');
      setLoading(false);
    }
  }, [user, authLoading]);

  // Handle step completion (progresses to next step)
  const handleStepComplete = async (stepKey) => {
    try {
      console.log('[OnboardingFlow] Step completed:', stepKey);
      
      // Refresh onboarding state from backend
      await fetchOnboardingState();
      
      console.log('[OnboardingFlow] Step completion handled successfully');
      
    } catch (err) {
      console.error('[OnboardingFlow] Error handling step completion:', err);
    }
  };

  // Handle step editing (updates data but returns to current step)
  const handleStepEdit = async (stepKey) => {
    try {
      console.log('[OnboardingFlow] Step edited:', stepKey);
      
      // Refresh onboarding state from backend
      await fetchOnboardingState();
      
      console.log('[OnboardingFlow] Step edit handled successfully');
      
    } catch (err) {
      console.error('[OnboardingFlow] Error handling step edit:', err);
    }
  };

  // Navigate to step for editing
  const navigateToStep = (stepKey) => {
    console.log('[OnboardingFlow] Navigating to step:', stepKey);
    setActiveStep(stepKey);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Render step content
  const renderStepContent = () => {
    // Handle case where onboardingData is null (first visit) - treat as current step
    const isCurrentStep = onboardingData 
      ? activeStep === onboardingData.currentStep
      : activeStep === 'PERSONAL_DETAILS'; // First visit should be current step
    const existingData = onboardingData?.stepData?.[activeStep];
    
    console.log('[OnboardingFlow] Rendering step:', activeStep, 'isCurrentStep:', isCurrentStep, 'existingData:', existingData, 'onboardingData?.currentStep:', onboardingData?.currentStep);
    
    switch (activeStep) {
      case 'PERSONAL_DETAILS':
        return (
          <PersonalDetailsStep 
            onStepComplete={handleStepComplete}
            onStepEdit={handleStepEdit}
            existingData={existingData}
            isCurrentStep={isCurrentStep}
          />
        );
      case 'RESTAURANT_INFO':
        return (
          <RestaurantInfoStep 
            onStepComplete={handleStepComplete}
            onStepEdit={handleStepEdit}
            existingData={existingData}
            isCurrentStep={isCurrentStep}
          />
        );
      case 'POS_INTEGRATION':
        return (
          <PosIntegrationStep 
            restaurantId={onboardingData?.restaurantId}
            onStepComplete={handleStepComplete}
            onStepEdit={handleStepEdit}
            existingData={existingData}
            isCurrentStep={isCurrentStep}
          />
        );
      case 'MENU_PREVIEW':
        return (
          <MenuPreviewStep 
            restaurantId={onboardingData?.restaurantId}
            onStepComplete={handleStepComplete}
            onStepEdit={handleStepEdit}
            existingData={existingData}
            isCurrentStep={isCurrentStep}
          />
        );
      case 'COMPLETE':
        return (
          <CompleteStep 
            restaurantId={onboardingData?.restaurantId}
            restaurantName={onboardingData?.stepData?.RESTAURANT_INFO?.restaurantName}
          />
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Title level={4}>Step not found</Title>
            <Button type="primary" onClick={() => setActiveStep('PERSONAL_DETAILS')}>
              Start Onboarding
            </Button>
          </div>
        );
    }
  };

  // Show loading spinner
  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f9fafb' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <Spin size="large" />
          <span style={{ marginLeft: '16px' }}>Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen" style={{ background: '#f9fafb' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <Alert
            message="Error Loading Onboarding"
            description={error}
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={fetchOnboardingState}>
                Retry
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // Get current step info for display
  const currentStepInfo = onboardingData?.availableSteps?.find(step => step.key === activeStep) || {
    key: 'PERSONAL_DETAILS',
    title: 'Personal Details',
    description: 'Create your account and provide basic information'
  };

  return (
    <div className="min-h-screen" style={{ background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ background: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0, color: '#dc2626' }}>
              Ding Partner Registration
            </Title>
            {user && (
              <Button 
                type="text" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ color: '#6b7280' }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <Progress 
          percent={onboardingData?.progress || 0} 
          showInfo={false} 
          style={{ marginBottom: '24px' }}
        />
        
        {/* Steps Indicator */}
        <div style={{ marginBottom: '32px' }}>
          <Steps
            current={onboardingData?.availableSteps?.findIndex(step => step.key === activeStep) || 0}
            size="small"
            items={onboardingData?.availableSteps?.map((step, index) => ({
              title: step.title,
              icon: getStepIcon(step.key),
              status: step.completed ? 'finish' : 
                     step.isCurrent ? 'process' : 'wait',
              disabled: !step.editable,
              onClick: step.editable ? () => navigateToStep(step.key) : undefined,
              style: step.editable ? { cursor: 'pointer' } : {}
            })) || [
              { title: 'Personal Details', icon: <UserOutlined />, status: 'process' }
            ]}
          />
        </div>
        
        {/* Main Content Card */}
        <Card style={{ minHeight: '500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={3} style={{ margin: 0, marginRight: '12px' }}>
              {currentStepInfo.title}
            </Title>
            {activeStep !== onboardingData?.currentStep && (
              <span style={{ 
                background: '#e0f2fe', 
                color: '#0369a1', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px' 
              }}>
                Editing
              </span>
            )}
          </div>
          
          {/* Step Content */}
          {renderStepContent()}
        </Card>
      </div>
    </div>
  );
};

// Helper function to get step icons
const getStepIcon = (stepKey) => {
  switch (stepKey) {
    case 'PERSONAL_DETAILS': return <UserOutlined />;
    case 'RESTAURANT_INFO': return <ShopOutlined />;
    case 'POS_INTEGRATION': return <MenuOutlined />;
    case 'MENU_PREVIEW': return <MenuOutlined />;
    case 'COMPLETE': return <CheckCircleOutlined />;
    default: return <UserOutlined />;
  }
};

export default OnboardingFlow; 
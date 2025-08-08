import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { restaurantAPI } from '../services/api';

/**
 * Simplified hook for fetching onboarding state from backend
 * Single source of truth - backend determines everything
 */
export const useOnboardingState = () => {
  const { user, refreshUser } = useAuth();
  const [onboardingState, setOnboardingState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch onboarding state from backend
  const fetchOnboardingState = useCallback(async () => {
    console.log('[useOnboardingState] fetchOnboardingState called, user:', user);
    
    // If no user is logged in, provide default state for personal details
    if (!user) {
      console.log('[useOnboardingState] No user, setting default state');
      setOnboardingState({
        currentStep: 'PERSONAL_DETAILS',
        completedSteps: [],
        availableSteps: [
          {
            key: 'PERSONAL_DETAILS',
            title: 'Personal Details',
            description: 'Create your account and provide basic information',
            completed: false,
            editable: true,
            isCurrent: true
          }
        ],
        stepData: {},
        progress: 0,
        restaurantId: null,
        userId: null
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('[useOnboardingState] Fetching onboarding state for user:', user.id);
      const response = await restaurantAPI.getOnboardingState();
      
      console.log('[useOnboardingState] Backend response:', response.data);
      
      if (response.data.success) {
        console.log('[useOnboardingState] Setting onboarding state:', response.data);
        setOnboardingState(response.data);
      } else {
        throw new Error('Failed to fetch onboarding state: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('[useOnboardingState] Error fetching onboarding state:', error);
      setError(error.message);
      
      // Fallback state for any errors
      // If user exists but API fails, assume they need to create restaurant
      const fallbackState = {
        currentStep: 'RESTAURANT_INFO',
        completedSteps: ['PERSONAL_DETAILS'],
        availableSteps: [
          {
            key: 'PERSONAL_DETAILS',
            title: 'Personal Details',
            completed: true,
            editable: true,
            isCurrent: false
          },
          {
            key: 'RESTAURANT_INFO',
            title: 'Restaurant Information',
            completed: false,
            editable: true,
            isCurrent: true
          }
        ],
        stepData: {
          PERSONAL_DETAILS: {
            name: user.name,
            email: user.email,
            phone: user.phone_number || user.phoneNumber
          }
        },
        progress: 20,
        restaurantId: null,
        userId: user.id
      };
      
      console.log('[useOnboardingState] Setting fallback state:', fallbackState);
      setOnboardingState(fallbackState);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh state when user changes
  useEffect(() => {
    fetchOnboardingState();
  }, [fetchOnboardingState]);

  // Get current step info
  const getCurrentStep = useCallback(() => {
    const currentStep = onboardingState?.currentStep || 'PERSONAL_DETAILS';
    const stepIndex = onboardingState?.availableSteps?.findIndex(step => step.key === currentStep) || 0;
    return { step: currentStep, stepIndex };
  }, [onboardingState]);

  // Refresh user data after certain steps
  const refreshUserData = useCallback(async () => {
    try {
      console.log('[useOnboardingState] refreshUserData called');
      await refreshUser();
      await fetchOnboardingState();
      console.log('[useOnboardingState] refreshUserData completed');
    } catch (error) {
      console.error('[useOnboardingState] Error refreshing user data:', error);
    }
  }, [refreshUser, fetchOnboardingState]);

  return {
    // State
    onboardingState,
    loading,
    error,
    
    // Helpers
    getCurrentStep,
    refreshUserData,
    fetchOnboardingState
  };
}; 
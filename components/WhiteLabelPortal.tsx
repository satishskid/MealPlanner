import React, { useState, useEffect } from 'react';
import { OrganizationProfile, WhiteLabelConfig, UserProfile, DailyFoodLog } from '../types';
import FlexibleMealInput from './FlexibleMealInput';
import PatientStatusTracker from './PatientStatusTracker';

interface WhiteLabelPortalProps {
  organization: OrganizationProfile;
  whiteLabelConfig: WhiteLabelConfig;
  onPatientSubmission: (profile: UserProfile, foodLog: DailyFoodLog) => void;
}

const WhiteLabelPortal: React.FC<WhiteLabelPortalProps> = ({ 
  organization, 
  whiteLabelConfig,
  onPatientSubmission 
}) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'profile' | 'food_log' | 'status'>('welcome');
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);

  // Apply custom branding
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', organization.branding.primaryColor);
    root.style.setProperty('--secondary-color', organization.branding.secondaryColor);
    root.style.setProperty('--accent-color', organization.branding.accentColor);
    
    if (organization.branding.fontFamily) {
      root.style.setProperty('--font-family', organization.branding.fontFamily);
    }

    // Apply custom CSS if provided
    if (whiteLabelConfig.branding.customCSS) {
      const styleElement = document.createElement('style');
      styleElement.textContent = whiteLabelConfig.branding.customCSS;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [organization.branding, whiteLabelConfig.branding]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setPatientProfile(profile);
    setCurrentStep('food_log');
  };

  const handleFoodLogSubmit = (foodLog: DailyFoodLog) => {
    if (patientProfile) {
      onPatientSubmission(patientProfile, foodLog);
      const newCaseId = `case_${Date.now()}`;
      setCaseId(newCaseId);
      setCurrentStep('status');
    }
  };

  const renderWelcome = () => (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: organization.branding.primaryColor }}>
      {/* Header */}
      <div className="bg-black/10 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {organization.branding.logo && (
              <img 
                src={organization.branding.logo} 
                alt={organization.name}
                className="h-12 w-auto"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {organization.name}
              </h1>
              <p className="text-white/80 text-sm">Nutrition Services</p>
            </div>
          </div>
          
          {!whiteLabelConfig.customizations.hideNutreeAIBranding && (
            <div className="text-white/60 text-xs">
              Powered by nutree<span className="text-yellow-300">ai</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {organization.branding.welcomeMessage || 'Welcome to Our Nutrition Services'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get personalized nutrition analysis from our certified professionals. 
              Understanding your food choices is the first step toward better health.
            </p>
            
            <button
              onClick={() => setCurrentStep('profile')}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              style={{ backgroundColor: organization.branding.accentColor }}
            >
              Start Your Nutrition Analysis
            </button>
          </div>

          {/* Organization Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3" style={{ color: organization.branding.accentColor }}>
                Professional Analysis
              </h3>
              <p className="leading-relaxed">
                Our certified nutritionists review every analysis to ensure you receive 
                accurate, personalized recommendations based on your cultural preferences and health goals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3" style={{ color: organization.branding.accentColor }}>
                Science-Based Approach
              </h3>
              <p className="leading-relaxed">
                Every recommendation is backed by nutritional science and tailored to your 
                individual needs, respecting your cultural food traditions and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {organization.branding.footerText && (
        <div className="bg-black/20 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/70 text-sm">{organization.branding.footerText}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfileForm = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {organization.branding.logo && (
              <img 
                src={organization.branding.logo} 
                alt={organization.name}
                className="h-12 w-auto"
              />
            )}
            <h1 className="text-2xl font-bold" style={{ color: organization.branding.primaryColor }}>
              {organization.name}
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tell Us About Yourself</h2>
          <p className="text-gray-600">This helps us provide personalized nutrition recommendations</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const profile: UserProfile = {
              ageGroup: formData.get('ageGroup') as string,
              cuisinePreference: formData.get('cuisinePreference') as string
            };
            handleProfileSubmit(profile);
          }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group *
                </label>
                <select
                  name="ageGroup"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ '--tw-ring-color': organization.branding.primaryColor } as React.CSSProperties}
                >
                  <option value="">Select your age group</option>
                  <option value="Child (5-12)">Child (5-12)</option>
                  <option value="Teen (13-19)">Teen (13-19)</option>
                  <option value="Young Adult (20-29)">Young Adult (20-29)</option>
                  <option value="Adult (30-49)">Adult (30-49)</option>
                  <option value="Middle-aged (50-64)">Middle-aged (50-64)</option>
                  <option value="Senior (65+)">Senior (65+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Preference *
                </label>
                <select
                  name="cuisinePreference"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ '--tw-ring-color': organization.branding.primaryColor } as React.CSSProperties}
                >
                  <option value="">Select your cuisine preference</option>
                  <option value="North Indian">North Indian</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Maharashtrian">Maharashtrian</option>
                  <option value="Continental">Continental</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Keto">Keto</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {organization.settings.requirePatientConsent && (
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    className="mt-1 rounded"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-700">
                    I consent to having my nutrition data analyzed by certified nutritionists 
                    and understand that this analysis is for informational purposes only and 
                    does not replace professional medical advice.
                  </label>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('welcome')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                  style={{ backgroundColor: organization.branding.primaryColor }}
                >
                  Continue to Food Log
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderFoodLog = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {organization.branding.logo && (
              <img 
                src={organization.branding.logo} 
                alt={organization.name}
                className="h-12 w-auto"
              />
            )}
            <h1 className="text-2xl font-bold" style={{ color: organization.branding.primaryColor }}>
              {organization.name}
            </h1>
          </div>
        </div>

        {/* Custom styled FlexibleMealInput */}
        <div style={{ 
          '--primary-color': organization.branding.primaryColor,
          '--accent-color': organization.branding.accentColor 
        } as React.CSSProperties}>
          <FlexibleMealInput
            onSubmit={handleFoodLogSubmit}
            isLoading={false}
            profileSet={!!patientProfile}
          />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentStep('profile')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {organization.branding.logo && (
              <img 
                src={organization.branding.logo} 
                alt={organization.name}
                className="h-12 w-auto"
              />
            )}
            <h1 className="text-2xl font-bold" style={{ color: organization.branding.primaryColor }}>
              {organization.name}
            </h1>
          </div>
        </div>

        {caseId && (
          <PatientStatusTracker 
            caseId={caseId}
            organizationBranding={organization.branding}
          />
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Need to submit another nutrition analysis?
          </p>
          <button
            onClick={() => {
              setCurrentStep('welcome');
              setPatientProfile(null);
              setCaseId(null);
            }}
            className="px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: organization.branding.primaryColor }}
          >
            Start New Analysis
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans" style={{ fontFamily: organization.branding.fontFamily || 'inherit' }}>
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'profile' && renderProfileForm()}
      {currentStep === 'food_log' && renderFoodLog()}
      {currentStep === 'status' && renderStatus()}
    </div>
  );
};

export default WhiteLabelPortal;

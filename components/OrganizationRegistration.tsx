import React, { useState } from 'react';
import { OrganizationProfile, OrganizationType, NutritionistAssignmentModel, BillingModel } from '../types';

interface OrganizationRegistrationProps {
  onRegistrationComplete: (organization: OrganizationProfile) => void;
  onCancel: () => void;
}

const OrganizationRegistration: React.FC<OrganizationRegistrationProps> = ({ 
  onRegistrationComplete, 
  onCancel 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({
    name: '',
    type: 'clinic',
    subdomain: '',
    contactInfo: {
      primaryContact: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#fbbf24',
      welcomeMessage: 'Welcome to our nutrition services'
    },
    settings: {
      nutritionistAssignmentModel: 'nutreeai_provided',
      maxPatientsPerMonth: 100,
      allowBulkUploads: false,
      requirePatientConsent: true,
      enableCustomReports: false,
      autoAssignCases: true,
      escalationThresholdHours: 24
    },
    billing: {
      model: 'per_case',
      pricePerCase: 25,
      billingContact: ''
    }
  });

  const organizationTypes: { value: OrganizationType; label: string; description: string }[] = [
    { value: 'clinic', label: 'Medical Clinic', description: 'Private practice or medical clinic' },
    { value: 'hospital', label: 'Hospital', description: 'Hospital or health system' },
    { value: 'wellness_center', label: 'Wellness Center', description: 'Wellness or fitness center' },
    { value: 'school', label: 'Educational Institution', description: 'School, college, or university' },
    { value: 'corporate', label: 'Corporate Wellness', description: 'Employee wellness program' },
    { value: 'telehealth', label: 'Telehealth Provider', description: 'Remote healthcare services' },
    { value: 'research', label: 'Research Institution', description: 'Academic or clinical research' }
  ];

  const assignmentModels: { value: NutritionistAssignmentModel; label: string; description: string }[] = [
    { 
      value: 'nutreeai_provided', 
      label: 'NutreeAI Nutritionists', 
      description: 'Use our certified nutritionists (recommended for getting started)' 
    },
    { 
      value: 'in_house', 
      label: 'In-House Nutritionists', 
      description: 'Use your existing nutritionist staff' 
    },
    { 
      value: 'hybrid', 
      label: 'Hybrid Model', 
      description: 'Use in-house nutritionists with NutreeAI escalation for complex cases' 
    }
  ];

  const billingModels: { value: BillingModel; label: string; description: string }[] = [
    { value: 'per_case', label: 'Per Case', description: '$25 per nutrition analysis' },
    { value: 'monthly_subscription', label: 'Monthly Subscription', description: 'Fixed monthly fee for unlimited cases' },
    { value: 'annual_contract', label: 'Annual Contract', description: 'Custom annual pricing with volume discounts' },
    { value: 'custom', label: 'Custom Pricing', description: 'Contact us for enterprise pricing' }
  ];

  const generateSubdomain = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    const subdomain = generateSubdomain(name);
    setFormData(prev => ({
      ...prev,
      name,
      subdomain
    }));
  };

  const handleSubmit = () => {
    const organization: OrganizationProfile = {
      id: `org_${Date.now()}`,
      ...formData as OrganizationProfile,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      totalCasesProcessed: 0,
      currentMonthCases: 0
    };

    onRegistrationComplete(organization);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Healthy Life Clinic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as OrganizationType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {organizationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {organizationTypes.find(t => t.value === formData.type)?.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subdomain *
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.subdomain}
              onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="healthy-life-clinic"
            />
            <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">
              .nutreeai.com
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your patients will access the portal at: {formData.subdomain}.nutreeai.com
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Contact *
            </label>
            <input
              type="text"
              value={formData.contactInfo?.primaryContact}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo!, primaryContact: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dr. Sarah Johnson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.contactInfo?.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo!, email: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@healthylifeclinic.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.contactInfo?.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo!, phone: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Configuration</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nutritionist Assignment Model *
          </label>
          <div className="space-y-3">
            {assignmentModels.map((model) => (
              <div key={model.value} className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={model.value}
                  name="assignmentModel"
                  value={model.value}
                  checked={formData.settings?.nutritionistAssignmentModel === model.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings!, nutritionistAssignmentModel: e.target.value as NutritionistAssignmentModel }
                  }))}
                  className="mt-1"
                />
                <label htmlFor={model.value} className="flex-1">
                  <div className="font-medium text-gray-900">{model.label}</div>
                  <div className="text-sm text-gray-600">{model.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Patients Per Month
            </label>
            <input
              type="number"
              value={formData.settings?.maxPatientsPerMonth}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings!, maxPatientsPerMonth: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escalation Threshold (Hours)
            </label>
            <input
              type="number"
              value={formData.settings?.escalationThresholdHours}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings!, escalationThresholdHours: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.settings?.allowBulkUploads}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings!, allowBulkUploads: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable bulk patient uploads</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.settings?.autoAssignCases}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings!, autoAssignCases: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Automatically assign cases to nutritionists</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.settings?.enableCustomReports}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings!, enableCustomReports: e.target.checked }
              }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Enable custom report templates</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Configuration</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Billing Model *
          </label>
          <div className="space-y-3">
            {billingModels.map((model) => (
              <div key={model.value} className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={model.value}
                  name="billingModel"
                  value={model.value}
                  checked={formData.billing?.model === model.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    billing: { ...prev.billing!, model: e.target.value as BillingModel }
                  }))}
                  className="mt-1"
                />
                <label htmlFor={model.value} className="flex-1">
                  <div className="font-medium text-gray-900">{model.label}</div>
                  <div className="text-sm text-gray-600">{model.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Contact Email *
          </label>
          <input
            type="email"
            value={formData.billing?.billingContact}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              billing: { ...prev.billing!, billingContact: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="billing@healthylifeclinic.com"
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Registration Summary</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Organization:</strong> {formData.name}</p>
          <p><strong>Type:</strong> {organizationTypes.find(t => t.value === formData.type)?.label}</p>
          <p><strong>Portal URL:</strong> {formData.subdomain}.nutreeai.com</p>
          <p><strong>Assignment Model:</strong> {assignmentModels.find(m => m.value === formData.settings?.nutritionistAssignmentModel)?.label}</p>
          <p><strong>Billing:</strong> {billingModels.find(b => b.value === formData.billing?.model)?.label}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join the NutreeAI Partner Network
            </h1>
            <p className="text-gray-600">
              Register your organization to provide AI-powered nutrition services to your patients
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <div>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegistration;

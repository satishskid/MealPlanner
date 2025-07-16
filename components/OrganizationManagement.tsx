import React, { useState } from 'react';
import { OrganizationProfile, OrganizationAnalytics, OrganizationType } from '../types';

interface OrganizationManagementProps {
  onClose: () => void;
}

const OrganizationManagement: React.FC<OrganizationManagementProps> = ({ onClose }) => {
  const [view, setView] = useState<'list' | 'details' | 'analytics'>('list');
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo organizations data
  const [organizations, setOrganizations] = useState<OrganizationProfile[]>([
    {
      id: 'org_001',
      name: 'Healthy Life Medical Center',
      type: 'clinic',
      subdomain: 'healthy-life-medical',
      contactInfo: {
        primaryContact: 'Dr. Sarah Johnson',
        email: 'admin@healthylife.com',
        phone: '(555) 123-4567',
        address: {
          street: '123 Medical Plaza',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'United States'
        }
      },
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#fbbf24',
        welcomeMessage: 'Welcome to Healthy Life Nutrition Services'
      },
      settings: {
        nutritionistAssignmentModel: 'hybrid',
        maxPatientsPerMonth: 500,
        allowBulkUploads: true,
        requirePatientConsent: true,
        enableCustomReports: true,
        autoAssignCases: true,
        escalationThresholdHours: 12
      },
      billing: {
        model: 'monthly_subscription',
        monthlyFee: 2500,
        billingContact: 'billing@healthylife.com'
      },
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
      totalCasesProcessed: 1247,
      currentMonthCases: 89
    },
    {
      id: 'org_002',
      name: 'University Wellness Center',
      type: 'school',
      subdomain: 'university-wellness',
      contactInfo: {
        primaryContact: 'Dr. Michael Chen',
        email: 'wellness@university.edu',
        phone: '(555) 987-6543',
        address: {
          street: '456 Campus Drive',
          city: 'Berkeley',
          state: 'CA',
          zipCode: '94720',
          country: 'United States'
        }
      },
      branding: {
        primaryColor: '#059669',
        secondaryColor: '#047857',
        accentColor: '#f59e0b',
        welcomeMessage: 'Student Health & Nutrition Services'
      },
      settings: {
        nutritionistAssignmentModel: 'nutreeai_provided',
        maxPatientsPerMonth: 1000,
        allowBulkUploads: true,
        requirePatientConsent: true,
        enableCustomReports: false,
        autoAssignCases: true,
        escalationThresholdHours: 24
      },
      billing: {
        model: 'annual_contract',
        billingContact: 'finance@university.edu'
      },
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
      totalCasesProcessed: 2156,
      currentMonthCases: 234
    },
    {
      id: 'org_003',
      name: 'TechCorp Employee Wellness',
      type: 'corporate',
      subdomain: 'techcorp-wellness',
      contactInfo: {
        primaryContact: 'Lisa Rodriguez',
        email: 'hr@techcorp.com',
        phone: '(555) 456-7890',
        address: {
          street: '789 Innovation Blvd',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          country: 'United States'
        }
      },
      branding: {
        primaryColor: '#7c3aed',
        secondaryColor: '#6d28d9',
        accentColor: '#f97316',
        welcomeMessage: 'TechCorp Employee Nutrition Program'
      },
      settings: {
        nutritionistAssignmentModel: 'nutreeai_provided',
        maxPatientsPerMonth: 300,
        allowBulkUploads: false,
        requirePatientConsent: true,
        enableCustomReports: true,
        autoAssignCases: true,
        escalationThresholdHours: 48
      },
      billing: {
        model: 'per_case',
        pricePerCase: 20,
        billingContact: 'finance@techcorp.com'
      },
      isActive: true,
      createdAt: '2024-03-01T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
      totalCasesProcessed: 456,
      currentMonthCases: 67
    }
  ]);

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.contactInfo.primaryContact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrganizationTypeLabel = (type: OrganizationType): string => {
    const labels = {
      clinic: 'Medical Clinic',
      hospital: 'Hospital',
      wellness_center: 'Wellness Center',
      school: 'Educational Institution',
      corporate: 'Corporate Wellness',
      telehealth: 'Telehealth Provider',
      research: 'Research Institution'
    };
    return labels[type];
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const toggleOrganizationStatus = (id: string) => {
    setOrganizations(prev => prev.map(org => 
      org.id === id ? { ...org, isActive: !org.isActive } : org
    ));
  };

  const renderOrganizationList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Management</h2>
          <p className="text-gray-600">{organizations.length} registered organizations</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            + Add Organization
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cases This Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{org.name}</div>
                      <div className="text-sm text-gray-500">{org.subdomain}.nutreeai.com</div>
                      <div className="text-sm text-gray-500">{org.contactInfo.primaryContact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {getOrganizationTypeLabel(org.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="capitalize">
                      {org.settings.nutritionistAssignmentModel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{org.currentMonthCases}</span>
                      <span className="text-gray-500 ml-1">/ {org.settings.maxPatientsPerMonth}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${(org.currentMonthCases / org.settings.maxPatientsPerMonth) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(org.isActive)}`}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOrganization(org);
                        setView('details');
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrganization(org);
                        setView('analytics');
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => toggleOrganizationStatus(org.id)}
                      className={org.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                    >
                      {org.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No organizations found matching your search.</p>
        </div>
      )}
    </div>
  );

  const renderOrganizationDetails = () => {
    if (!selectedOrganization) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedOrganization.name}</h2>
            <p className="text-gray-600">{getOrganizationTypeLabel(selectedOrganization.type)}</p>
          </div>
          <button
            onClick={() => setView('list')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Name</label>
                <p className="text-gray-900">{selectedOrganization.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Portal URL</label>
                <p className="text-blue-600">{selectedOrganization.subdomain}.nutreeai.com</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                <p className="text-gray-900">{selectedOrganization.contactInfo.primaryContact}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{selectedOrganization.contactInfo.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{selectedOrganization.contactInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Service Configuration */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Assignment Model</label>
                <p className="text-gray-900 capitalize">
                  {selectedOrganization.settings.nutritionistAssignmentModel.replace('_', ' ')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Patients/Month</label>
                <p className="text-gray-900">{selectedOrganization.settings.maxPatientsPerMonth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Escalation Threshold</label>
                <p className="text-gray-900">{selectedOrganization.settings.escalationThresholdHours} hours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Features</label>
                <div className="space-y-1">
                  {selectedOrganization.settings.allowBulkUploads && (
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mr-2">
                      Bulk Uploads
                    </span>
                  )}
                  {selectedOrganization.settings.enableCustomReports && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-2">
                      Custom Reports
                    </span>
                  )}
                  {selectedOrganization.settings.autoAssignCases && (
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mr-2">
                      Auto Assignment
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Billing Model</label>
                <p className="text-gray-900 capitalize">{selectedOrganization.billing.model.replace('_', ' ')}</p>
              </div>
              {selectedOrganization.billing.pricePerCase && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Price per Case</label>
                  <p className="text-gray-900">${selectedOrganization.billing.pricePerCase}</p>
                </div>
              )}
              {selectedOrganization.billing.monthlyFee && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Fee</label>
                  <p className="text-gray-900">${selectedOrganization.billing.monthlyFee}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Billing Contact</label>
                <p className="text-gray-900">{selectedOrganization.billing.billingContact}</p>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Cases Processed</label>
                <p className="text-2xl font-bold text-gray-900">{selectedOrganization.totalCasesProcessed}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cases This Month</label>
                <p className="text-xl font-semibold text-blue-600">{selectedOrganization.currentMonthCases}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Capacity Utilization</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(selectedOrganization.currentMonthCases / selectedOrganization.settings.maxPatientsPerMonth) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.round((selectedOrganization.currentMonthCases / selectedOrganization.settings.maxPatientsPerMonth) * 100)}%
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-gray-900">{new Date(selectedOrganization.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Analytics</h2>
          <p className="text-gray-600">{selectedOrganization?.name}</p>
        </div>
        <button
          onClick={() => setView('list')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <p className="text-gray-600">
          Detailed analytics dashboard will be implemented here with charts and metrics.
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {view === 'list' && renderOrganizationList()}
      {view === 'details' && renderOrganizationDetails()}
      {view === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default OrganizationManagement;

import React, { useState } from 'react';
import { AdminProfile, SystemAnalytics, PatientCase, NutritionistProfile } from '../types';

interface AdminDashboardProps {
  admin: AdminProfile;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
}

type AdminView = 'overview' | 'nutritionists' | 'patients' | 'assignments' | 'analytics' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout, onNavigate }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data
  const [systemAnalytics] = useState<SystemAnalytics>({
    totalPatients: 1247,
    totalNutritionists: 23,
    totalCases: 3891,
    casesThisMonth: 342,
    averageReviewTime: 2.4,
    nutritionistUtilization: 78,
    patientSatisfaction: 4.6,
    casesByStatus: {
      submitted: 45,
      assigned: 23,
      under_review: 67,
      reviewed: 89,
      delivered: 234,
      escalated: 3
    },
    casesByPriority: {
      low: 123,
      normal: 234,
      high: 45,
      urgent: 7
    },
    topPerformingNutritionists: [
      { nutritionistId: 'nut_001', name: 'Dr. Priya Sharma', casesCompleted: 156, averageRating: 4.8, averageReviewTime: 1.8, utilizationRate: 92 },
      { nutritionistId: 'nut_002', name: 'Dr. Rajesh Kumar', casesCompleted: 134, averageRating: 4.7, averageReviewTime: 2.1, utilizationRate: 87 }
    ],
    revenueMetrics: {
      monthlyRevenue: 45600,
      revenuePerCase: 25,
      projectedRevenue: 52000,
      paymentsPending: 3400
    }
  });

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊', permission: 'view_analytics' },
    { id: 'organizations', label: 'Organizations', icon: '🏢', permission: 'manage_patients' },
    { id: 'nutritionists', label: 'Nutritionists', icon: '👩‍⚕️', permission: 'manage_nutritionists' },
    { id: 'patients', label: 'Patients', icon: '👥', permission: 'manage_patients' },
    { id: 'assignments', label: 'Assignments', icon: '🔄', permission: 'manage_assignments' },
    { id: 'analytics', label: 'Analytics', icon: '📈', permission: 'view_analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', permission: 'system_settings' }
  ];

  const hasPermission = (permission: string) => {
    return admin.permissions.includes(permission as any);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{systemAnalytics.totalPatients.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Nutritionists</p>
              <p className="text-3xl font-bold text-gray-900">{systemAnalytics.totalNutritionists}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👩‍⚕️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{systemAnalytics.nutritionistUtilization}% utilization</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cases This Month</p>
              <p className="text-3xl font-bold text-gray-900">{systemAnalytics.casesThisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">{systemAnalytics.averageReviewTime}h avg review time</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${systemAnalytics.revenueMetrics?.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>
      </div>

      {/* Case Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Status</h3>
          <div className="space-y-3">
            {Object.entries(systemAnalytics.casesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(systemAnalytics.casesByStatus))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Nutritionists</h3>
          <div className="space-y-4">
            {systemAnalytics.topPerformingNutritionists.map((nutritionist, index) => (
              <div key={nutritionist.nutritionistId} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{nutritionist.name}</p>
                  <p className="text-xs text-gray-500">
                    {nutritionist.casesCompleted} cases • {nutritionist.averageRating}⭐ • {nutritionist.averageReviewTime}h avg
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{nutritionist.utilizationRate}%</p>
                  <p className="text-xs text-gray-500">utilization</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate ? onNavigate('nutritionists') : setCurrentView('nutritionists')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👩‍⚕️</span>
              <div>
                <p className="font-medium text-gray-900">Add Nutritionist</p>
                <p className="text-sm text-gray-500">Onboard new nutrition experts</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate ? onNavigate('assignments') : setCurrentView('assignments')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔄</span>
              <div>
                <p className="font-medium text-gray-900">Manage Assignments</p>
                <p className="text-sm text-gray-500">Review case assignments</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setCurrentView('analytics')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Detailed performance metrics</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'organizations':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">Organization Management</h3><p className="text-gray-600 mt-2">Organization management interface will be implemented here.</p></div>;
      case 'nutritionists':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">Nutritionist Management</h3><p className="text-gray-600 mt-2">Nutritionist management interface will be implemented here.</p></div>;
      case 'patients':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">Patient Management</h3><p className="text-gray-600 mt-2">Patient management interface will be implemented here.</p></div>;
      case 'assignments':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">Assignment Management</h3><p className="text-gray-600 mt-2">Assignment management interface will be implemented here.</p></div>;
      case 'analytics':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">Advanced Analytics</h3><p className="text-gray-600 mt-2">Advanced analytics interface will be implemented here.</p></div>;
      case 'settings':
        return <div className="bg-white rounded-lg p-6 shadow-sm border"><h3 className="text-lg font-semibold">System Settings</h3><p className="text-gray-600 mt-2">System settings interface will be implemented here.</p></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                nutree<span className="text-blue-600">ai</span>
                <span className="text-sm font-normal text-gray-500 ml-2">Admin Dashboard</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                hasPermission(item.permission) && (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as AdminView)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

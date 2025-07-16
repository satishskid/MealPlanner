import React, { useState } from 'react';
import { NutritionistProfile, NutritionistSpecialization } from '../types';

interface NutritionistManagementProps {
  onClose: () => void;
}

const NutritionistManagement: React.FC<NutritionistManagementProps> = ({ onClose }) => {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedNutritionist, setSelectedNutritionist] = useState<NutritionistProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Demo nutritionists data
  const [nutritionists, setNutritionists] = useState<NutritionistProfile[]>([
    {
      id: 'nut_001',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@nutreeai.com',
      credentials: 'RD, PhD',
      specializations: ['clinical', 'diabetes', 'cultural_cuisine'],
      licenseNumber: 'RD-2024-001',
      yearsOfExperience: 12,
      languages: ['English', 'Hindi', 'Punjabi'],
      culturalExpertise: ['North Indian', 'South Indian', 'Punjabi'],
      maxCasesPerDay: 15,
      currentCaseLoad: 12,
      isActive: true,
      isAvailable: true,
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      rating: 4.8,
      totalCasesCompleted: 1456,
      averageReviewTime: 1.8,
      createdAt: '2024-01-15T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
      bio: 'Specialized in clinical nutrition with focus on diabetes management and cultural dietary planning.'
    },
    {
      id: 'nut_002',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@nutreeai.com',
      credentials: 'MS, RD',
      specializations: ['sports', 'weight_management'],
      licenseNumber: 'RD-2024-002',
      yearsOfExperience: 8,
      languages: ['English', 'Hindi'],
      culturalExpertise: ['North Indian', 'Continental'],
      maxCasesPerDay: 12,
      currentCaseLoad: 8,
      isActive: true,
      isAvailable: true,
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '10:00',
        end: '18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      },
      rating: 4.7,
      totalCasesCompleted: 987,
      averageReviewTime: 2.1,
      createdAt: '2024-02-01T00:00:00Z',
      lastActiveAt: new Date().toISOString(),
      bio: 'Expert in sports nutrition and weight management programs.'
    }
  ]);

  const [formData, setFormData] = useState<Partial<NutritionistProfile>>({
    name: '',
    email: '',
    credentials: '',
    specializations: [],
    licenseNumber: '',
    yearsOfExperience: 0,
    languages: [],
    culturalExpertise: [],
    maxCasesPerDay: 10,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    bio: ''
  });

  const specializationOptions: { value: NutritionistSpecialization; label: string }[] = [
    { value: 'clinical', label: 'Clinical Nutrition' },
    { value: 'sports', label: 'Sports Nutrition' },
    { value: 'pediatric', label: 'Pediatric Nutrition' },
    { value: 'geriatric', label: 'Geriatric Nutrition' },
    { value: 'weight_management', label: 'Weight Management' },
    { value: 'diabetes', label: 'Diabetes Management' },
    { value: 'cultural_cuisine', label: 'Cultural Cuisine' },
    { value: 'general', label: 'General Nutrition' }
  ];

  const languageOptions = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'];
  const cuisineOptions = ['North Indian', 'South Indian', 'Punjabi', 'Bengali', 'Gujarati', 'Maharashtrian', 'Continental', 'Mediterranean', 'Vegan', 'Keto'];

  const filteredNutritionists = nutritionists.filter(nutritionist =>
    nutritionist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nutritionist.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateNutritionist = () => {
    const newNutritionist: NutritionistProfile = {
      id: `nut_${Date.now()}`,
      ...formData as NutritionistProfile,
      currentCaseLoad: 0,
      isActive: true,
      isAvailable: true,
      rating: 0,
      totalCasesCompleted: 0,
      averageReviewTime: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    setNutritionists(prev => [...prev, newNutritionist]);
    setView('list');
    setFormData({});
  };

  const handleUpdateNutritionist = () => {
    if (!selectedNutritionist) return;

    setNutritionists(prev => prev.map(nut => 
      nut.id === selectedNutritionist.id 
        ? { ...nut, ...formData }
        : nut
    ));
    setView('list');
    setSelectedNutritionist(null);
    setFormData({});
  };

  const handleEditNutritionist = (nutritionist: NutritionistProfile) => {
    setSelectedNutritionist(nutritionist);
    setFormData(nutritionist);
    setView('edit');
  };

  const toggleNutritionistStatus = (id: string) => {
    setNutritionists(prev => prev.map(nut => 
      nut.id === id ? { ...nut, isActive: !nut.isActive } : nut
    ));
  };

  const renderNutritionistList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nutritionist Management</h2>
          <p className="text-gray-600">Manage your nutrition experts and their profiles</p>
        </div>
        <button
          onClick={() => setView('create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Nutritionist
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search nutritionists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
      </div>

      {/* Nutritionist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNutritionists.map((nutritionist) => (
          <div key={nutritionist.id} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👩‍⚕️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{nutritionist.name}</h3>
                  <p className="text-sm text-gray-600">{nutritionist.credentials}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${nutritionist.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className="text-xs text-gray-500">{nutritionist.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cases Today:</span>
                <span className="font-medium">{nutritionist.currentCaseLoad}/{nutritionist.maxCasesPerDay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">{nutritionist.rating}⭐ ({nutritionist.totalCasesCompleted} cases)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Review Time:</span>
                <span className="font-medium">{nutritionist.averageReviewTime}h</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {nutritionist.specializations.slice(0, 3).map((spec) => (
                  <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {specializationOptions.find(opt => opt.value === spec)?.label}
                  </span>
                ))}
                {nutritionist.specializations.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{nutritionist.specializations.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditNutritionist(nutritionist)}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleNutritionistStatus(nutritionist.id)}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  nutritionist.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {nutritionist.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNutritionists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No nutritionists found matching your search.</p>
        </div>
      )}
    </div>
  );

  const renderNutritionistForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {view === 'create' ? 'Add New Nutritionist' : 'Edit Nutritionist'}
          </h2>
          <button
            onClick={() => {
              setView('list');
              setFormData({});
              setSelectedNutritionist(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dr. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@nutreeai.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
              <input
                type="text"
                value={formData.credentials || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="RD, MS, PhD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                type="text"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="RD-2024-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {specializationOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specializations?.includes(option.value) || false}
                    onChange={(e) => {
                      const current = formData.specializations || [];
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, specializations: [...current, option.value] }));
                      } else {
                        setFormData(prev => ({ ...prev, specializations: current.filter(s => s !== option.value) }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief professional bio..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={view === 'create' ? handleCreateNutritionist : handleUpdateNutritionist}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {view === 'create' ? 'Create Nutritionist' : 'Update Nutritionist'}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('list');
                setFormData({});
                setSelectedNutritionist(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {view === 'list' ? renderNutritionistList() : renderNutritionistForm()}
    </div>
  );
};

export default NutritionistManagement;

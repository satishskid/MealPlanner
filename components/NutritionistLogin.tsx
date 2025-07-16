import React, { useState } from 'react';
import { NutritionistProfile } from '../types';

interface NutritionistLoginProps {
  onLogin: (nutritionist: NutritionistProfile) => void;
  onBackToPatient: () => void;
}

const NutritionistLogin: React.FC<NutritionistLoginProps> = ({ onLogin, onBackToPatient }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    accessCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo nutritionist profiles for testing
  const demoNutritionists: NutritionistProfile[] = [
    {
      id: 'nut_001',
      name: 'Dr. Priya Sharma',
      credentials: 'RD, PhD',
      specialization: 'Clinical Nutrition & Cultural Dietary Planning',
      licenseNumber: 'RD-2024-001',
      yearsOfExperience: 12
    },
    {
      id: 'nut_002',
      name: 'Dr. Rajesh Kumar',
      credentials: 'MS, RD',
      specialization: 'Sports Nutrition & Metabolic Health',
      licenseNumber: 'RD-2024-002',
      yearsOfExperience: 8
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Demo authentication logic
      if (credentials.email === 'nutritionist@nutreeai.com' && 
          credentials.password === 'nutree2024' && 
          credentials.accessCode === 'NUTREE_PRO') {
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Login successful - use first demo nutritionist
        onLogin(demoNutritionists[0]);
      } else if (credentials.email === 'dr.kumar@nutreeai.com' && 
                 credentials.password === 'nutree2024' && 
                 credentials.accessCode === 'NUTREE_PRO') {
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        onLogin(demoNutritionists[1]);
      } else {
        throw new Error('Invalid credentials or access code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            nutree<span className="text-yellow-300">ai</span>
            <span className="text-sm font-normal ml-2 opacity-75">Professional Portal</span>
          </h1>
          <button
            onClick={onBackToPatient}
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Back to Patient Portal
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Nutritionist Login</h2>
            <p className="text-white/80 text-sm">
              Access the professional dashboard to review and validate AI-generated nutrition analyses
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Professional Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                placeholder="your.email@nutreeai.com"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Professional Access Code
              </label>
              <input
                type="text"
                value={credentials.accessCode}
                onChange={(e) => setCredentials(prev => ({ ...prev, accessCode: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                placeholder="Enter access code"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-300 text-blue-600 py-3 rounded-lg font-semibold hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Login to Professional Dashboard'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-white text-sm font-medium mb-2">Demo Credentials:</h3>
            <div className="text-xs text-white/70 space-y-1">
              <p><strong>Email:</strong> nutritionist@nutreeai.com</p>
              <p><strong>Password:</strong> nutree2024</p>
              <p><strong>Access Code:</strong> NUTREE_PRO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionistLogin;

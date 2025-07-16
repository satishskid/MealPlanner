import React, { useState } from 'react';
import { AdminProfile } from '../types';

interface AdminLoginProps {
  onLogin: (admin: AdminProfile) => void;
  onBackToMain: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToMain }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    mfaCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMFA, setShowMFA] = useState(false);

  // Demo admin profiles
  const demoAdmins: AdminProfile[] = [
    {
      id: 'admin_001',
      name: 'Sarah Johnson',
      email: 'admin@nutreeai.com',
      role: 'super_admin',
      permissions: ['manage_nutritionists', 'manage_patients', 'view_analytics', 'manage_assignments', 'system_settings', 'bulk_operations', 'financial_reports', 'audit_logs'],
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'admin_002',
      name: 'Michael Chen',
      email: 'manager@nutreeai.com',
      role: 'manager',
      permissions: ['manage_assignments', 'view_analytics', 'manage_nutritionists'],
      createdAt: '2024-01-15T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      isActive: true
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Demo authentication logic
      if (credentials.email === 'admin@nutreeai.com' && credentials.password === 'admin2024') {
        if (!showMFA) {
          setShowMFA(true);
          setIsLoading(false);
          return;
        }
        
        if (credentials.mfaCode === '123456') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          onLogin(demoAdmins[0]);
        } else {
          throw new Error('Invalid MFA code');
        }
      } else if (credentials.email === 'manager@nutreeai.com' && credentials.password === 'manager2024') {
        if (!showMFA) {
          setShowMFA(true);
          setIsLoading(false);
          return;
        }
        
        if (credentials.mfaCode === '123456') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          onLogin(demoAdmins[1]);
        } else {
          throw new Error('Invalid MFA code');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setShowMFA(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            nutree<span className="text-yellow-300">ai</span>
            <span className="text-sm font-normal ml-2 opacity-75">Admin Portal</span>
          </h1>
          <button
            onClick={onBackToMain}
            className="text-white/80 hover:text-white transition-colors text-sm"
          >
            ← Back to Main Portal
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {showMFA ? 'Two-Factor Authentication' : 'Admin Login'}
            </h2>
            <p className="text-white/80 text-sm">
              {showMFA 
                ? 'Enter the 6-digit code from your authenticator app'
                : 'Access the administrative dashboard to manage the nutreeai platform'
              }
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {!showMFA ? (
              <>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="admin@nutreeai.com"
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
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Authentication Code
                </label>
                <input
                  type="text"
                  value={credentials.mfaCode}
                  onChange={(e) => setCredentials(prev => ({ ...prev, mfaCode: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : showMFA ? 'Verify & Login' : 'Continue to MFA'}
            </button>

            {showMFA && (
              <button
                type="button"
                onClick={() => {
                  setShowMFA(false);
                  setCredentials(prev => ({ ...prev, mfaCode: '' }));
                }}
                className="w-full bg-white/20 text-white py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                ← Back to Login
              </button>
            )}
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <h3 className="text-white text-sm font-medium mb-2">Demo Credentials:</h3>
            <div className="text-xs text-white/70 space-y-2">
              <div>
                <p><strong>Super Admin:</strong></p>
                <p>Email: admin@nutreeai.com</p>
                <p>Password: admin2024</p>
                <p>MFA Code: 123456</p>
              </div>
              <div>
                <p><strong>Manager:</strong></p>
                <p>Email: manager@nutreeai.com</p>
                <p>Password: manager2024</p>
                <p>MFA Code: 123456</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/60">
              🔒 This is a secure admin portal. All actions are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { ProviderProfile } from '../types-b2b';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface ProviderRegistrationProps {
  onSuccess: (profile: ProviderProfile) => void;
  onError: (msg: string) => void;
}

const ProviderRegistration: React.FC<ProviderRegistrationProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      // Create provider profile in Firestore
      const providerProfile: ProviderProfile = {
        id: user.uid,
        email,
        firstName,
        lastName,
        providerType: 'doctor', // Default, can add selection later
        organizationName,
        organizationAddress: '',
        phone: '',
        subscription: {
          plan: 'starter',
          status: 'active',
          startDate: new Date().toISOString(),
          nextBillingDate: '',
          monthlyLimit: 100,
          usedThisMonth: 0,
          features: ['basic']
        },
        settings: {
          defaultReportTemplate: '',
          autoShareReports: false,
          allowBatchProcessing: false,
          emailNotifications: true,
          brandingEnabled: false
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isVerified: false,
        isActive: true
      };
      await setDoc(doc(db, 'providers', user.uid), providerProfile);
      onSuccess(providerProfile);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      onError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Provider Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input type="text" placeholder="Organization Name" value={organizationName} onChange={e => setOrganizationName(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-md shadow-sm">
              <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border-none rounded-md shadow-sm focus:ring focus:ring-opacity-50" />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="p-2">
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded-md shadow-md hover:bg-green-700 transition duration-200 ease-in-out">
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          {error && <div className="text-red-600 mt-2 text-sm text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistration;

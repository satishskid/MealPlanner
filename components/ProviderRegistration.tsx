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
    <div style={{ padding: 32, maxWidth: 400, margin: '0 auto' }}>
      <h2>Provider Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="text" placeholder="Organization Name" value={organizationName} onChange={e => setOrganizationName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded mt-2">{isLoading ? 'Registering...' : 'Register'}</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProviderRegistration;

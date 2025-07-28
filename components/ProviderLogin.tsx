import React, { useState } from 'react';
import { ProviderProfile } from '../types-b2b';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface ProviderLoginProps {
  onSuccess: (profile: ProviderProfile | { admin: true; email: string }) => void;
  onError: (msg: string) => void;
}

const ADMIN_EMAIL = 'admin@nutreeai.com';

const ProviderLogin: React.FC<ProviderLoginProps> = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (email === ADMIN_EMAIL) {
        onSuccess({ admin: true, email });
        return;
      }
      // Fetch provider profile from Firestore
      const docRef = doc(db, 'providers', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profile = docSnap.data() as ProviderProfile;
        onSuccess(profile);
      } else {
        throw new Error('Provider profile not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      onError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 400, margin: '0 auto' }}>
      <h2>Provider Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded" />
        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded mt-2">{isLoading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProviderLogin;

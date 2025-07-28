import React, { useState, useEffect } from 'react';
import B2BLandingPage from './components/B2BLandingPage';
import ErrorDisplay from './components/ErrorDisplay';
import { ToastProvider } from './components/ToastContainer';
import Header from './components/Header';
import Footer from './components/Footer';
import ProviderRegistration from './components/ProviderRegistration';
import ProviderLogin from './components/ProviderLogin';
import ProviderDashboard from './components/ProviderDashboard';
import AdminDashboard from './components/AdminDashboard';
import { UserRole, ProviderProfile } from './types-b2b';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showProviderRegistration, setShowProviderRegistration] = useState(false);
  const [showProviderLogin, setShowProviderLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch provider profile from Firestore
        const docRef = doc(db, 'providers', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProvider(docSnap.data() as ProviderProfile);
          setUserRole('provider');
        }
      } else {
        setProvider(null);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Navigation handlers
  const handleProviderSignUp = () => {
    setShowProviderRegistration(true);
    setShowProviderLogin(false);
    setShowAdminDashboard(false);
  };
  const handleProviderLogin = () => {
    setShowProviderLogin(true);
    setShowProviderRegistration(false);
    setShowAdminDashboard(false);
    setAdminEmail(null);
  };
  const handleAdminLogin = () => {
    setShowProviderLogin(true);
    setShowProviderRegistration(false);
    setShowAdminDashboard(false);
    setAdminEmail(null);
  };
  const handleLogout = async () => {
    await signOut(auth);
    setProvider(null);
    setUserRole(null);
    setShowProviderLogin(false);
    setShowProviderRegistration(false);
    setShowAdminDashboard(false);
  };

  return (
    <ToastProvider>
      <div className="app-root">
        <Header clinicName={provider?.organizationName} onToggleSettings={() => {}} userEmail={provider?.email} onLogout={handleLogout} />
        {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
        {!userRole && !showProviderLogin && !showProviderRegistration && !showAdminDashboard && (
          <B2BLandingPage 
            onProviderSignUp={handleProviderSignUp}
            onProviderLogin={handleProviderLogin}
            onAdminLogin={handleAdminLogin}
            onLearnMore={() => {}}
          />
        )}
        {showProviderRegistration && <ProviderRegistration onSuccess={(profile: ProviderProfile) => { setProvider(profile); setUserRole('provider' as UserRole); setShowProviderRegistration(false); }} onError={setError} />}
        {showProviderLogin && <ProviderLogin onSuccess={(profile) => {
          if ('admin' in profile && profile.admin) {
            setAdminEmail(profile.email);
            setShowAdminDashboard(true);
            setShowProviderLogin(false);
            setProvider(null);
            setUserRole('admin');
          } else {
            setProvider(profile as ProviderProfile);
            setUserRole('provider');
            setShowProviderLogin(false);
          }
        }} onError={setError} />}
        {userRole === 'provider' && provider && <ProviderDashboard provider={provider} onLogout={handleLogout} />}
        {showAdminDashboard && adminEmail && <AdminDashboard adminEmail={adminEmail} onLogout={handleLogout} />}
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;

import React from 'react';
import { ProviderProfile } from '../types-b2b';
import PatientManagement from './PatientManagement';

interface ProviderDashboardProps {
  provider: ProviderProfile;
  onLogout: () => void;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ provider, onLogout }) => {
  return (
    <div style={{ padding: 32 }}>
      <h2>Welcome, {provider.firstName} {provider.lastName}!</h2>
      <p>Provider Dashboard</p>
      <button onClick={onLogout}>Logout</button>
      <PatientManagement />
    </div>
  );
};

export default ProviderDashboard;

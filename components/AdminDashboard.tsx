import React, { useState } from 'react';

interface AdminDashboardProps {
  adminEmail: string;
  onLogout: () => void;
}

const mockAnalytics = {
  totalProviders: 42,
  activeProviders: 37,
  newProvidersThisMonth: 5,
  totalAnalyses: 1200,
  analysesThisMonth: 110,
  averageAnalysesPerProvider: 28,
  monthlyRevenue: 3200,
  yearlyRevenue: 38400,
  revenueGrowth: 12.5,
  systemUptime: 99.98,
  averageResponseTime: 0.8,
  errorRate: 0.2,
  issues: [
    { id: 1, title: 'Payment gateway delay', status: 'open', severity: 'high', reported: '2025-07-25' },
    { id: 2, title: 'API key expired for provider X', status: 'resolved', severity: 'medium', reported: '2025-07-20' }
  ],
  alerts: [
    { id: 1, message: 'API usage nearing monthly limit for 3 providers', type: 'warning', date: '2025-07-27' },
    { id: 2, message: 'System update scheduled for 2025-08-01', type: 'info', date: '2025-07-26' }
  ],
  apiKeys: [
    { provider: 'Provider A', status: 'healthy', lastChecked: '2025-07-28' },
    { provider: 'Provider B', status: 'expired', lastChecked: '2025-07-27' }
  ],
  pricing: [
    { plan: 'Starter', price: '$49/mo', features: ['Up to 100 analyses', 'Basic support'] },
    { plan: 'Professional', price: '$149/mo', features: ['Up to 1000 analyses', 'Priority support', 'Batch processing'] },
    { plan: 'Enterprise', price: 'Contact us', features: ['Unlimited analyses', 'Dedicated manager', 'Custom integrations'] }
  ]
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminEmail, onLogout }) => {
  const [tab, setTab] = useState<'analytics'|'pricing'|'issues'|'alerts'|'apikeys'>('analytics');

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div>
          <span className="text-gray-600 mr-4">{adminEmail}</span>
          <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>
      <nav className="flex gap-4 mb-8">
        <button className={tab==='analytics'?"font-bold text-blue-700 underline":"text-gray-700"} onClick={()=>setTab('analytics')}>User Analytics</button>
        <button className={tab==='pricing'?"font-bold text-blue-700 underline":"text-gray-700"} onClick={()=>setTab('pricing')}>Pricing</button>
        <button className={tab==='issues'?"font-bold text-blue-700 underline":"text-gray-700"} onClick={()=>setTab('issues')}>Issues</button>
        <button className={tab==='alerts'?"font-bold text-blue-700 underline":"text-gray-700"} onClick={()=>setTab('alerts')}>Alerts</button>
        <button className={tab==='apikeys'?"font-bold text-blue-700 underline":"text-gray-700"} onClick={()=>setTab('apikeys')}>API Key Health</button>
      </nav>
      {tab === 'analytics' && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Providers</h3>
            <p>Total: <b>{mockAnalytics.totalProviders}</b></p>
            <p>Active: <b>{mockAnalytics.activeProviders}</b></p>
            <p>New this month: <b>{mockAnalytics.newProvidersThisMonth}</b></p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Usage</h3>
            <p>Total Analyses: <b>{mockAnalytics.totalAnalyses}</b></p>
            <p>This Month: <b>{mockAnalytics.analysesThisMonth}</b></p>
            <p>Avg/Provider: <b>{mockAnalytics.averageAnalysesPerProvider}</b></p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">Revenue</h3>
            <p>Monthly: <b>{mockAnalytics.monthlyRevenue}</b></p>
            <p>Yearly: <b>{mockAnalytics.yearlyRevenue}</b></p>
            <p>Growth: <b>{mockAnalytics.revenueGrowth}%</b></p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-2">System Health</h3>
            <p>Uptime: <b>{mockAnalytics.systemUptime}%</b></p>
            <p>Avg Response: <b>{mockAnalytics.averageResponseTime}s</b></p>
            <p>Error Rate: <b>{mockAnalytics.errorRate}%</b></p>
          </div>
        </div>
      )}
      {tab === 'pricing' && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Pricing Plans</h3>
          <div className="grid grid-cols-3 gap-6">
            {mockAnalytics.pricing.map((plan, i) => (
              <div key={i} className="bg-white rounded shadow p-6 flex flex-col items-center">
                <h4 className="text-xl font-bold mb-2">{plan.plan}</h4>
                <div className="text-2xl text-green-700 mb-2">{plan.price}</div>
                <ul className="mb-4 text-gray-700 text-sm">
                  {plan.features.map((f, j) => <li key={j}>• {f}</li>)}
                </ul>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Select</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'issues' && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Open Issues</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>ID</th><th>Title</th><th>Status</th><th>Severity</th><th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.issues.map(issue => (
                <tr key={issue.id} className="border-b hover:bg-gray-50">
                  <td>{issue.id}</td>
                  <td>{issue.title}</td>
                  <td>{issue.status}</td>
                  <td>{issue.severity}</td>
                  <td>{issue.reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'alerts' && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">System Alerts</h3>
          <ul>
            {mockAnalytics.alerts.map(alert => (
              <li key={alert.id} className={`mb-2 p-3 rounded ${alert.type==='warning'?'bg-yellow-100 text-yellow-800':alert.type==='info'?'bg-blue-100 text-blue-800':'bg-gray-100'}`}>
                <b>{alert.message}</b> <span className="text-xs ml-2">({alert.date})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'apikeys' && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">API Key Health</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Provider</th><th>Status</th><th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.apiKeys.map(key => (
                <tr key={key.provider} className="border-b hover:bg-gray-50">
                  <td>{key.provider}</td>
                  <td className={key.status==='healthy'?'text-green-700':key.status==='expired'?'text-red-700':'text-gray-700'}>{key.status}</td>
                  <td>{key.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

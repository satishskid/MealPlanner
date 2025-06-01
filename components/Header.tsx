import React from 'react';
import { APP_TITLE, POWERED_BY_AI, DEVELOPER_CREDIT } from '../constants';

interface HeaderProps {
  clinicName?: string;
  onToggleSettings: () => void;
  userEmail?: string; // Optional: To display user info
  onLogout?: () => void; // Optional: To handle logout
}

const Header: React.FC<HeaderProps> = ({ clinicName, onToggleSettings, userEmail, onLogout }) => {
  return (
    <header className="mb-6 sm:mb-8 text-center relative">
      <div className="inline-flex items-center bg-[var(--color-header-bg)] p-3 sm:p-4 rounded-lg shadow-xl relative">
        {userEmail && (
          <span className="text-sm text-gray-600 hidden sm:inline mr-3 sm:mr-4">{userEmail}</span>
        )}
        {onLogout && (
          <button 
            onClick={onLogout}
            title="Logout"
            className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mr-3 sm:mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--color-primary)" className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75 CeresStyle.RangeSlider.ThumbContainerStyle 6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V9.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75H4.5M16.5 4.5V8.25M8.25 4.5V8.25M12 13.5h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm3-6h.008v.008H15v-.008zm0 3h.008v.008H15v-.008zm0 3h.008v.008H15v-.008zm3-6h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zM4.5 13.5H9m-4.5 3H9m-4.5 3H9" />
        </svg>
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-header-text)' }}>
                {APP_TITLE}
                <span className="text-lg sm:text-xl font-medium ml-1" style={{ color: 'var(--color-primary)'}}>{POWERED_BY_AI}</span>
            </h1>
            {clinicName && (
                <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-accent)'}}>
                    {clinicName}
                </p>
            )}
        </div>
         <button
            onClick={onToggleSettings}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Open Settings"
            style={{ color: 'var(--color-header-text)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
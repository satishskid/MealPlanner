import React from 'react';

interface HeaderProps {
  clinicName?: string;
  onToggleSettings: () => void;
  userEmail?: string; // Optional: To display user info
  onLogout?: () => void; // Optional: To handle logout
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between bg-[var(--color-header-bg)] p-4 shadow-md">
      {/* Left: Empty space for balance */}
      <div className="flex-1"></div>

      {/* Center: Title */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center relative" style={{ color: 'var(--color-header-text)', letterSpacing: '0.05em', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' }}>
          <span className="relative inline-block lowercase">
            nutree
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)]"></span>
          </span>
          <span style={{ color: 'var(--color-accent)' }} className="lowercase">ai</span>
          <div className="text-xs text-gray-500 mt-1 font-normal tracking-normal">made by greybrain.ai</div>
        </h1>
      </div>

      {/* Right: User Dropdown */}
      <div className="flex-1 flex justify-end">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Toggle User Menu"
          >
            <span className="text-sm text-[var(--color-text-secondary)] truncate max-w-xs" title={userEmail || 'User'}>
              {userEmail || 'User'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 9l-7.5 7.5L4.5 9" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <button
                onClick={() => {
                  closeDropdown();
                  onLogout && onLogout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
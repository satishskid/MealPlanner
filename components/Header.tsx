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
      {/* Left: Logos */}
      <div className="flex items-center gap-4">
        <img src="/public/images/santaan.png" alt="Santaan Logo" className="h-10 w-auto object-contain" />
        <img src="/public/images/skids.png" alt="Skids Logo" className="h-12 w-auto object-contain" />
      </div>

      {/* Center: Title */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center uppercase relative" style={{ color: 'var(--color-header-text)', letterSpacing: '0.1em', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>
        <span className="relative inline-block">
          Nutrition
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)]"></span>
        </span>
        .<span style={{ color: 'var(--color-accent)' }}>AI</span>
      </h1>

      {/* Right: User Dropdown */}
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
    </header>
  );
};

export default Header;
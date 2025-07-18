
import React from 'react';
import { FOOTER_TEXT } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 sm:mt-12 text-center">
      {/* Happy Customers Section */}
      <div className="mb-6">
        <h3 className="text-sm text-white opacity-75 mb-3 font-medium">Trusted by our partners</h3>
        <div className="flex items-center justify-center gap-6 opacity-70 hover:opacity-90 transition-opacity bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <img src="/images/santaan.png" alt="Santaan - Trusted Partner" className="h-8 w-auto object-contain" />
          <img src="/images/skids.png" alt="Skids - Trusted Partner" className="h-10 w-auto object-contain" />
        </div>
      </div>

      {/* Copyright */}
      <p className="text-xs text-white opacity-70">
        {FOOTER_TEXT}
      </p>
    </footer>
  );
};

export default Footer;
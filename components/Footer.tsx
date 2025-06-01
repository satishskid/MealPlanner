
import React from 'react';
import { FOOTER_TEXT, DEVELOPER_CREDIT } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 sm:mt-12 text-center">
      <p className="text-sm text-white opacity-90">
        {FOOTER_TEXT}
        <span className="developer-credit">{DEVELOPER_CREDIT}</span>
      </p>
    </footer>
  );
};

export default Footer;
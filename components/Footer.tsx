
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 sm:mt-12">
      {/* Main Footer Content */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-4">
        {/* Partners Section */}
        <div className="mb-6">
          <h3 className="text-sm text-white opacity-90 mb-3 font-medium text-center">Trusted by our partners</h3>
          <div className="flex items-center justify-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
            <img 
              src="/images/santaan.png" 
              alt="Santaan - Trusted Partner" 
              className="h-8 w-auto object-contain filter brightness-0 invert"
            />
            <div className="w-px h-8 bg-white/30"></div>
            <img 
              src="/images/skids.png" 
              alt="Skids - Trusted Partner" 
              className="h-10 w-auto object-contain filter brightness-0 invert"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white/80 text-sm mb-6">
          <div>
            <h4 className="font-semibold mb-2 text-yellow-300">Product</h4>
            <ul className="space-y-1">
              <li><a href="#features" className="hover:text-yellow-300 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-yellow-300 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-yellow-300">Support</h4>
            <ul className="space-y-1">
              <li><a href="#help" className="hover:text-yellow-300 transition-colors">Help Center</a></li>
              <li><a href="#contact" className="hover:text-yellow-300 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-yellow-300">Legal</h4>
            <ul className="space-y-1">
              <li><a href="#privacy" className="hover:text-yellow-300 transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-yellow-300 transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-yellow-300">Connect</h4>
            <div className="flex justify-center space-x-2">
              <a href="#" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Credits */}
      <div className="text-center">
        <p className="text-xs text-white opacity-70 mb-2">
          © 2025 nutreeai. Made with ❤️ by greybrain.ai
        </p>
        <p className="text-xs text-white opacity-60">
          Empowering healthier choices through science and cultural understanding
        </p>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';

interface B2BLandingPageProps {
  onProviderSignUp: () => void;
  onProviderLogin: () => void;
  onAdminLogin: () => void;
  onLearnMore: () => void;
}

const B2BLandingPage: React.FC<B2BLandingPageProps> = ({ 
  onProviderSignUp, 
  onProviderLogin, 
  onAdminLogin,
  onLearnMore 
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            Empower Your Practice with
            <br />
            <span className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              AI Nutrition Intelligence
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white opacity-90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform patient care with scientific nutrition analysis. Generate comprehensive reports, 
            manage patient data efficiently, and provide evidence-based dietary recommendations.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onProviderSignUp}
            className="group bg-white text-green-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              Start Free Trial
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <button
            onClick={onProviderLogin}
            className="border-2 border-white text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300 shadow-lg"
          >
            Provider Login
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            HIPAA Compliant
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Evidence-Based
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            AI-Powered
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Scalable Platform
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-white hover:bg-white/20 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Professional Reports</h3>
          <p className="text-white/90 leading-relaxed">
            Generate comprehensive, branded nutrition reports with AI analysis, recommendations, 
            and shareable patient links. Customize templates to match your practice.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-white hover:bg-white/20 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Patient Management</h3>
          <p className="text-white/90 leading-relaxed">
            Efficiently manage patient data, track progress, and maintain comprehensive nutrition 
            profiles. Batch process multiple patients for time efficiency.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 text-white hover:bg-white/20 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-4">Practice Analytics</h3>
          <p className="text-white/90 leading-relaxed">
            Track usage patterns, patient outcomes, and practice growth with detailed analytics. 
            Optimize your nutrition counseling workflow with data-driven insights.
          </p>
        </div>
      </div>

      {/* Pricing Preview (Subtle CTA only, no pricing or plans) */}
      <section className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-16 mt-20 shadow-lg">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{color:'#1a1a1a'}}>Interested in NutreeAI?</h2>
          <p className="text-gray-700 text-base md:text-lg opacity-80">Please <a href="#contact" className="text-green-700 underline hover:text-green-900">contact us</a> for pricing and plans tailored to your needs.</p>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Practice?</h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare providers using NutreeAI to deliver better patient outcomes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onProviderSignUp}
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
          >
            Start Your Free Trial Today
          </button>
          <button
            onClick={onLearnMore}
            className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
          >
            Schedule a Demo
          </button>
        </div>

        {/* Admin Access */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <button
            onClick={onAdminLogin}
            className="text-white/70 hover:text-white text-sm underline"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default B2BLandingPage;

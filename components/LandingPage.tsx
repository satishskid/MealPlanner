import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onNutritionistLogin?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onNutritionistLogin }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          Nutrition is Essential.<br />
          <span className="text-yellow-300">Science is the Answer.</span>
        </h1>
        <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Move beyond diet fads and food myths. Discover what you're really eating with 
          evidence-based nutritional science tailored to your cultural preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Your Nutrition Journey
          </button>
          {onNutritionistLogin && (
            <button
              onClick={onNutritionistLogin}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg border-2 border-white/20"
            >
              Professional Login
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">Beyond the Hype</h2>
          <p className="mb-4 leading-relaxed">
            Nutrition is the most talked about, most hyped, yet most misunderstood aspect of health. 
            We've moved away from science into a world of quick fixes and extreme restrictions.
          </p>
          <p className="leading-relaxed">
            <strong>nutreeai</strong> brings you back to the fundamentals: understanding exactly what 
            you're eating through detailed scientific analysis, not just "lower carb" or "increase protein."
          </p>
        </div>

        {/* Right Column */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-4 text-yellow-300">Cultural Intelligence</h2>
          <p className="mb-4 leading-relaxed">
            Your cultural food choices matter. What works for one cuisine doesn't work for another. 
            Our AI understands your cultural preferences and suggests meal plans that respect your traditions.
          </p>
          <p className="leading-relaxed">
            No diet is perfect, and no diet should feel like punishment. You should know what you're 
            taking and play with variety within scientific boundaries toward optimum health.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 mb-12 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">Our Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Science-Based</h3>
            <p className="text-sm opacity-90">Every recommendation backed by nutritional science, not trends</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Culturally Aware</h3>
            <p className="text-sm opacity-90">Respects your food traditions and cultural preferences</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Personalized</h3>
            <p className="text-sm opacity-90">Tailored to your age, lifestyle, and health goals</p>
          </div>
        </div>
      </div>

      {/* Key Message */}
      <div className="text-center bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Nutrition is Part of Life</h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          It's not a fix, it's living itself. Understanding your food choices empowers you to make 
          informed decisions that support your health, respect your culture, and bring joy to your meals.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;


import React from 'react';
import { MealPlan, AdherenceLog, MealItem, DailyAdherence } from '../types';

interface ActiveMealPlanViewProps {
  plan: MealPlan;
  adherenceLog: AdherenceLog;
  onUpdateAdherence: (date: string, meal: keyof DailyAdherence, completed: boolean) => void;
  onStopTracking: () => void;
}

const ActiveMealPlanView: React.FC<ActiveMealPlanViewProps> = ({ plan, adherenceLog, onUpdateAdherence, onStopTracking }) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const todayAdherence = adherenceLog[today] || {};

  const handleMealCheck = (mealTime: keyof DailyAdherence) => {
    onUpdateAdherence(today, mealTime, !todayAdherence[mealTime]);
  };

  const renderMealItems = (items: MealItem[], mealType: string) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-gray-500 italic">No specific items listed for {mealType}.</p>;
    }
    return items.map((item, idx) => (
      <div key={idx} className="ml-4 text-sm text-gray-700">
        <span className="font-semibold">{item.name}</span>
        {item.portionSuggestion && <span className="text-xs text-gray-500"> ({item.portionSuggestion})</span>}
        {item.alternatives && item.alternatives.length > 0 && (
          <p className="text-xs text-gray-500 italic ml-2">- Or: {item.alternatives.join(' / ')}</p>
        )}
      </div>
    ));
  };

  const mealTimes: (keyof DailyAdherence)[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  return (
    <div className="p-6 bg-emerald-50 rounded-lg shadow-xl mt-8 border border-emerald-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-emerald-700">Tracking: {plan.planName}</h2>
        <button 
            onClick={onStopTracking}
            className="text-sm text-red-500 hover:text-red-700 hover:underline p-2 rounded hover:bg-red-100"
            aria-label="Stop tracking this plan"
        >
            Stop Tracking
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2 italic">{plan.description}</p>
      
      <p className="text-xs text-gray-500 mb-4">
        This adherence tracking is for your personal reference and is stored locally in your browser.
        It is not shared with any nutritionist through this application.
      </p>

      <h3 className="text-lg font-semibold text-emerald-600 mb-3">Today's Meals ({today})</h3>
      <div className="space-y-4">
        {mealTimes.map((mealTime) => {
          const mealItems = plan.dailyMeals[mealTime as keyof typeof plan.dailyMeals];
          if (!mealItems || mealItems.length === 0 && mealTime === 'snacks') return null; // Hide empty snacks section

          return (
            <div key={mealTime} className="p-4 bg-white rounded-md shadow border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-800 capitalize">{mealTime}</h4>
                <button
                  onClick={() => handleMealCheck(mealTime)}
                  title={todayAdherence[mealTime] ? `Mark ${mealTime} as not completed` : `Mark ${mealTime} as completed`}
                  className={`p-2 rounded-full transition-colors duration-150 ${
                    todayAdherence[mealTime] ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {todayAdherence[mealTime] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M20 10a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {renderMealItems(mealItems, mealTime)}
            </div>
          );
        })}
      </div>

      {plan.weeklyVarietyNotes && (
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-md font-semibold text-blue-700 mb-1">Tips for Weekly Variety:</h4>
          <p className="text-sm text-blue-600 whitespace-pre-line">{plan.weeklyVarietyNotes}</p>
        </div>
      )}
       <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-md font-semibold text-yellow-700 mb-1">Plan Benefits:</h4>
          <p className="text-sm text-yellow-600 whitespace-pre-line">{plan.benefits}</p>
        </div>
        <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded-md">
          <h4 className="text-md font-semibold text-gray-700 mb-1">Nuances & Considerations:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">{plan.nuances}</p>
        </div>
    </div>
  );
};

export default ActiveMealPlanView;

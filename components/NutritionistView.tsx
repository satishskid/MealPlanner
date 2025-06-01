
import React from 'react';
import { NutritionistViewData, MealPlan, MealItem, DoctorProfile } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { exportMealPlanToICS } from '../utils/calendarExport';


interface NutritionistViewProps {
  data: NutritionistViewData;
  onSuggestPlans: (condition: string) => Promise<void>;
  suggestedPlans: MealPlan[] | null;
  isLoading: boolean;
  patientCondition: string;
  setPatientCondition: (condition: string) => void;
  onSelectPlan: (plan: MealPlan) => void;
  onClose: () => void;
  doctorProfile: DoctorProfile;
}

const NutritionistView: React.FC<NutritionistViewProps> = ({ 
    data, 
    onSuggestPlans, 
    suggestedPlans, 
    isLoading,
    patientCondition,
    setPatientCondition,
    onSelectPlan,
    onClose,
    doctorProfile 
}) => {

  const handleSubmitCondition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientCondition.trim()) {
        alert("Please enter a patient condition or type 'None'.");
        return;
    }
    onSuggestPlans(patientCondition.trim());
  };

  const renderMealItems = (items: MealItem[], mealType: string) => {
    if (!items || items.length === 0) {
      return <p className="text-xs text-gray-500">No specific items listed for {mealType}.</p>;
    }
    return items.map((item, idx) => (
      <li key={idx} className="text-xs text-gray-600">
        <strong>{item.name}</strong>
        {item.portionSuggestion && ` (${item.portionSuggestion})`}
        {item.alternatives && item.alternatives.length > 0 && (
          <span className="text-xxs text-gray-500 italic"> (Alternatives: {item.alternatives.join(', ')})</span>
        )}
      </li>
    ));
  };


  return (
    <div className="mt-8 p-6 bg-indigo-50 rounded-lg shadow-xl border border-indigo-200 relative">
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-indigo-100"
        aria-label="Close Nutritionist View"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-indigo-600 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zM12 12.75a.75.75 0 000-1.5H6.75a.75.75 0 000 1.5h5.25zM12 15.75a.75.75 0 000-1.5H6.75a.75.75 0 000 1.5h5.25zM12 9.75a.75.75 0 000-1.5H6.75a.75.75 0 000 1.5h5.25z" />
        </svg>
        <h2 className="text-2xl font-semibold text-indigo-800">Nutritionist's Dashboard</h2>
      </div>
      
      {/* TODO: Optionally display doctorProfile information here if needed in the UI */}
      {/* For example: 
        {doctorProfile && doctorProfile.name && (
          <p className="text-sm text-indigo-700 mb-4">Consulting Doctor: Dr. {doctorProfile.name}, {doctorProfile.specialization}</p>
        )}
      */}

      <div className="mb-6 p-4 bg-white rounded-md shadow border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Patient's Daily Summary</h3>
        <p className="text-sm text-gray-600"><strong>Age Group:</strong> {data.userProfile.ageGroup}</p>
        <p className="text-sm text-gray-600"><strong>Cuisine:</strong> {data.userProfile.cuisinePreference}</p>
        <p className="text-sm text-gray-600 mt-1"><strong>Total Calories:</strong> {data.dailyMealAnalysis.totalEstimatedCalories}</p>
        <p className="text-sm text-gray-600 mt-1"><strong>Quality Assessment:</strong> {data.dailyMealAnalysis.qualityAssessment}</p>
        {data.dailyMealAnalysis.generalRecommendations && 
            <p className="text-sm text-gray-600 mt-1"><strong>Recommendations:</strong> {data.dailyMealAnalysis.generalRecommendations}</p>
        }
      </div>

      <form onSubmit={handleSubmitCondition} className="mb-6">
        <div>
          <label htmlFor="patientCondition" className="block text-sm font-medium text-indigo-700 mb-1">
            Enter Patient's Condition/Disease (e.g., Diabetes, Hypertension, Weight Management):
          </label>
          <input
            id="patientCondition"
            type="text"
            value={patientCondition}
            onChange={(e) => setPatientCondition(e.target.value)}
            placeholder="Type condition(s) or 'None'"
            className="w-full p-3 border border-indigo-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            disabled={isLoading && !suggestedPlans}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading && !suggestedPlans || !patientCondition.trim()}
          className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        >
          {isLoading && !suggestedPlans ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Plans...
            </>
          ) : (
            <>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Suggest Meal Plans
            </>
          )}
        </button>
      </form>

      {isLoading && !suggestedPlans && <LoadingSpinner />}

      {suggestedPlans && suggestedPlans.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-indigo-700 mb-3">Suggested Meal Plans:</h3>
          <div className="space-y-6">
            {suggestedPlans.map((plan, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                <h4 className="text-lg font-semibold text-green-700 mb-1">{plan.planName}</h4>
                <p className="text-sm text-gray-600 mb-2 italic">{plan.description}</p>
                
                <div className="mb-2">
                    <strong className="text-sm text-gray-700 block mb-1">Daily Meals:</strong>
                    <div className="ml-2 space-y-1">
                        <div><strong className="text-xs text-gray-600">Breakfast:</strong> <ul className="list-disc list-inside ml-4">{renderMealItems(plan.dailyMeals.breakfast, 'Breakfast')}</ul></div>
                        <div><strong className="text-xs text-gray-600">Lunch:</strong> <ul className="list-disc list-inside ml-4">{renderMealItems(plan.dailyMeals.lunch, 'Lunch')}</ul></div>
                        <div><strong className="text-xs text-gray-600">Dinner:</strong> <ul className="list-disc list-inside ml-4">{renderMealItems(plan.dailyMeals.dinner, 'Dinner')}</ul></div>
                        <div><strong className="text-xs text-gray-600">Snacks:</strong> <ul className="list-disc list-inside ml-4">{renderMealItems(plan.dailyMeals.snacks, 'Snacks')}</ul></div>
                    </div>
                </div>
                 {plan.weeklyVarietyNotes && (
                    <div className="mb-2">
                        <strong className="text-sm text-gray-700">Weekly Variety Tips:</strong>
                        <p className="text-xs text-gray-600 whitespace-pre-line">{plan.weeklyVarietyNotes}</p>
                    </div>
                 )}
                <div className="mb-2">
                    <strong className="text-sm text-gray-700">Benefits:</strong>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{plan.benefits}</p>
                </div>
                <div>
                    <strong className="text-sm text-gray-700">Nuances/Tips:</strong>
                    <p className="text-xs text-gray-600 whitespace-pre-line">{plan.nuances}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                        onClick={() => exportMealPlanToICS(plan)}
                        className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Export to Calendar
                    </button>
                    <button
                        onClick={() => onSelectPlan(plan)}
                        className="flex-1 px-3 py-2 text-xs bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.324h5.388a.562.562 0 01.328.958l-4.408 3.162a.563.563 0 00-.182.557l1.658 5.223a.563.563 0 01-.812.622l-4.408-3.162a.563.563 0 00-.656 0l-4.408 3.162a.563.563 0 01-.812-.622l1.658-5.223a.563.563 0 00-.182-.557l-4.408-3.162a.562.562 0 01.328-.958h5.388a.563.563 0 00.475-.324L11.48 3.5z" />
                        </svg>
                        Select This Plan for Tracking
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
       {suggestedPlans && suggestedPlans.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-4">No meal plans could be generated based on the provided information, or the model did not return valid plan structures.</p>
       )}
    </div>
  );
};

export default NutritionistView;


import React from 'react';
import { DailyMealAnalysis, MealBreakdown } from '../types';

interface DailyMealSummaryDisplayProps {
  analysis: DailyMealAnalysis | null;
}

const DailyMealSummaryDisplay: React.FC<DailyMealSummaryDisplayProps> = ({ analysis }) => {
  if (!analysis) return null;

  const renderMealBreakdown = (meal: MealBreakdown) => (
    <div key={meal.meal} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-md font-semibold text-gray-700">{meal.meal}</h4>
      <p className="text-sm text-gray-600 mt-1">
        <span className="font-medium">Items:</span> {meal.items || "Not specified / Understood"}
      </p>
      {meal.estimatedCalories && (
        <p className="text-sm text-gray-500"><span className="font-medium">Est. Calories:</span> {meal.estimatedCalories}</p>
      )}
      {meal.notes && (
        <p className="text-sm text-gray-500 italic"><span className="font-medium">Notes:</span> {meal.notes}</p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl mt-8">
      <div className="flex items-center mb-4">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-green-500 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068M15.75 21H8.25A2.25 2.25 0 016 18.75V5.25A2.25 2.25 0 018.25 3h7.5A2.25 2.25 0 0118 5.25v6.75m3 0V11.25a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 11.25v7.5A2.25 2.25 0 004.5 21h3.75m13.5-3.75V12A2.25 2.25 0 0019.5 9.75h-4.5A2.25 2.25 0 0012.75 12v3.75m0 0H15M12.75 15.75H15m3.75 2.25H15" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800">Daily Intake Analysis</h2>
      </div>
      
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-3xl font-bold text-green-600 text-center">{analysis.totalEstimatedCalories}</p>
        <p className="text-center text-sm text-gray-500 mt-1">Total Estimated Calories</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">Nutritional Quality Assessment</h3>
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">{analysis.qualityAssessment}</p>
        </div>

        {analysis.generalRecommendations && (
           <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">General Recommendations</h3>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200 whitespace-pre-line">{analysis.generalRecommendations}</p>
          </div>
        )}
        
        {analysis.educativeTip && (
            <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-md">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-sky-600 mr-2 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    <div>
                        <h4 className="text-md font-semibold text-sky-700">Educative Tip</h4>
                        <p className="text-sm text-sky-600">{analysis.educativeTip}</p>
                    </div>
                </div>
            </div>
        )}

        {analysis.motivationalMessage && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                 <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-600 mr-2 flex-shrink-0">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0M6.375 17.25a6 6 0 017.25-4.596m5.625 4.596v-1.5m0 0a6 6 0 00-9.75-4.125M12 18.75h0M12 12.75h0M6.375 12.75a6 6 0 007.25 4.596M12 12.75h0M12 18.75" />
                    </svg>
                    <div>
                        <h4 className="text-md font-semibold text-purple-700">Motivational Message</h4>
                        <p className="text-sm text-purple-600">{analysis.motivationalMessage}</p>
                    </div>
                </div>
            </div>
        )}


        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 pt-3 mt-3 border-t">Meal Breakdown</h3>
          <div className="space-y-3">
            {analysis.mealBreakdown && analysis.mealBreakdown.length > 0 
                ? analysis.mealBreakdown.map(renderMealBreakdown)
                : <p className="text-sm text-gray-500">No meal breakdown available.</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMealSummaryDisplay;
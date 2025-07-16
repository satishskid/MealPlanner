import React from 'react';
import { PatientCase } from '../types';

interface ProfessionalReportProps {
  patientCase: PatientCase;
  onClose: () => void;
  onDownloadPDF?: () => void;
}

const ProfessionalReport: React.FC<ProfessionalReportProps> = ({ 
  patientCase, 
  onClose, 
  onDownloadPDF 
}) => {
  const { userProfile, dailyFoodLog, aiAnalysis, nutritionistReview } = patientCase;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Professional Nutrition Report</h2>
              <p className="text-green-100 mt-1">Validated by Certified Nutritionist</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Professional Validation Badge */}
          {nutritionistReview && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">Professionally Validated</h3>
                  <p className="text-green-600 text-sm">
                    Reviewed and approved by {nutritionistReview.nutritionistName}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Review Date:</strong> {new Date(nutritionistReview.reviewDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{nutritionistReview.approvalStatus.replace('_', ' ')}</span></p>
                </div>
                <div>
                  <p><strong>Case ID:</strong> {patientCase.id}</p>
                  <p><strong>Report Generated:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Patient Profile</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Age Group:</strong> {userProfile.ageGroup}</p>
                <p><strong>Cuisine Preference:</strong> {userProfile.cuisinePreference}</p>
              </div>
              <div>
                <p><strong>Analysis Date:</strong> {new Date(patientCase.createdAt).toLocaleDateString()}</p>
                {patientCase.patientName && <p><strong>Name:</strong> {patientCase.patientName}</p>}
              </div>
            </div>
          </div>

          {/* Daily Food Log */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Food Intake</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <strong className="text-blue-700">Breakfast:</strong>
                  <p className="text-gray-700 text-sm">{dailyFoodLog.breakfast}</p>
                </div>
                <div>
                  <strong className="text-blue-700">Lunch:</strong>
                  <p className="text-gray-700 text-sm">{dailyFoodLog.lunch}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <strong className="text-blue-700">Dinner:</strong>
                  <p className="text-gray-700 text-sm">{dailyFoodLog.dinner}</p>
                </div>
                <div>
                  <strong className="text-blue-700">Snacks:</strong>
                  <p className="text-gray-700 text-sm">{dailyFoodLog.snacks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Scientific Analysis</h3>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-purple-700">Total Estimated Calories:</strong>
                  <p className="text-gray-700">{aiAnalysis.totalEstimatedCalories}</p>
                </div>
                <div>
                  <strong className="text-purple-700">Overall Quality:</strong>
                  <p className="text-gray-700 text-sm">{aiAnalysis.qualityAssessment}</p>
                </div>
              </div>

              {/* Meal Breakdown */}
              {aiAnalysis.mealBreakdown && aiAnalysis.mealBreakdown.length > 0 && (
                <div>
                  <strong className="text-purple-700">Detailed Meal Analysis:</strong>
                  <div className="mt-2 space-y-2">
                    {aiAnalysis.mealBreakdown.map((meal, index) => (
                      <div key={index} className="bg-white rounded p-3 border border-purple-200">
                        <div className="flex justify-between items-start mb-1">
                          <strong className="text-sm">{meal.meal}</strong>
                          <span className="text-xs text-purple-600">{meal.estimatedCalories}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{meal.items}</p>
                        <p className="text-xs text-gray-500">{meal.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Review */}
          {nutritionistReview && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Assessment</h3>
              
              <div className="space-y-4">
                <div>
                  <strong className="text-green-700">Professional Notes:</strong>
                  <p className="text-gray-700 text-sm mt-1 bg-white p-3 rounded border border-green-200">
                    {nutritionistReview.professionalNotes}
                  </p>
                </div>

                <div>
                  <strong className="text-green-700">Professional Recommendations:</strong>
                  <p className="text-gray-700 text-sm mt-1 bg-white p-3 rounded border border-green-200">
                    {nutritionistReview.recommendations}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Insights</h3>
            
            <div className="space-y-3">
              <div>
                <strong className="text-yellow-700">General Recommendations:</strong>
                <p className="text-gray-700 text-sm mt-1">{aiAnalysis.generalRecommendations}</p>
              </div>

              <div>
                <strong className="text-yellow-700">Cultural Insight:</strong>
                <p className="text-gray-700 text-sm mt-1">{aiAnalysis.motivationalMessage}</p>
              </div>

              <div>
                <strong className="text-yellow-700">Educational Tip:</strong>
                <p className="text-gray-700 text-sm mt-1">{aiAnalysis.educativeTip}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <p>Generated by nutreeai - Scientific Nutrition Analysis</p>
                <p>This report combines AI analysis with professional nutritionist validation</p>
              </div>
              <div className="flex gap-3">
                {onDownloadPDF && (
                  <button
                    onClick={onDownloadPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Download PDF
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReport;

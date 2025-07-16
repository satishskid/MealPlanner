import React, { useState } from 'react';
import { NutritionistProfile, PatientCase, NutritionistReview, BulkUploadData } from '../types';
import BulkUploadManager from './BulkUploadManager';

interface NutritionistDashboardProps {
  nutritionist: NutritionistProfile;
  onLogout: () => void;
}

const NutritionistDashboard: React.FC<NutritionistDashboardProps> = ({ nutritionist, onLogout }) => {
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'modified' | 'needs_revision'>('approved');
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Editable AI recommendations
  const [editedGeneralRecommendations, setEditedGeneralRecommendations] = useState('');
  const [editedMotivationalMessage, setEditedMotivationalMessage] = useState('');
  const [editedEducativeTip, setEditedEducativeTip] = useState('');
  const [editedQualityAssessment, setEditedQualityAssessment] = useState('');

  // Demo patient cases
  const [patientCases, setPatientCases] = useState<PatientCase[]>([
    {
      id: 'case_001',
      patientEmail: 'patient1@example.com',
      userProfile: {
        ageGroup: 'Adult (25-39)',
        cuisinePreference: 'North Indian'
      },
      dailyFoodLog: {
        breakfast: 'Paratha with curd and pickle',
        lunch: 'Dal rice with sabzi and roti',
        dinner: 'Chicken curry with rice',
        snacks: 'Tea with biscuits'
      },
      aiAnalysis: {
        totalEstimatedCalories: '2200-2400 kcal',
        qualityAssessment: 'Balanced traditional Indian diet with good protein and carbohydrate distribution',
        mealBreakdown: [
          { meal: 'Breakfast', items: 'Paratha with curd', estimatedCalories: '450-500 kcal', notes: 'Good protein from curd' },
          { meal: 'Lunch', items: 'Dal rice with vegetables', estimatedCalories: '600-700 kcal', notes: 'Well-balanced meal' },
          { meal: 'Dinner', items: 'Chicken curry with rice', estimatedCalories: '700-800 kcal', notes: 'High protein content' },
          { meal: 'Snacks', items: 'Tea with biscuits', estimatedCalories: '150-200 kcal', notes: 'Light snack' }
        ],
        generalRecommendations: 'Consider adding more vegetables and reducing refined carbohydrates',
        motivationalMessage: 'Your traditional food choices show cultural awareness!',
        educativeTip: 'Try whole grain alternatives for better fiber intake'
      },
      createdAt: '2024-01-15T10:30:00Z',
      status: 'pending_review'
    }
  ]);

  const handleCaseSelection = (case_: PatientCase) => {
    setSelectedCase(case_);
    // Populate editable fields with original AI analysis
    setEditedGeneralRecommendations(case_.aiAnalysis.generalRecommendations || '');
    setEditedMotivationalMessage(case_.aiAnalysis.motivationalMessage || '');
    setEditedEducativeTip(case_.aiAnalysis.educativeTip || '');
    setEditedQualityAssessment(case_.aiAnalysis.qualityAssessment || '');

    // Clear review form
    setReviewNotes('');
    setRecommendations('');
    setApprovalStatus('approved');
  };

  const handleReviewSubmit = () => {
    if (!selectedCase) return;

    const review: NutritionistReview = {
      nutritionistId: nutritionist.id,
      nutritionistName: nutritionist.name,
      reviewDate: new Date().toISOString(),
      professionalNotes: reviewNotes,
      recommendations: recommendations,
      approvalStatus: approvalStatus,
      modifiedAnalysis: {
        generalRecommendations: editedGeneralRecommendations,
        motivationalMessage: editedMotivationalMessage,
        educativeTip: editedEducativeTip,
        qualityAssessment: editedQualityAssessment
      }
    };

    // Update the case with the review
    setPatientCases(prev => prev.map(case_ =>
      case_.id === selectedCase.id
        ? { ...case_, nutritionistReview: review, status: 'reviewed' as const, reviewedAt: new Date().toISOString() }
        : case_
    ));

    // Reset form
    setSelectedCase(null);
    setReviewNotes('');
    setRecommendations('');
    setApprovalStatus('approved');
    setEditedGeneralRecommendations('');
    setEditedMotivationalMessage('');
    setEditedEducativeTip('');
    setEditedQualityAssessment('');
  };

  const handleBulkUploadComplete = (bulkData: BulkUploadData) => {
    // Add all bulk cases to the patient cases list
    setPatientCases(prev => [...prev, ...bulkData.cases]);
    setShowBulkUpload(false);

    // Show success message
    alert(`Successfully uploaded ${bulkData.totalCases} cases from ${bulkData.organizationName}`);
  };

  const pendingCases = patientCases.filter(case_ => case_.status === 'pending_review');
  const reviewedCases = patientCases.filter(case_ => case_.status === 'reviewed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              nutree<span className="text-yellow-300">ai</span>
              <span className="text-sm font-normal ml-2 opacity-75">Professional Dashboard</span>
            </h1>
            <p className="text-white/80 text-sm">
              Welcome, {nutritionist.name} ({nutritionist.credentials})
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkUpload(true)}
              className="bg-yellow-300 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 4.414V13a1 1 0 11-2 0V4.414L7.707 5.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              Bulk Upload
            </button>
            <button
              onClick={onLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!selectedCase ? (
          // Dashboard Overview
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Reviews */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                </svg>
                Pending Reviews ({pendingCases.length})
              </h2>
              <div className="space-y-3">
                {pendingCases.map(case_ => (
                  <div key={case_.id} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{case_.patientEmail}</p>
                        <p className="text-white/70 text-sm">
                          {case_.userProfile.ageGroup} • {case_.userProfile.cuisinePreference}
                        </p>
                      </div>
                      <span className="bg-yellow-300 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-3">
                      AI Analysis: {case_.aiAnalysis.totalEstimatedCalories}
                    </p>
                    <button
                      onClick={() => handleCaseSelection(case_)}
                      className="bg-yellow-300 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                    >
                      Review Case
                    </button>
                  </div>
                ))}
                {pendingCases.length === 0 && (
                  <p className="text-white/60 text-center py-8">No pending reviews</p>
                )}
              </div>
            </div>

            {/* Completed Reviews */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Completed Reviews ({reviewedCases.length})
              </h2>
              <div className="space-y-3">
                {reviewedCases.map(case_ => (
                  <div key={case_.id} className="bg-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{case_.patientEmail}</p>
                        <p className="text-white/70 text-sm">
                          Reviewed: {new Date(case_.nutritionistReview?.reviewDate || '').toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-green-300 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        {case_.nutritionistReview?.approvalStatus}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCaseSelection(case_)}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
                {reviewedCases.length === 0 && (
                  <p className="text-white/60 text-center py-8">No completed reviews</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Case Review Detail
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Case Review</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Patient Info & AI Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Patient Information</h3>
                  <p className="text-white/80">Email: {selectedCase.patientEmail}</p>
                  <p className="text-white/80">Age Group: {selectedCase.userProfile.ageGroup}</p>
                  <p className="text-white/80">Cuisine Preference: {selectedCase.userProfile.cuisinePreference}</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Daily Food Log</h3>
                  <div className="space-y-2 text-white/80">
                    <p><strong>Breakfast:</strong> {
                      typeof selectedCase.dailyFoodLog.breakfast === 'string'
                        ? selectedCase.dailyFoodLog.breakfast
                        : selectedCase.dailyFoodLog.breakfast?.rawText || 'Not specified'
                    }</p>
                    <p><strong>Lunch:</strong> {
                      typeof selectedCase.dailyFoodLog.lunch === 'string'
                        ? selectedCase.dailyFoodLog.lunch
                        : selectedCase.dailyFoodLog.lunch?.rawText || 'Not specified'
                    }</p>
                    <p><strong>Dinner:</strong> {
                      typeof selectedCase.dailyFoodLog.dinner === 'string'
                        ? selectedCase.dailyFoodLog.dinner
                        : selectedCase.dailyFoodLog.dinner?.rawText || 'Not specified'
                    }</p>
                    <p><strong>Snacks:</strong> {
                      typeof selectedCase.dailyFoodLog.snacks === 'string'
                        ? selectedCase.dailyFoodLog.snacks
                        : selectedCase.dailyFoodLog.snacks?.rawText || 'Not specified'
                    }</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Complete AI Analysis</h3>
                  <div className="space-y-3 text-white/80 text-sm">
                    <div>
                      <p><strong>Total Calories:</strong> {selectedCase.aiAnalysis.totalEstimatedCalories}</p>
                    </div>

                    <div>
                      <p><strong>Quality Assessment:</strong></p>
                      <p className="mt-1 bg-white/10 p-2 rounded text-xs">{selectedCase.aiAnalysis.qualityAssessment}</p>
                    </div>

                    {/* Detailed Meal Breakdown */}
                    {selectedCase.aiAnalysis.mealBreakdown && selectedCase.aiAnalysis.mealBreakdown.length > 0 && (
                      <div>
                        <p><strong>Meal Breakdown:</strong></p>
                        <div className="mt-1 space-y-1">
                          {selectedCase.aiAnalysis.mealBreakdown.map((meal, index) => (
                            <div key={index} className="bg-white/10 p-2 rounded text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <strong>{meal.meal}</strong>
                                <span className="text-yellow-300">{meal.estimatedCalories}</span>
                              </div>
                              <p className="text-white/70 mb-1">{meal.items}</p>
                              <p className="text-white/60">{meal.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p><strong>General Recommendations:</strong></p>
                      <p className="mt-1 bg-white/10 p-2 rounded text-xs">{selectedCase.aiAnalysis.generalRecommendations}</p>
                    </div>

                    <div>
                      <p><strong>Motivational Message:</strong></p>
                      <p className="mt-1 bg-white/10 p-2 rounded text-xs">{selectedCase.aiAnalysis.motivationalMessage}</p>
                    </div>

                    <div>
                      <p><strong>Educational Tip:</strong></p>
                      <p className="mt-1 bg-white/10 p-2 rounded text-xs">{selectedCase.aiAnalysis.educativeTip}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Review Form */}
              <div className="space-y-4">
                {selectedCase.status === 'pending_review' ? (
                  <>
                    {/* Editable AI Recommendations */}
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Review & Edit AI Analysis</h3>
                      <p className="text-white/70 text-sm mb-4">Modify the AI-generated recommendations as needed:</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Quality Assessment
                          </label>
                          <textarea
                            value={editedQualityAssessment}
                            onChange={(e) => setEditedQualityAssessment(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={2}
                            placeholder="Edit quality assessment..."
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            General Recommendations
                          </label>
                          <textarea
                            value={editedGeneralRecommendations}
                            onChange={(e) => setEditedGeneralRecommendations(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={3}
                            placeholder="Edit general recommendations..."
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Motivational Message
                          </label>
                          <textarea
                            value={editedMotivationalMessage}
                            onChange={(e) => setEditedMotivationalMessage(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={2}
                            placeholder="Edit motivational message..."
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Educational Tip
                          </label>
                          <textarea
                            value={editedEducativeTip}
                            onChange={(e) => setEditedEducativeTip(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={2}
                            placeholder="Edit educational tip..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Professional Review</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Professional Notes
                          </label>
                          <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={4}
                            placeholder="Add your professional assessment..."
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Additional Recommendations
                          </label>
                          <textarea
                            value={recommendations}
                            onChange={(e) => setRecommendations(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            rows={4}
                            placeholder="Professional recommendations..."
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Approval Status
                          </label>
                          <select
                            value={approvalStatus}
                            onChange={(e) => setApprovalStatus(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          >
                            <option value="approved">Approved</option>
                            <option value="modified">Approved with Modifications</option>
                            <option value="needs_revision">Needs Revision</option>
                          </select>
                        </div>

                        <button
                          onClick={handleReviewSubmit}
                          className="w-full bg-yellow-300 text-blue-600 py-3 rounded-lg font-semibold hover:bg-yellow-200 transition-colors"
                        >
                          Submit Professional Review
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Show existing review
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Professional Review</h3>
                    {selectedCase.nutritionistReview && (
                      <div className="space-y-3 text-white/80">
                        <p><strong>Reviewed by:</strong> {selectedCase.nutritionistReview.nutritionistName}</p>
                        <p><strong>Date:</strong> {new Date(selectedCase.nutritionistReview.reviewDate).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedCase.nutritionistReview.approvalStatus}</p>
                        <div>
                          <strong>Professional Notes:</strong>
                          <p className="mt-1">{selectedCase.nutritionistReview.professionalNotes}</p>
                        </div>
                        <div>
                          <strong>Recommendations:</strong>
                          <p className="mt-1">{selectedCase.nutritionistReview.recommendations}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUploadManager
          onUploadComplete={handleBulkUploadComplete}
          onClose={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  );
};

export default NutritionistDashboard;

import React from 'react';
import { PatientCase } from '../types';

interface PatientStatusTrackerProps {
  patientCase: PatientCase;
  onViewReport?: () => void;
}

const PatientStatusTracker: React.FC<PatientStatusTrackerProps> = ({ patientCase, onViewReport }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          color: 'bg-blue-500',
          text: 'Analysis Submitted',
          description: 'Your food analysis has been submitted and is queued for nutritionist review.',
          icon: '📝'
        };
      case 'under_review':
        return {
          color: 'bg-yellow-500',
          text: 'Under Professional Review',
          description: 'A certified nutritionist is currently reviewing your analysis.',
          icon: '👩‍⚕️'
        };
      case 'reviewed':
        return {
          color: 'bg-green-500',
          text: 'Professionally Reviewed',
          description: 'Your analysis has been reviewed and validated by our nutritionist.',
          icon: '✅'
        };
      case 'delivered':
        return {
          color: 'bg-purple-500',
          text: 'Report Delivered',
          description: 'Your professional nutrition report is ready for download.',
          icon: '📋'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown Status',
          description: '',
          icon: '❓'
        };
    }
  };

  const statusInfo = getStatusInfo(patientCase.status);
  const isReportReady = patientCase.status === 'reviewed' || patientCase.status === 'delivered';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Nutrition Analysis Status</h2>
        <p className="text-gray-600">Case ID: {patientCase.id}</p>
      </div>

      {/* Status Timeline */}
      <div className="space-y-4 mb-6">
        {['submitted', 'under_review', 'reviewed', 'delivered'].map((step, index) => {
          const isActive = step === patientCase.status;
          const isCompleted = ['submitted', 'under_review', 'reviewed', 'delivered'].indexOf(patientCase.status) > index;
          const stepInfo = getStatusInfo(step);
          
          return (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                isActive ? stepInfo.color : isCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="ml-4 flex-1">
                <h3 className={`font-semibold ${isActive ? 'text-gray-800' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {stepInfo.text}
                </h3>
                {isActive && (
                  <p className="text-sm text-gray-600 mt-1">{stepInfo.description}</p>
                )}
              </div>
              {isActive && (
                <div className="text-2xl">{stepInfo.icon}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Status Details */}
      <div className={`${statusInfo.color} bg-opacity-10 border-l-4 border-${statusInfo.color.split('-')[1]}-500 p-4 mb-6`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">{statusInfo.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{statusInfo.text}</h3>
            <p className="text-gray-600 text-sm">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Nutritionist Info (if reviewed) */}
      {patientCase.nutritionistReview && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Professional Validation</h3>
          <div className="text-sm text-green-700">
            <p><strong>Reviewed by:</strong> {patientCase.nutritionistReview.nutritionistName}</p>
            <p><strong>Review Date:</strong> {new Date(patientCase.nutritionistReview.reviewDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {patientCase.nutritionistReview.approvalStatus}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {isReportReady && onViewReport && (
          <button
            onClick={onViewReport}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
            View Professional Report
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
          Refresh Status
        </button>
      </div>

      {/* Estimated Time */}
      {patientCase.status === 'submitted' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>⏱️ Estimated review time: 2-4 hours during business hours</p>
        </div>
      )}
    </div>
  );
};

export default PatientStatusTracker;

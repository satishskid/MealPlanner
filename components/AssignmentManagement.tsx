import React, { useState } from 'react';
import { PatientCase, NutritionistProfile, AssignmentCriteria, AssignmentResult, CaseStatus, CasePriority } from '../types';

interface AssignmentManagementProps {
  onClose: () => void;
}

const AssignmentManagement: React.FC<AssignmentManagementProps> = ({ onClose }) => {
  const [view, setView] = useState<'pending' | 'assigned' | 'auto_assign' | 'manual_assign'>('pending');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [assignmentResults, setAssignmentResults] = useState<AssignmentResult[]>([]);

  // Demo data
  const [pendingCases, setPendingCases] = useState<PatientCase[]>([
    {
      id: 'case_001',
      patientEmail: 'patient1@example.com',
      patientName: 'Rajesh Patel',
      userProfile: { ageGroup: 'Adult (25-39)', cuisinePreference: 'Gujarati' },
      dailyFoodLog: {
        breakfast: 'Dhokla with chutney',
        lunch: 'Gujarati thali with dal, rice, roti',
        dinner: 'Khichdi with kadhi',
        snacks: 'Tea with fafda'
      },
      aiAnalysis: {
        totalEstimatedCalories: '2100-2300 kcal',
        qualityAssessment: 'Traditional Gujarati diet with good balance',
        mealBreakdown: [],
        generalRecommendations: 'Consider adding more protein sources',
        motivationalMessage: 'Great cultural food choices!',
        educativeTip: 'Try steaming dhokla instead of frying'
      },
      createdAt: '2024-01-15T10:30:00Z',
      status: 'submitted' as CaseStatus,
      priority: 'normal' as CasePriority,
      tags: ['gujarati', 'vegetarian', 'traditional']
    },
    {
      id: 'case_002',
      patientEmail: 'athlete@sports.com',
      patientName: 'Priya Singh',
      userProfile: { ageGroup: 'Adult (20-29)', cuisinePreference: 'North Indian' },
      dailyFoodLog: {
        breakfast: 'Protein shake with oats',
        lunch: 'Chicken breast with quinoa',
        dinner: 'Fish curry with brown rice',
        snacks: 'Nuts and fruits'
      },
      aiAnalysis: {
        totalEstimatedCalories: '2800-3000 kcal',
        qualityAssessment: 'High protein diet suitable for athletes',
        mealBreakdown: [],
        generalRecommendations: 'Excellent protein intake for training',
        motivationalMessage: 'Perfect nutrition for athletic performance!',
        educativeTip: 'Time your protein intake around workouts'
      },
      createdAt: '2024-01-15T11:00:00Z',
      status: 'submitted' as CaseStatus,
      priority: 'high' as CasePriority,
      tags: ['sports', 'high_protein', 'athlete']
    }
  ]);

  const [nutritionists] = useState<NutritionistProfile[]>([
    {
      id: 'nut_001',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@nutreeai.com',
      credentials: 'RD, PhD',
      specializations: ['clinical', 'diabetes', 'cultural_cuisine'],
      yearsOfExperience: 12,
      languages: ['English', 'Hindi', 'Gujarati'],
      culturalExpertise: ['North Indian', 'South Indian', 'Gujarati'],
      maxCasesPerDay: 15,
      currentCaseLoad: 8,
      isActive: true,
      isAvailable: true,
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      rating: 4.8,
      totalCasesCompleted: 1456,
      averageReviewTime: 1.8,
      createdAt: '2024-01-15T00:00:00Z',
      lastActiveAt: new Date().toISOString()
    },
    {
      id: 'nut_002',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@nutreeai.com',
      credentials: 'MS, RD',
      specializations: ['sports', 'weight_management'],
      yearsOfExperience: 8,
      languages: ['English', 'Hindi'],
      culturalExpertise: ['North Indian', 'Continental'],
      maxCasesPerDay: 12,
      currentCaseLoad: 5,
      isActive: true,
      isAvailable: true,
      timezone: 'Asia/Kolkata',
      workingHours: {
        start: '10:00',
        end: '18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      },
      rating: 4.7,
      totalCasesCompleted: 987,
      averageReviewTime: 2.1,
      createdAt: '2024-02-01T00:00:00Z',
      lastActiveAt: new Date().toISOString()
    }
  ]);

  // Intelligent Assignment Algorithm
  const calculateAssignmentScore = (nutritionist: NutritionistProfile, case_: PatientCase): AssignmentResult => {
    let score = 0;
    let reasons: string[] = [];

    // Availability check (mandatory)
    if (!nutritionist.isActive || !nutritionist.isAvailable) {
      return { nutritionistId: nutritionist.id, score: 0, reason: 'Not available', estimatedReviewTime: 0 };
    }

    // Workload check
    const workloadRatio = nutritionist.currentCaseLoad / nutritionist.maxCasesPerDay;
    if (workloadRatio >= 1) {
      return { nutritionistId: nutritionist.id, score: 0, reason: 'At capacity', estimatedReviewTime: 0 };
    }

    // Workload scoring (lower workload = higher score)
    const workloadScore = (1 - workloadRatio) * 30;
    score += workloadScore;
    reasons.push(`Workload: ${Math.round(workloadScore)}pts`);

    // Cultural expertise matching
    const patientCuisine = case_.userProfile.cuisinePreference;
    if (nutritionist.culturalExpertise.includes(patientCuisine)) {
      score += 25;
      reasons.push(`Cultural match: +25pts`);
    }

    // Specialization matching
    const caseRequiresSpecialization = case_.tags?.some(tag => 
      ['sports', 'diabetes', 'pediatric', 'geriatric'].includes(tag)
    );
    
    if (caseRequiresSpecialization) {
      const hasMatchingSpec = case_.tags?.some(tag => {
        switch (tag) {
          case 'sports': return nutritionist.specializations.includes('sports');
          case 'diabetes': return nutritionist.specializations.includes('diabetes');
          case 'pediatric': return nutritionist.specializations.includes('pediatric');
          case 'geriatric': return nutritionist.specializations.includes('geriatric');
          default: return false;
        }
      });
      
      if (hasMatchingSpec) {
        score += 20;
        reasons.push(`Specialization match: +20pts`);
      }
    }

    // Priority handling
    if (case_.priority === 'urgent' || case_.priority === 'high') {
      // Prefer nutritionists with faster review times for urgent cases
      const speedBonus = Math.max(0, (3 - nutritionist.averageReviewTime) * 5);
      score += speedBonus;
      reasons.push(`Speed bonus: +${Math.round(speedBonus)}pts`);
    }

    // Performance rating
    const ratingScore = nutritionist.rating * 5;
    score += ratingScore;
    reasons.push(`Rating: +${Math.round(ratingScore)}pts`);

    // Experience bonus
    const experienceScore = Math.min(nutritionist.yearsOfExperience, 15) * 0.5;
    score += experienceScore;
    reasons.push(`Experience: +${Math.round(experienceScore)}pts`);

    // Estimate review time based on current workload and average time
    const estimatedReviewTime = nutritionist.averageReviewTime * (1 + workloadRatio * 0.5);

    return {
      nutritionistId: nutritionist.id,
      score: Math.round(score),
      reason: reasons.join(', '),
      estimatedReviewTime: Math.round(estimatedReviewTime * 10) / 10
    };
  };

  const findBestAssignment = (case_: PatientCase): AssignmentResult[] => {
    const results = nutritionists
      .map(nutritionist => calculateAssignmentScore(nutritionist, case_))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    return results;
  };

  const handleAutoAssign = (case_: PatientCase) => {
    const results = findBestAssignment(case_);
    if (results.length > 0) {
      const bestMatch = results[0];
      assignCaseToNutritionist(case_.id, bestMatch.nutritionistId);
    }
  };

  const handleManualAssign = (case_: PatientCase) => {
    setSelectedCase(case_);
    const results = findBestAssignment(case_);
    setAssignmentResults(results);
    setView('manual_assign');
  };

  const assignCaseToNutritionist = (caseId: string, nutritionistId: string) => {
    setPendingCases(prev => prev.map(case_ => 
      case_.id === caseId 
        ? { 
            ...case_, 
            status: 'assigned' as CaseStatus, 
            assignedNutritionistId: nutritionistId,
            assignedAt: new Date().toISOString()
          }
        : case_
    ));
    
    // Update nutritionist workload (in real app, this would be handled by backend)
    // This is just for demo purposes
    alert(`Case ${caseId} assigned to nutritionist ${nutritionistId}`);
  };

  const renderPendingCases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Assignments</h2>
          <p className="text-gray-600">{pendingCases.length} cases waiting for assignment</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              pendingCases.forEach(case_ => handleAutoAssign(case_));
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Auto-Assign All
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {pendingCases.map((case_) => (
          <div key={case_.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{case_.patientName || case_.patientEmail}</h3>
                <p className="text-sm text-gray-600">
                  {case_.userProfile.ageGroup} • {case_.userProfile.cuisinePreference}
                </p>
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(case_.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  case_.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  case_.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {case_.priority}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Daily Food Log:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>Breakfast:</strong> {typeof case_.dailyFoodLog.breakfast === 'string' ? case_.dailyFoodLog.breakfast : case_.dailyFoodLog.breakfast?.rawText}</div>
                <div><strong>Lunch:</strong> {typeof case_.dailyFoodLog.lunch === 'string' ? case_.dailyFoodLog.lunch : case_.dailyFoodLog.lunch?.rawText}</div>
                <div><strong>Dinner:</strong> {typeof case_.dailyFoodLog.dinner === 'string' ? case_.dailyFoodLog.dinner : case_.dailyFoodLog.dinner?.rawText}</div>
                <div><strong>Snacks:</strong> {typeof case_.dailyFoodLog.snacks === 'string' ? case_.dailyFoodLog.snacks : case_.dailyFoodLog.snacks?.rawText}</div>
              </div>
            </div>

            {case_.tags && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {case_.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleAutoAssign(case_)}
                className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium hover:bg-green-200 transition-colors"
              >
                Auto-Assign
              </button>
              <button
                onClick={() => handleManualAssign(case_)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Manual Assign
              </button>
            </div>
          </div>
        ))}
      </div>

      {pendingCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No pending cases for assignment.</p>
        </div>
      )}
    </div>
  );

  const renderManualAssignment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manual Assignment</h2>
          <p className="text-gray-600">Select the best nutritionist for this case</p>
        </div>
        <button
          onClick={() => setView('pending')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Pending
        </button>
      </div>

      {selectedCase && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Case: {selectedCase.patientName || selectedCase.patientEmail}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedCase.userProfile.ageGroup} • {selectedCase.userProfile.cuisinePreference} • Priority: {selectedCase.priority}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {assignmentResults.map((result) => {
          const nutritionist = nutritionists.find(n => n.id === result.nutritionistId);
          if (!nutritionist) return null;

          return (
            <div key={result.nutritionistId} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{nutritionist.name}</h3>
                  <p className="text-sm text-gray-600">{nutritionist.credentials}</p>
                  <p className="text-xs text-gray-500">
                    {nutritionist.currentCaseLoad}/{nutritionist.maxCasesPerDay} cases today
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{result.score}</div>
                  <div className="text-xs text-gray-500">match score</div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Specializations:</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {nutritionist.specializations.map((spec) => (
                    <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {spec}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-1">Cultural Expertise:</p>
                <div className="flex flex-wrap gap-1">
                  {nutritionist.culturalExpertise.map((cuisine) => (
                    <span key={cuisine} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-600">Assignment Reasoning:</p>
                <p className="text-sm text-gray-800">{result.reason}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimated review time: {result.estimatedReviewTime} hours
                </p>
              </div>

              <button
                onClick={() => {
                  if (selectedCase) {
                    assignCaseToNutritionist(selectedCase.id, result.nutritionistId);
                    setView('pending');
                    setSelectedCase(null);
                  }
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Assign to {nutritionist.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {view === 'pending' && renderPendingCases()}
      {view === 'manual_assign' && renderManualAssignment()}
    </div>
  );
};

export default AssignmentManagement;

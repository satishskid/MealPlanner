import React, { useState } from 'react';
import { BulkUploadData, PatientCase, UserProfile, DailyFoodLog } from '../types';

interface BulkUploadManagerProps {
  onUploadComplete: (data: BulkUploadData) => void;
  onClose: () => void;
}

const BulkUploadManager: React.FC<BulkUploadManagerProps> = ({ onUploadComplete, onClose }) => {
  const [uploadStep, setUploadStep] = useState<'info' | 'upload' | 'processing' | 'complete'>('info');
  const [organizationInfo, setOrganizationInfo] = useState({
    name: '',
    contactEmail: '',
    type: 'school' // school, corporate, healthcare
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedData, setProcessedData] = useState<BulkUploadData | null>(null);

  // Sample CSV format for demonstration
  const sampleCSVFormat = `unique_id,patient_name,patient_email,age_group,cuisine_preference,breakfast,lunch,dinner,snacks
STU001,John Doe,john@school.edu,Child (5-12),North Indian,Paratha with milk,Dal rice with vegetables,Chicken curry with roti,Fruits and nuts
STU002,Jane Smith,jane@school.edu,Child (5-12),South Indian,Idli with sambar,Rice with rasam,Fish curry with rice,Buttermilk and snacks`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const processCSVData = async (csvContent: string): Promise<PatientCase[]> => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const cases: PatientCase[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const caseData: PatientCase = {
          id: values[0] || `BULK_${Date.now()}_${i}`,
          patientEmail: values[2] || '',
          patientName: values[1] || '',
          organizationId: organizationInfo.name.replace(/\s+/g, '_').toLowerCase(),
          userProfile: {
            ageGroup: values[3] || 'Adult (20-39)',
            cuisinePreference: values[4] || 'Mixed/General Indian'
          },
          dailyFoodLog: {
            breakfast: values[5] || '',
            lunch: values[6] || '',
            dinner: values[7] || '',
            snacks: values[8] || ''
          },
          aiAnalysis: {
            totalEstimatedCalories: 'Pending Analysis',
            qualityAssessment: 'Analysis in progress...',
            mealBreakdown: [],
            generalRecommendations: 'Will be provided after AI analysis',
            motivationalMessage: 'Analysis in progress',
            educativeTip: 'Analysis in progress'
          },
          createdAt: new Date().toISOString(),
          status: 'submitted',
          priority: 'normal'
        };
        cases.push(caseData);
      }
    }
    return cases;
  };

  const handleProcessUpload = async () => {
    if (!uploadedFile) return;

    setUploadStep('processing');
    setProcessingProgress(0);

    try {
      const csvContent = await uploadedFile.text();
      
      // Simulate processing with progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const cases = await processCSVData(csvContent);
      
      // Complete processing
      setProcessingProgress(100);
      
      const bulkData: BulkUploadData = {
        organizationName: organizationInfo.name,
        contactEmail: organizationInfo.contactEmail,
        uploadDate: new Date().toISOString(),
        totalCases: cases.length,
        processedCases: cases.length,
        cases: cases
      };

      setProcessedData(bulkData);
      setUploadStep('complete');
      
      // Notify parent component
      setTimeout(() => {
        onUploadComplete(bulkData);
      }, 1000);

    } catch (error) {
      console.error('Error processing upload:', error);
      alert('Error processing file. Please check the format and try again.');
      setUploadStep('upload');
    }
  };

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSVFormat], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutreeai_bulk_upload_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Bulk Upload Manager</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          <p className="text-blue-100 mt-2">Upload nutrition data for schools, organizations, and healthcare facilities</p>
        </div>

        <div className="p-6">
          {/* Step 1: Organization Information */}
          {uploadStep === 'info' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Organization Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={organizationInfo.name}
                    onChange={(e) => setOrganizationInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Springfield Elementary School"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={organizationInfo.contactEmail}
                    onChange={(e) => setOrganizationInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@organization.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <select
                  value={organizationInfo.type}
                  onChange={(e) => setOrganizationInfo(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="school">Educational Institution</option>
                  <option value="corporate">Corporate Wellness</option>
                  <option value="healthcare">Healthcare Facility</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Upload your CSV file with participant data</li>
                  <li>• AI analyzes each participant's nutrition data</li>
                  <li>• Nutritionist reviews and validates all analyses</li>
                  <li>• You receive comprehensive reports for all participants</li>
                </ul>
              </div>

              <button
                onClick={() => setUploadStep('upload')}
                disabled={!organizationInfo.name || !organizationInfo.contactEmail}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to File Upload
              </button>
            </div>
          )}

          {/* Step 2: File Upload */}
          {uploadStep === 'upload' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Upload CSV File</h3>
              
              {/* Sample Format */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Required CSV Format:</h4>
                <div className="text-xs bg-white p-3 rounded border font-mono overflow-x-auto">
                  <pre>{sampleCSVFormat}</pre>
                </div>
                <button
                  onClick={downloadSampleCSV}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  📥 Download Sample CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {uploadedFile ? uploadedFile.name : 'Click to upload CSV file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploadedFile ? 'File selected. Click Process to continue.' : 'Only CSV files are accepted'}
                  </p>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setUploadStep('info')}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessUpload}
                  disabled={!uploadedFile}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Upload
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {uploadStep === 'processing' && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">Processing Upload</h3>
              
              <div className="text-6xl mb-4">⚡</div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600">
                Processing {processingProgress}% complete...
              </p>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Parsing CSV data</p>
                <p>• Running AI nutrition analysis</p>
                <p>• Preparing for nutritionist review</p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {uploadStep === 'complete' && processedData && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">Upload Complete!</h3>
              
              <div className="text-6xl mb-4">✅</div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Successfully Processed</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Organization:</strong> {processedData.organizationName}</p>
                  <p><strong>Total Cases:</strong> {processedData.totalCases}</p>
                  <p><strong>Status:</strong> Submitted for nutritionist review</p>
                </div>
              </div>
              
              <p className="text-gray-600">
                All cases have been submitted for professional review. You will receive an email notification 
                when the nutritionist completes the analysis.
              </p>
              
              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadManager;

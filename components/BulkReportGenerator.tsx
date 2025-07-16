import React, { useState } from 'react';
import { PatientCase, OrganizationProfile } from '../types';
import { pdfReportService } from '../services/pdfReportService';

interface BulkReportData {
  uniqueId: string;
  name: string;
  email: string;
  reportStatus: 'pending' | 'generated' | 'error';
  reportUrl?: string;
  generatedAt?: string;
  errorMessage?: string;
}

interface BulkReportGeneratorProps {
  cases: PatientCase[];
  organization: OrganizationProfile;
  onClose: () => void;
}

const BulkReportGenerator: React.FC<BulkReportGeneratorProps> = ({ 
  cases, 
  organization, 
  onClose 
}) => {
  const [reportData, setReportData] = useState<BulkReportData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'individual' | 'consolidated'>('individual');

  // Initialize report data from cases
  React.useEffect(() => {
    const initialData: BulkReportData[] = cases.map(case_ => ({
      uniqueId: case_.patientProfile?.uniqueId || case_.id,
      name: case_.patientName || 'Unknown',
      email: case_.patientEmail,
      reportStatus: 'pending'
    }));
    setReportData(initialData);
  }, [cases]);

  const generateBulkReports = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      if (selectedFormat === 'individual') {
        // Generate individual PDF reports
        for (let i = 0; i < cases.length; i++) {
          const case_ = cases[i];
          const reportEntry = reportData[i];

          try {
            // Generate PDF for this case
            const pdfBlob = await pdfReportService.generateProfessionalReport({
              organization,
              patientCase: case_,
              includeDigitalSignature: true
            });

            // Create download URL
            const url = URL.createObjectURL(pdfBlob);
            
            // Update report data
            setReportData(prev => prev.map((item, index) => 
              index === i ? {
                ...item,
                reportStatus: 'generated',
                reportUrl: url,
                generatedAt: new Date().toISOString()
              } : item
            ));

          } catch (error) {
            console.error(`Error generating report for ${reportEntry.uniqueId}:`, error);
            setReportData(prev => prev.map((item, index) => 
              index === i ? {
                ...item,
                reportStatus: 'error',
                errorMessage: 'Failed to generate report'
              } : item
            ));
          }

          // Update progress
          setGenerationProgress(((i + 1) / cases.length) * 100);
        }
      } else {
        // Generate consolidated report
        const consolidatedBlob = await pdfReportService.generateBulkReports(cases, organization);
        const url = URL.createObjectURL(consolidatedBlob);
        
        // Update all entries as part of consolidated report
        setReportData(prev => prev.map(item => ({
          ...item,
          reportStatus: 'generated',
          reportUrl: url,
          generatedAt: new Date().toISOString()
        })));
        
        setGenerationProgress(100);
      }

    } catch (error) {
      console.error('Bulk report generation failed:', error);
      alert('Failed to generate bulk reports. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (reportUrl: string, uniqueId: string) => {
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = `nutrition_report_${uniqueId}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
  };

  const downloadAllReports = () => {
    reportData.forEach(report => {
      if (report.reportUrl && report.reportStatus === 'generated') {
        setTimeout(() => {
          downloadReport(report.reportUrl!, report.uniqueId);
        }, 100); // Small delay between downloads
      }
    });
  };

  const exportReportSummary = () => {
    const headers = ['Unique ID', 'Name', 'Email', 'Report Status', 'Generated At', 'Error Message'];
    const csvData = reportData.map(report => [
      report.uniqueId,
      report.name,
      report.email,
      report.reportStatus,
      report.generatedAt || '',
      report.errorMessage || ''
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_report_summary_${organization.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const completedReports = reportData.filter(r => r.reportStatus === 'generated').length;
  const errorReports = reportData.filter(r => r.reportStatus === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Report Generation</h1>
              <p className="text-gray-600 mt-2">
                Generate nutrition analysis reports for {cases.length} cases from {organization.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Generation Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Format</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="individual"
                  checked={selectedFormat === 'individual'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'individual' | 'consolidated')}
                  className="mr-2"
                />
                <span>Individual PDF reports (one per person)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="consolidated"
                  checked={selectedFormat === 'consolidated'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'individual' | 'consolidated')}
                  className="mr-2"
                />
                <span>Consolidated report (all cases in one PDF)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateBulkReports}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Reports'}
            </button>
            
            {completedReports > 0 && (
              <>
                <button
                  onClick={downloadAllReports}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Download All ({completedReports})
                </button>
                <button
                  onClick={exportReportSummary}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Export Summary
                </button>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Generating reports...</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{cases.length}</div>
            <div className="text-gray-600">Total Cases</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-green-600">{completedReports}</div>
            <div className="text-gray-600">Generated</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">{reportData.filter(r => r.reportStatus === 'pending').length}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl font-bold text-red-600">{errorReports}</div>
            <div className="text-gray-600">Errors</div>
          </div>
        </div>

        {/* Report List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Report Status</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((report, index) => (
                  <tr key={report.uniqueId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.uniqueId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(report.reportStatus)}`}>
                        {report.reportStatus}
                      </span>
                      {report.errorMessage && (
                        <div className="text-xs text-red-600 mt-1">{report.errorMessage}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {report.reportUrl && report.reportStatus === 'generated' && (
                        <button
                          onClick={() => downloadReport(report.reportUrl!, report.uniqueId)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Bulk Report Generation Instructions</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Individual Reports:</strong> Generates separate PDF files for each person with their unique ID</li>
            <li>• <strong>Consolidated Report:</strong> Creates one PDF containing all nutrition analyses</li>
            <li>• <strong>Unique ID Tracking:</strong> Each report is tagged with the person's unique identifier</li>
            <li>• <strong>Bulk Download:</strong> Download all generated reports at once</li>
            <li>• <strong>Summary Export:</strong> Export CSV summary for HR/admin tracking</li>
            <li>• <strong>Error Handling:</strong> Failed reports are clearly marked with error messages</li>
            <li>• <strong>Organization Branding:</strong> All reports include your organization's branding</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulkReportGenerator;

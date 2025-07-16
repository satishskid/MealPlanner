import jsPDF from 'jspdf';
import { OrganizationProfile, PatientCase, PDFReportConfig, NutritionistProfile } from '../types';

export interface PDFGenerationOptions {
  organization: OrganizationProfile;
  patientCase: PatientCase;
  nutritionist?: NutritionistProfile;
  config?: PDFReportConfig;
  includeDigitalSignature?: boolean;
}

export class PDFReportService {
  private static instance: PDFReportService;
  
  public static getInstance(): PDFReportService {
    if (!PDFReportService.instance) {
      PDFReportService.instance = new PDFReportService();
    }
    return PDFReportService.instance;
  }

  private constructor() {}

  public async generateProfessionalReport(options: PDFGenerationOptions): Promise<Blob> {
    const { organization, patientCase, nutritionist, config } = options;
    
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up document properties
    pdf.setProperties({
      title: `Nutrition Analysis Report - ${patientCase.patientName || patientCase.patientEmail}`,
      subject: 'Professional Nutrition Analysis',
      author: organization.name,
      creator: 'NutreeAI Platform',
      keywords: 'nutrition, analysis, health, diet'
    });

    let yPosition = 20;

    // Add header with organization branding
    yPosition = this.addHeader(pdf, organization, yPosition);
    
    // Add patient information
    yPosition = this.addPatientInfo(pdf, patientCase, yPosition);
    
    // Add food log section
    yPosition = this.addFoodLogSection(pdf, patientCase, yPosition);
    
    // Add AI analysis section
    yPosition = this.addAIAnalysisSection(pdf, patientCase, yPosition);
    
    // Add professional review section
    if (patientCase.nutritionistReview) {
      yPosition = this.addProfessionalReviewSection(pdf, patientCase, nutritionist, yPosition);
    }
    
    // Add recommendations section
    yPosition = this.addRecommendationsSection(pdf, patientCase, yPosition);
    
    // Add disclaimer
    yPosition = this.addDisclaimer(pdf, organization, yPosition);
    
    // Add footer with organization branding
    this.addFooter(pdf, organization, config);
    
    // Add digital signature if required
    if (options.includeDigitalSignature && nutritionist) {
      this.addDigitalSignature(pdf, nutritionist, yPosition);
    }

    // Return PDF as blob
    return pdf.output('blob');
  }

  private addHeader(pdf: jsPDF, organization: OrganizationProfile, yPosition: number): number {
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Organization name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text(organization.name, 20, yPosition);
    
    // Report title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Professional Nutrition Analysis Report', 20, yPosition + 10);
    
    // Date
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    const currentDate = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${currentDate}`, pageWidth - 60, yPosition);
    
    // Add line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition + 15, pageWidth - 20, yPosition + 15);
    
    return yPosition + 25;
  }

  private addPatientInfo(pdf: jsPDF, patientCase: PatientCase, yPosition: number): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Patient Information', 20, yPosition);
    
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const patientInfo = [
      `Patient ID: ${patientCase.id}`,
      `Name: ${patientCase.patientName || 'Not provided'}`,
      `Email: ${patientCase.patientEmail}`,
      `Age Group: ${patientCase.userProfile.ageGroup}`,
      `Cuisine Preference: ${patientCase.userProfile.cuisinePreference}`,
      `Submission Date: ${new Date(patientCase.createdAt).toLocaleDateString()}`,
      `Review Date: ${patientCase.reviewedAt ? new Date(patientCase.reviewedAt).toLocaleDateString() : 'Pending'}`
    ];
    
    patientInfo.forEach((info, index) => {
      pdf.text(info, 25, yPosition + (index * 5));
    });
    
    return yPosition + (patientInfo.length * 5) + 10;
  }

  private addFoodLogSection(pdf: jsPDF, patientCase: PatientCase, yPosition: number): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Daily Food Log', 20, yPosition);
    
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const meals = [
      { label: 'Breakfast', value: this.getFoodLogText(patientCase.dailyFoodLog.breakfast) },
      { label: 'Lunch', value: this.getFoodLogText(patientCase.dailyFoodLog.lunch) },
      { label: 'Dinner', value: this.getFoodLogText(patientCase.dailyFoodLog.dinner) },
      { label: 'Snacks', value: this.getFoodLogText(patientCase.dailyFoodLog.snacks) }
    ];
    
    meals.forEach((meal, index) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${meal.label}:`, 25, yPosition + (index * 10));
      pdf.setFont('helvetica', 'normal');
      const wrappedText = pdf.splitTextToSize(meal.value || 'Not specified', 150);
      pdf.text(wrappedText, 25, yPosition + (index * 10) + 4);
    });
    
    return yPosition + (meals.length * 10) + 10;
  }

  private addAIAnalysisSection(pdf: jsPDF, patientCase: PatientCase, yPosition: number): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('AI Nutritional Analysis', 20, yPosition);
    
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    // Total calories
    pdf.setFont('helvetica', 'bold');
    pdf.text('Estimated Total Calories:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(patientCase.aiAnalysis.totalEstimatedCalories, 80, yPosition);
    
    yPosition += 8;
    
    // Quality assessment
    pdf.setFont('helvetica', 'bold');
    pdf.text('Quality Assessment:', 25, yPosition);
    yPosition += 4;
    pdf.setFont('helvetica', 'normal');
    const qualityText = pdf.splitTextToSize(patientCase.aiAnalysis.qualityAssessment, 160);
    pdf.text(qualityText, 25, yPosition);
    yPosition += qualityText.length * 4 + 5;
    
    // Meal breakdown
    if (patientCase.aiAnalysis.mealBreakdown && patientCase.aiAnalysis.mealBreakdown.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Detailed Meal Analysis:', 25, yPosition);
      yPosition += 6;
      
      patientCase.aiAnalysis.mealBreakdown.forEach((meal) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${meal.meal}:`, 30, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(meal.estimatedCalories || 'N/A', 150, yPosition);
        yPosition += 4;
        
        if (meal.items) {
          const itemsText = pdf.splitTextToSize(meal.items, 150);
          pdf.text(itemsText, 35, yPosition);
          yPosition += itemsText.length * 3;
        }
        
        if (meal.notes) {
          const notesText = pdf.splitTextToSize(meal.notes, 150);
          pdf.setTextColor(100, 100, 100);
          pdf.text(notesText, 35, yPosition);
          pdf.setTextColor(60, 60, 60);
          yPosition += notesText.length * 3;
        }
        
        yPosition += 3;
      });
    }
    
    return yPosition + 10;
  }

  private addProfessionalReviewSection(pdf: jsPDF, patientCase: PatientCase, nutritionist: NutritionistProfile | undefined, yPosition: number): number {
    if (!patientCase.nutritionistReview) return yPosition;
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Professional Review', 20, yPosition);
    
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    // Nutritionist info
    pdf.setFont('helvetica', 'bold');
    pdf.text('Reviewed by:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${patientCase.nutritionistReview.nutritionistName}`, 60, yPosition);
    
    if (nutritionist) {
      pdf.text(`${nutritionist.credentials}`, 120, yPosition);
    }
    
    yPosition += 6;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Review Date:', 25, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(patientCase.nutritionistReview.reviewDate).toLocaleDateString(), 60, yPosition);
    
    yPosition += 10;
    
    // Professional notes
    if (patientCase.nutritionistReview.professionalNotes) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Professional Notes:', 25, yPosition);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      const notesText = pdf.splitTextToSize(patientCase.nutritionistReview.professionalNotes, 160);
      pdf.text(notesText, 25, yPosition);
      yPosition += notesText.length * 4 + 5;
    }
    
    return yPosition + 10;
  }

  private addRecommendationsSection(pdf: jsPDF, patientCase: PatientCase, yPosition: number): number {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Recommendations', 20, yPosition);
    
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    // Use modified recommendations if available, otherwise use original AI recommendations
    const recommendations = patientCase.nutritionistReview?.modifiedAnalysis?.generalRecommendations 
      || patientCase.aiAnalysis.generalRecommendations;
    
    const motivationalMessage = patientCase.nutritionistReview?.modifiedAnalysis?.motivationalMessage 
      || patientCase.aiAnalysis.motivationalMessage;
    
    const educativeTip = patientCase.nutritionistReview?.modifiedAnalysis?.educativeTip 
      || patientCase.aiAnalysis.educativeTip;
    
    if (recommendations) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('General Recommendations:', 25, yPosition);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      const recText = pdf.splitTextToSize(recommendations, 160);
      pdf.text(recText, 25, yPosition);
      yPosition += recText.length * 4 + 8;
    }
    
    if (motivationalMessage) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Motivational Message:', 25, yPosition);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      const motText = pdf.splitTextToSize(motivationalMessage, 160);
      pdf.text(motText, 25, yPosition);
      yPosition += motText.length * 4 + 8;
    }
    
    if (educativeTip) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Educational Tip:', 25, yPosition);
      yPosition += 4;
      pdf.setFont('helvetica', 'normal');
      const eduText = pdf.splitTextToSize(educativeTip, 160);
      pdf.text(eduText, 25, yPosition);
      yPosition += eduText.length * 4 + 8;
    }
    
    return yPosition + 10;
  }

  private addDisclaimer(pdf: jsPDF, organization: OrganizationProfile, yPosition: number): number {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Important Disclaimer', 20, yPosition);
    
    yPosition += 8;
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    
    const disclaimer = `This nutrition analysis is provided for informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary changes. The analysis is based on the food information provided and general nutritional guidelines. Individual nutritional needs may vary based on health conditions, medications, and other factors. ${organization.name} and its nutritionists are not responsible for any adverse effects or consequences resulting from the use of this information.`;
    
    const disclaimerText = pdf.splitTextToSize(disclaimer, 170);
    pdf.text(disclaimerText, 20, yPosition);
    
    return yPosition + disclaimerText.length * 3 + 10;
  }

  private addFooter(pdf: jsPDF, organization: OrganizationProfile, config?: PDFReportConfig): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Add line separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    
    // Organization info
    pdf.text(organization.name, 20, pageHeight - 15);
    pdf.text(organization.contactInfo.email, 20, pageHeight - 10);
    
    // Page number
    pdf.text(`Page 1`, pageWidth - 30, pageHeight - 15);
    
    // Powered by (if not hidden)
    if (!config?.branding.includeLogo) {
      pdf.text('Powered by NutreeAI', pageWidth - 50, pageHeight - 10);
    }
  }

  private addDigitalSignature(pdf: jsPDF, nutritionist: NutritionistProfile, yPosition: number): void {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 40, 40);
    pdf.text('Digital Signature', 20, yPosition);
    
    yPosition += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Digitally signed by: ${nutritionist.name}, ${nutritionist.credentials}`, 25, yPosition);
    pdf.text(`License: ${nutritionist.licenseNumber || 'N/A'}`, 25, yPosition + 5);
    pdf.text(`Timestamp: ${new Date().toISOString()}`, 25, yPosition + 10);
  }

  private getFoodLogText(meal: string | any): string {
    if (typeof meal === 'string') {
      return meal;
    }
    if (meal && typeof meal === 'object' && meal.rawText) {
      return meal.rawText;
    }
    return 'Not specified';
  }

  public async generateBulkReports(cases: PatientCase[], organization: OrganizationProfile): Promise<Blob> {
    // Create a zip file containing multiple PDF reports
    // This would require additional libraries like JSZip
    // For now, we'll generate a single PDF with all cases
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.setProperties({
      title: `Bulk Nutrition Reports - ${organization.name}`,
      subject: 'Bulk Professional Nutrition Analysis',
      author: organization.name,
      creator: 'NutreeAI Platform'
    });

    // Add cover page
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bulk Nutrition Analysis Report', 20, 30);
    pdf.setFontSize(14);
    pdf.text(`${organization.name}`, 20, 45);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    pdf.text(`Total Cases: ${cases.length}`, 20, 65);

    // Add summary statistics
    let yPos = 80;
    pdf.setFontSize(14);
    pdf.text('Summary Statistics', 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(10);
    const completedCases = cases.filter(c => c.status === 'reviewed').length;
    const pendingCases = cases.filter(c => c.status !== 'reviewed').length;
    
    pdf.text(`Completed Cases: ${completedCases}`, 25, yPos);
    pdf.text(`Pending Cases: ${pendingCases}`, 25, yPos + 5);
    
    // Note: In a real implementation, you would generate individual PDFs
    // and combine them or create a proper multi-page report
    
    return pdf.output('blob');
  }
}

export const pdfReportService = PDFReportService.getInstance();

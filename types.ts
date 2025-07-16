
export interface CalorieInfo {
  foodName: string;
  calories: number | string;
  servingSize: string;
  macronutrients?: {
    protein?: string;
    carbohydrates?: string;
    fat?: string;
  };
  description?: string;
  nuances?: string;
  positives?: string; // "What's good about it"
  healthyTips?: string; // "How to make it healthy"
  notes?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Add other types of chunks if necessary, e.g., retrievedContext
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields if present
}

// New types for Daily Meal Planner
export type AppMode = 'singleChecker' | 'dailyPlanner';
export type UserRole = 'patient' | 'nutritionist' | 'admin';
export type NutritionistSpecialization = 'clinical' | 'sports' | 'pediatric' | 'geriatric' | 'weight_management' | 'diabetes' | 'cultural_cuisine' | 'general';
export type CaseStatus = 'submitted' | 'assigned' | 'under_review' | 'reviewed' | 'delivered' | 'escalated';
export type CasePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface UserProfile {
  ageGroup: string;
  cuisinePreference: string;
}

export interface FoodItem {
  name: string;
  operator?: 'AND' | 'OR';
}

export interface MealEntry {
  items: FoodItem[];
  rawText: string; // For backward compatibility and display
}

export interface DailyFoodLog {
  breakfast: string | MealEntry;
  lunch: string | MealEntry;
  dinner: string | MealEntry;
  snacks: string | MealEntry;
}

export interface MealBreakdown {
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  items: string; // Gemini's interpretation of items
  estimatedCalories?: string; // Optional: Gemini might provide this
  notes?: string; // Optional: Gemini's notes on this meal
}

export interface DailyMealAnalysis {
  totalEstimatedCalories: string;
  qualityAssessment: string;
  mealBreakdown: MealBreakdown[];
  generalRecommendations?: string;
  motivationalMessage?: string; // New: For culturally relevant motivation
  educativeTip?: string; // New: For a relevant educative tip
}

// Detailed Meal Plan Structure
export interface MealItem {
  name: string; // e.g., "Idli with Sambar"
  portionSuggestion?: string; // e.g., "2 medium idlis, 1 bowl sambar"
  alternatives?: string[]; // e.g., ["Dosa with chutney", "Poha"]
}

export interface MealTime {
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
}

export interface MealPlan {
  planName: string;
  description: string;
  dailyMeals: MealTime; // Replaces the simpler meals object
  weeklyVarietyNotes?: string; // Tips from Gemini on how to vary this over a week
  benefits: string;
  nuances: string;
}


export interface NutritionistViewData {
  userProfile: UserProfile;
  dailyFoodLog: DailyFoodLog;
  dailyMealAnalysis: DailyMealAnalysis;
}

// For User-Side Adherence Tracking
export interface DailyAdherence {
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  snacks?: boolean;
}

export interface AdherenceLog {
  [date: string]: DailyAdherence; // Date string e.g., "YYYY-MM-DD"
}

// Settings Panel Types
export interface DoctorProfile {
  name: string;
  specialization: string;
  contact: string;
}

export interface ThemeOption {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryText: string;
    accent: string;
    accentHover: string;
    accentText: string;
    headerBg: string;
    headerText: string;
    buttonSecondaryBg: string;
    buttonSecondaryText: string;
    buttonSecondaryHoverBg: string;
    developerCreditColor: string;
  };
}

export interface AppSettings {
  clinicName: string;
  themeName: string; // Name of the selected theme (e.g., "defaultGreen")
  doctorProfile: DoctorProfile;
  apiKeys: { // For UI demonstration only
    geminiEnvDisplay: string; // To show it comes from env
    alt1: string;
    alt2: string;
  };
  mcpServerUrl: string;
}

// Enhanced Nutritionist Profile
export interface NutritionistProfile {
  id: string;
  name: string;
  email: string;
  credentials: string; // e.g., "RD, MS", "PhD in Nutrition"
  specializations: NutritionistSpecialization[];
  licenseNumber?: string;
  yearsOfExperience: number;
  languages: string[];
  culturalExpertise: string[]; // e.g., ["North Indian", "Mediterranean", "Vegan"]
  maxCasesPerDay: number;
  currentCaseLoad: number;
  isActive: boolean;
  isAvailable: boolean;
  timezone: string;
  workingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
    days: string[]; // ["Monday", "Tuesday", ...]
  };
  rating: number; // 1-5 stars
  totalCasesCompleted: number;
  averageReviewTime: number; // in hours
  createdAt: string;
  lastActiveAt: string;
  bio?: string;
  profileImage?: string;
}

export interface NutritionistReview {
  nutritionistId: string;
  nutritionistName: string;
  reviewDate: string;
  professionalNotes: string;
  recommendations: string;
  approvalStatus: 'approved' | 'modified' | 'needs_revision';
  modifiedAnalysis?: Partial<DailyMealAnalysis>;
}

export interface PatientCase {
  id: string;
  patientEmail: string;
  patientName?: string;
  organizationId?: string; // For bulk uploads
  userProfile: UserProfile;
  dailyFoodLog: DailyFoodLog;
  aiAnalysis: DailyMealAnalysis;
  nutritionistReview?: NutritionistReview;
  assignedNutritionistId?: string;
  assignedAt?: string;
  createdAt: string;
  reviewedAt?: string;
  deliveredAt?: string;
  status: CaseStatus;
  priority: CasePriority;
  estimatedReviewTime?: number; // in hours
  actualReviewTime?: number; // in hours
  escalationReason?: string;
  tags?: string[];
}

export interface BulkUploadData {
  organizationName: string;
  contactEmail: string;
  uploadDate: string;
  totalCases: number;
  processedCases: number;
  cases: PatientCase[];
}

export interface PatientStatus {
  caseId: string;
  status: CaseStatus;
  submittedAt: string;
  estimatedReviewTime?: string;
  nutritionistAssigned?: string;
}

// Admin Management Types
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager';
  permissions: AdminPermission[];
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

export type AdminPermission =
  | 'manage_nutritionists'
  | 'manage_patients'
  | 'view_analytics'
  | 'manage_assignments'
  | 'system_settings'
  | 'bulk_operations'
  | 'financial_reports'
  | 'audit_logs';

// Assignment Algorithm Types
export interface AssignmentCriteria {
  specialization?: NutritionistSpecialization;
  culturalExpertise?: string;
  language?: string;
  maxCaseLoad?: number;
  priority?: CasePriority;
  timezone?: string;
}

export interface AssignmentResult {
  nutritionistId: string;
  score: number;
  reason: string;
  estimatedReviewTime: number;
}

// System Analytics Types
export interface SystemAnalytics {
  totalPatients: number;
  totalNutritionists: number;
  totalCases: number;
  casesThisMonth: number;
  averageReviewTime: number;
  nutritionistUtilization: number;
  patientSatisfaction: number;
  casesByStatus: Record<CaseStatus, number>;
  casesByPriority: Record<CasePriority, number>;
  topPerformingNutritionists: NutritionistPerformance[];
  revenueMetrics?: RevenueMetrics;
}

export interface NutritionistPerformance {
  nutritionistId: string;
  name: string;
  casesCompleted: number;
  averageRating: number;
  averageReviewTime: number;
  utilizationRate: number;
}

export interface RevenueMetrics {
  monthlyRevenue: number;
  revenuePerCase: number;
  projectedRevenue: number;
  paymentsPending: number;
}

// Notification Types
export interface NotificationTemplate {
  id: string;
  type: 'case_assigned' | 'case_completed' | 'case_escalated' | 'reminder' | 'welcome';
  channel: 'email' | 'sms' | 'in_app';
  subject: string;
  template: string;
  variables: string[];
}

export interface Notification {
  id: string;
  recipientId: string;
  recipientType: UserRole;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
}

// Audit and Compliance Types
export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
}

export interface ComplianceReport {
  id: string;
  type: 'hipaa' | 'gdpr' | 'data_retention' | 'security_audit';
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  findings: ComplianceFinding[];
  status: 'compliant' | 'issues_found' | 'critical';
}

export interface ComplianceFinding {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  recommendation: string;
  affectedRecords?: number;
}

// Multi-Tenant B2B Platform Types
export type OrganizationType = 'clinic' | 'hospital' | 'wellness_center' | 'school' | 'corporate' | 'telehealth' | 'research';
export type NutritionistAssignmentModel = 'in_house' | 'nutreeai_provided' | 'hybrid';
export type BillingModel = 'per_case' | 'monthly_subscription' | 'annual_contract' | 'custom';

export interface OrganizationProfile {
  id: string;
  name: string;
  type: OrganizationType;
  subdomain: string; // e.g., 'clinic-name' for clinic-name.nutreeai.com
  customDomain?: string; // e.g., 'nutrition.clinicname.com'
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily?: string;
    customCSS?: string;
    welcomeMessage?: string;
    footerText?: string;
  };
  settings: {
    nutritionistAssignmentModel: NutritionistAssignmentModel;
    maxPatientsPerMonth: number;
    allowBulkUploads: boolean;
    requirePatientConsent: boolean;
    enableCustomReports: boolean;
    autoAssignCases: boolean;
    escalationThresholdHours: number;
  };
  billing: {
    model: BillingModel;
    pricePerCase?: number;
    monthlyFee?: number;
    contractStartDate?: string;
    contractEndDate?: string;
    billingContact: string;
    paymentMethod?: string;
  };
  isActive: boolean;
  createdAt: string;
  lastActiveAt: string;
  totalCasesProcessed: number;
  currentMonthCases: number;
}

export interface OrganizationAdmin {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: 'org_admin' | 'org_manager' | 'org_viewer';
  permissions: OrganizationPermission[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type OrganizationPermission =
  | 'manage_nutritionists'
  | 'view_cases'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_billing'
  | 'export_data'
  | 'manage_users';

export interface OrganizationNutritionist extends NutritionistProfile {
  organizationId: string;
  employeeId?: string;
  isInHouse: boolean;
  canHandleExternalCases: boolean; // For hybrid model
  organizationRole?: string; // e.g., "Senior Clinical Nutritionist"
  supervisorId?: string;
}

export interface OrganizationCase extends PatientCase {
  organizationId: string;
  patientOrganizationId?: string; // For tracking patient's organization affiliation
  assignmentModel: NutritionistAssignmentModel;
  billingStatus: 'pending' | 'billed' | 'paid' | 'disputed';
  escalatedToNutreeAI?: boolean; // For hybrid model escalations
  organizationNotes?: string;
  complianceFlags?: string[];
}

export interface WhiteLabelConfig {
  organizationId: string;
  domain: string;
  branding: OrganizationProfile['branding'];
  customizations: {
    hideNutreeAIBranding: boolean;
    customTermsOfService?: string;
    customPrivacyPolicy?: string;
    customSupportContact?: string;
    enableCustomAnalytics?: boolean;
    googleAnalyticsId?: string;
  };
  features: {
    enableAdvancedFoodInput: boolean;
    enableBulkUpload: boolean;
    enableAPIAccess: boolean;
    enableCustomReports: boolean;
    enableMobileApp: boolean;
  };
}

export interface OrganizationAnalytics {
  organizationId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalCases: number;
    completedCases: number;
    averageReviewTime: number;
    patientSatisfactionScore: number;
    nutritionistUtilization: number;
    costPerCase: number;
    revenue: number;
  };
  casesByStatus: Record<CaseStatus, number>;
  casesByPriority: Record<CasePriority, number>;
  nutritionistPerformance: NutritionistPerformance[];
  patientDemographics: {
    ageGroups: Record<string, number>;
    cuisinePreferences: Record<string, number>;
    geographicDistribution: Record<string, number>;
  };
}

export interface PDFReportConfig {
  organizationId: string;
  template: 'standard' | 'clinical' | 'wellness' | 'research' | 'custom';
  branding: {
    includeLogo: boolean;
    headerText?: string;
    footerText?: string;
    watermark?: string;
  };
  sections: {
    includePatientInfo: boolean;
    includeFoodLog: boolean;
    includeAIAnalysis: boolean;
    includeProfessionalNotes: boolean;
    includeRecommendations: boolean;
    includeDisclaimer: boolean;
    customSections?: PDFCustomSection[];
  };
  signatures: {
    requireNutritionistSignature: boolean;
    requirePatientAcknowledgment: boolean;
    includeDigitalTimestamp: boolean;
  };
}

export interface PDFCustomSection {
  id: string;
  title: string;
  content: string;
  position: number;
  isRequired: boolean;
}

export interface APIIntegration {
  organizationId: string;
  apiKey: string;
  webhookUrl?: string;
  allowedEndpoints: string[];
  rateLimit: number; // requests per hour
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usage: {
    totalRequests: number;
    monthlyRequests: number;
    errorRate: number;
  };
}

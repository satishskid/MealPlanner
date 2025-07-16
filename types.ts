
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

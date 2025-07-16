
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
export type UserRole = 'patient' | 'nutritionist';

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

// Nutritionist-specific types
export interface NutritionistProfile {
  id: string;
  name: string;
  credentials: string; // e.g., "RD, MS", "PhD in Nutrition"
  specialization: string; // e.g., "Clinical Nutrition", "Sports Nutrition"
  licenseNumber?: string;
  yearsOfExperience: number;
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
  createdAt: string;
  reviewedAt?: string;
  status: 'submitted' | 'under_review' | 'reviewed' | 'delivered';
  priority: 'normal' | 'urgent';
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
  status: 'submitted' | 'under_review' | 'reviewed' | 'delivered';
  submittedAt: string;
  estimatedReviewTime?: string;
  nutritionistAssigned?: string;
}

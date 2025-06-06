
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

export interface UserProfile {
  ageGroup: string;
  cuisinePreference: string;
}

export interface DailyFoodLog {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
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

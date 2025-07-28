// B2B SaaS Platform Types for Healthcare Providers

export type UserRole = 'provider' | 'admin' | 'super_admin';
export type ProviderType = 'doctor' | 'nutritionist' | 'clinic' | 'hospital' | 'wellness_center';
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise' | 'custom';
export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled' | 'trial' | 'overdue';
export type PatientReportStatus = 'draft' | 'generated' | 'reviewed' | 'shared' | 'delivered';
export type BatchProcessStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial_success';

// Provider Profile
export interface ProviderProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  providerType: ProviderType;
  licenseNumber?: string;
  specialization?: string[];
  organizationName: string;
  organizationAddress: string;
  phone: string;
  website?: string;
  
  // Subscription Details
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: string;
    nextBillingDate: string;
    monthlyLimit: number;
    usedThisMonth: number;
    features: string[];
  };
  
  // Settings
  settings: {
    defaultReportTemplate: string;
    autoShareReports: boolean;
    allowBatchProcessing: boolean;
    emailNotifications: boolean;
    brandingEnabled: boolean;
    customDomain?: string;
  };
  
  // Metadata
  createdAt: string;
  lastLoginAt: string;
  isVerified: boolean;
  isActive: boolean;
}

// Patient Record (managed by providers)
export interface PatientRecord {
  id: string;
  providerId: string;
  
  // Patient Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  
  // Medical Info
  height?: number; // cm
  weight?: number; // kg
  medicalConditions?: string[];
  allergies?: string[];
  medications?: string[];
  dietaryRestrictions?: string[];
  goals?: string[];
  
  // Nutrition Profile
  ageGroup: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  cuisinePreference: string;
  
  // Food Log
  dailyFoodLog: DailyFoodLog;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  notes?: string;
}

// Food Logging
export interface FoodItem {
  name: string;
  quantity?: string;
  operator?: 'AND' | 'OR';
}

export interface MealEntry {
  items: FoodItem[];
  notes?: string;
}

export interface DailyFoodLog {
  breakfast: MealEntry;
  lunch: MealEntry;
  dinner: MealEntry;
  snacks: MealEntry;
  date?: string;
}

// AI Analysis Results
export interface NutritionAnalysis {
  calories: {
    total: number;
    breakdown: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snacks: number;
    };
  };
  macronutrients: {
    protein: { grams: number; percentage: number; };
    carbohydrates: { grams: number; percentage: number; };
    fat: { grams: number; percentage: number; };
    fiber: { grams: number; };
  };
  micronutrients: {
    vitamins: { [key: string]: { amount: number; unit: string; dailyValue: number; }; };
    minerals: { [key: string]: { amount: number; unit: string; dailyValue: number; }; };
  };
  recommendations: string[];
  concerns: string[];
  culturalContext: string;
  summary: string;
}

// Patient Report
export interface PatientReport {
  id: string;
  patientId: string;
  providerId: string;
  
  // Report Content
  title: string;
  analysis: NutritionAnalysis;
  providerNotes: string;
  recommendations: string[];
  actionPlan: string[];
  followUpDate?: string;
  
  // Report Status
  status: PatientReportStatus;
  generatedAt: string;
  reviewedAt?: string;
  sharedAt?: string;
  
  // Sharing
  shareableLink?: string;
  linkExpiresAt?: string;
  accessPassword?: string;
  viewCount: number;
  
  // Customization
  template: string;
  branding: {
    providerLogo?: string;
    providerName: string;
    providerContact: string;
    customColors?: {
      primary: string;
      secondary: string;
    };
  };
}

// Batch Processing
export interface BatchAnalysisJob {
  id: string;
  providerId: string;
  
  // Job Details
  name: string;
  description?: string;
  totalPatients: number;
  processedPatients: number;
  failedPatients: number;
  
  // Status
  status: BatchProcessStatus;
  startedAt: string;
  completedAt?: string;
  estimatedDuration?: number;
  
  // Results
  results: PatientReport[];
  errors: string[];
  
  // Settings
  settings: {
    autoGenerate: boolean;
    autoShare: boolean;
    template: string;
    notification: boolean;
  };
}

// Admin Dashboard Data
export interface AdminDashboardData {
  // Provider Analytics
  totalProviders: number;
  activeProviders: number;
  newProvidersThisMonth: number;
  
  // Usage Analytics
  totalAnalyses: number;
  analysesThisMonth: number;
  averageAnalysesPerProvider: number;
  
  // Revenue Analytics
  monthlyRevenue: number;
  yearlyRevenue: number;
  revenueGrowth: number;
  
  // System Health
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
  
  // Recent Activity
  recentProviders: ProviderProfile[];
  recentReports: PatientReport[];
  recentJobs: BatchAnalysisJob[];
}

// Provider Analytics
export interface ProviderAnalytics {
  providerId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  
  // Usage Stats
  totalPatients: number;
  totalReports: number;
  totalAnalyses: number;
  averageReportsPerDay: number;
  
  // Patient Demographics
  patientAgeGroups: { [key: string]: number; };
  commonConditions: { [key: string]: number; };
  cuisinePreferences: { [key: string]: number; };
  
  // Report Stats
  reportsByStatus: { [key in PatientReportStatus]: number; };
  averageReviewTime: number; // in minutes
  shareRate: number; // percentage of reports shared
  
  // Performance
  patientSatisfactionScore?: number;
  reportAccuracyScore?: number;
  responseTime: number; // average time to complete analysis
}

// Subscription and Billing
export interface BillingInfo {
  providerId: string;
  currentPlan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  lastPaymentDate: string;
  
  // Usage
  currentPeriodUsage: number;
  planLimit: number;
  overageCharges: number;
  
  // Payment
  paymentMethod: {
    type: 'card' | 'bank' | 'invoice';
    last4?: string;
    expiryDate?: string;
  };
  
  // History
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  downloadUrl: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Shared Link for Patient Reports
export interface SharedReportLink {
  id: string;
  reportId: string;
  providerId: string;
  patientId: string;
  
  // Link Details
  url: string;
  accessToken: string;
  password?: string;
  expiresAt: string;
  
  // Access Control
  maxViews?: number;
  currentViews: number;
  allowDownload: boolean;
  allowPrint: boolean;
  
  // Tracking
  viewHistory: {
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
  }[];
  
  // Status
  isActive: boolean;
  createdAt: string;
}

// Notification Types
export interface NotificationPreferences {
  providerId: string;
  
  email: {
    reportGenerated: boolean;
    batchCompleted: boolean;
    paymentDue: boolean;
    systemUpdates: boolean;
    patientShared: boolean;
  };
  
  inApp: {
    reportGenerated: boolean;
    batchCompleted: boolean;
    systemAlerts: boolean;
    usageLimits: boolean;
  };
  
  sms?: {
    urgentAlerts: boolean;
    paymentFailed: boolean;
  };
}

// Legacy types that might still be needed
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
  positives?: string;
  healthyTips?: string;
  notes?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

// App Settings
export interface AppSettings {
  themeName: string;
  clinicName: string;
  apiKeys: {
    geminiEnvDisplay: string;
  };
}

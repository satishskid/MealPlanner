
import { AppSettings, ThemeOption } from "./types";

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const API_KEY_CHECK_MSG = "Checking for API Key...";
export const API_KEY_MISSING_MSG = "API_KEY environment variable is not set. Please configure it to use the app.";
export const API_KEY_PRESENT_MSG = "API Key found. Ready to use.";
export const APP_TITLE = "Skids Diet Planner"; // Updated
export const POWERED_BY_AI = "powered by AI";
export const DEVELOPER_CREDIT = "developed by greybrain.ai";
export const FOOTER_TEXT = `© ${new Date().getFullYear()} ${APP_TITLE}. ${POWERED_BY_AI}.`;


export const AGE_GROUPS = ["Child (5-12)", "Teenager (13-19)", "Adult (20-39)", "Adult (40-59)", "Senior (60+)"];
export const CUISINE_PREFERENCES = ["North Indian", "South Indian", "East Indian", "West Indian", "Mixed/General Indian", "Other"];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    name: 'defaultGreen',
    displayName: 'Default Green',
    colors: {
      primary: '#10B981', primaryHover: '#059669', primaryText: '#FFFFFF',
      accent: '#3B82F6', accentHover: '#2563EB', accentText: '#FFFFFF',
      headerBg: '#FFFFFF', headerText: '#374151',
      buttonSecondaryBg: '#FFFFFF', buttonSecondaryText: '#3B82F6', buttonSecondaryHoverBg: '#EFF6FF',
      developerCreditColor: '#A0AEC0', // Slate 400
    }
  },
  {
    name: 'oceanBlue',
    displayName: 'Ocean Blue',
    colors: {
      primary: '#0EA5E9', primaryHover: '#0284C7', primaryText: '#FFFFFF',
      accent: '#EC4899', accentHover: '#DB2777', accentText: '#FFFFFF',
      headerBg: '#F0F9FF', headerText: '#075985',
      buttonSecondaryBg: '#FFFFFF', buttonSecondaryText: '#0EA5E9', buttonSecondaryHoverBg: '#E0F2FE',
      developerCreditColor: '#94A3B8', // Slate 500
    }
  },
  {
    name: 'sunsetOrange',
    displayName: 'Sunset Orange',
    colors: {
      primary: '#F97316', primaryHover: '#EA580C', primaryText: '#FFFFFF',
      accent: '#8B5CF6', accentHover: '#7C3AED', accentText: '#FFFFFF',
      headerBg: '#FFF7ED', headerText: '#7C2D12',
      buttonSecondaryBg: '#FFFFFF', buttonSecondaryText: '#F97316', buttonSecondaryHoverBg: '#FFF7ED',
      developerCreditColor: '#A16207', // Amber 600 for darker bg
    }
  },
  {
    name: 'charcoalGrace',
    displayName: 'Charcoal Grace',
    colors: {
      primary: '#4A5568', // gray-700
      primaryHover: '#2D3748', // gray-800
      primaryText: '#FFFFFF',
      accent: '#E53E3E', // red-600
      accentHover: '#C53030', // red-700
      accentText: '#FFFFFF',
      headerBg: '#1A202C', // gray-900
      headerText: '#E2E8F0', // gray-200
      buttonSecondaryBg: '#2D3748', // gray-800
      buttonSecondaryText: '#E2E8F0', // gray-200
      buttonSecondaryHoverBg: '#4A5568', // gray-700
      developerCreditColor: '#718096', // gray-500
    }
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  clinicName: '',
  themeName: THEME_OPTIONS[0].name, // Default to the first theme
  doctorProfile: {
    name: '',
    specialization: '',
    contact: ''
  },
  apiKeys: {
    geminiEnvDisplay: 'Loaded from environment (recommended)',
    alt1: '',
    alt2: ''
  },
  mcpServerUrl: ''
};

export const LOCAL_STORAGE_SETTINGS_KEY = 'dietPlannerAppSettings';

import React, { useState, useEffect, useCallback } from 'react';
import netlifyIdentity, { User } from 'netlify-identity-widget';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import NutritionistLogin from './components/NutritionistLogin';
import NutritionistDashboard from './components/NutritionistDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import NutritionistManagement from './components/NutritionistManagement';
import AssignmentManagement from './components/AssignmentManagement';
import OrganizationRegistration from './components/OrganizationRegistration';
import OrganizationManagement from './components/OrganizationManagement';
import WhiteLabelPortal from './components/WhiteLabelPortal';
import BulkDataCollection from './components/BulkDataCollection';
import PatientStatusTracker from './components/PatientStatusTracker';
import ProfessionalReport from './components/ProfessionalReport';
import FoodInput from './components/FoodInput';
import CalorieDisplay from './components/CalorieDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import UserProfileInput from './components/UserProfileInput';
import DailyMealInput from './components/DailyMealInput';
import FlexibleMealInput from './components/FlexibleMealInput';
import DailyMealSummaryDisplay from './components/DailyMealSummaryDisplay';
import NutritionistView from './components/NutritionistView';
import ActiveMealPlanView from './components/ActiveMealPlanView';
import SettingsPanel from './components/SettingsPanel'; // Ensured relative path
import {
  CalorieInfo, GroundingMetadata, AppMode, UserRole, UserProfile, DailyFoodLog,
  DailyMealAnalysis, MealPlan, NutritionistViewData, AdherenceLog, DailyAdherence,
  AppSettings, NutritionistProfile, PatientCase, AdminProfile, OrganizationProfile, WhiteLabelConfig /*ThemeOption, DoctorProfile*/
} from './types';
import { fetchCalorieInfo, analyzeDailyIntake, suggestMealPlans } from './services/geminiService';
import { 
    API_KEY_CHECK_MSG, API_KEY_MISSING_MSG, API_KEY_PRESENT_MSG, 
    DEFAULT_SETTINGS, LOCAL_STORAGE_SETTINGS_KEY, THEME_OPTIONS,
    // APP_TITLE // Removed unused import
} from './constants';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // Get only the base64 part
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

interface SingleFoodSearchPayload {
  food?: string;
  imageFile?: File;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [nutritionist, setNutritionist] = useState<NutritionistProfile | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [showNutritionistLogin, setShowNutritionistLogin] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<'dashboard' | 'nutritionists' | 'assignments' | 'organizations'>('dashboard');
  const [showOrgRegistration, setShowOrgRegistration] = useState<boolean>(false);
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationProfile | null>(null);
  const [isWhiteLabel, setIsWhiteLabel] = useState<boolean>(false);
  const [showBulkCollection, setShowBulkCollection] = useState<boolean>(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<string>(API_KEY_CHECK_MSG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('dailyPlanner');

  // State for Single Food Checker
  const [calorieData, setCalorieData] = useState<CalorieInfo | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<GroundingMetadata | undefined>(undefined);

  // State for Daily Meal Planner
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyFoodLog, setDailyFoodLog] = useState<DailyFoodLog | null>(null);
  const [dailyMealAnalysis, setDailyMealAnalysis] = useState<DailyMealAnalysis | null>(null);
  const [showNutritionistView, setShowNutritionistView] = useState<boolean>(false);
  const [nutritionistData, setNutritionistData] = useState<NutritionistViewData | null>(null);
  const [suggestedMealPlans, setSuggestedMealPlans] = useState<MealPlan[] | null>(null);
  const [patientCondition, setPatientCondition] = useState<string>('');

  // State for selected meal plan and adherence
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [adherenceLog, setAdherenceLog] = useState<AdherenceLog>({});

  // State for Settings
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);

  // State for Patient Case Tracking
  const [currentPatientCase, setCurrentPatientCase] = useState<PatientCase | null>(null);
  const [showProfessionalReport, setShowProfessionalReport] = useState<boolean>(false);


  const applyTheme = useCallback((themeName: string) => {
    const theme = THEME_OPTIONS.find(t => t.name === themeName) || THEME_OPTIONS[0];
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        // Convert camelCase to kebab-case for CSS variables
        const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });
  }, []);
  
  useEffect(() => {
    // Load settings from localStorage
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings) as AppSettings;
        // Ensure API key display is always from env, not localStorage
        parsedSettings.apiKeys.geminiEnvDisplay = DEFAULT_SETTINGS.apiKeys.geminiEnvDisplay;
        setAppSettings(parsedSettings);
        applyTheme(parsedSettings.themeName);
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY); // Clear corrupted settings
        applyTheme(DEFAULT_SETTINGS.themeName); // Apply default theme
      }
    } else {
       applyTheme(DEFAULT_SETTINGS.themeName); // Apply default theme if nothing stored
    }

    if (process.env.API_KEY) {
      setApiKeyStatus(API_KEY_PRESENT_MSG);
    } else {
      setApiKeyStatus(API_KEY_MISSING_MSG);
      setError(API_KEY_MISSING_MSG); 
    }
  }, [applyTheme]);

  useEffect(() => {
    netlifyIdentity.init({});
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    const handleLoginInternal = (loggedInUser: User) => {
      setUser(loggedInUser);
      netlifyIdentity.close(); // Close the modal on login
    };

    const handleLogoutInternal = () => {
      setUser(null);
      // Reset app state on logout
      setUserProfile(null); 
      setDailyFoodLog(null);
      setDailyMealAnalysis(null);
      setSuggestedMealPlans(null);
      setSelectedMealPlan(null);
      setAdherenceLog({});
      setAppMode('dailyPlanner'); // Reset to default mode or last mode
      setError(null);
    };

    netlifyIdentity.on('login', handleLoginInternal);
    netlifyIdentity.on('logout', handleLogoutInternal);

    // Initial check for API key when component mounts, independent of user state
    if (process.env.API_KEY) {
      setApiKeyStatus(API_KEY_PRESENT_MSG);
    } else {
      setApiKeyStatus(API_KEY_MISSING_MSG);
      // Set an error only if no API key, this is a general app state, not tied to user login yet
      setError(API_KEY_MISSING_MSG);
    }

    return () => {
      netlifyIdentity.off('login', handleLoginInternal);
      netlifyIdentity.off('logout', handleLogoutInternal);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // Effect to manage API key related error message based on user presence
  useEffect(() => {
    if (user && !process.env.API_KEY) {
        setError(API_KEY_MISSING_MSG);
    } else if (user && process.env.API_KEY && error === API_KEY_MISSING_MSG) {
        // Clear API key error if user is logged in and key becomes available
        setError(null);
    } else if (!user && error === API_KEY_MISSING_MSG) {
        // If user logs out, the API key missing message might persist if it was set initially.
        // This ensures it's still shown if relevant, or cleared if not.
        // setError(null); // Or keep it if you want to always show it when no key, regardless of login
    }
  }, [user, error, apiKeyStatus]); // Re-run if user, error, or apiKeyStatus changes

  // Check for admin URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || window.location.pathname === '/admin') {
      setShowAdminLogin(true);
      setShowLandingPage(false);
    }

    // Check for organization subdomain or white-label portal
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== 'nutreeai.netlify.app' && hostname.includes('nutreeai.com')) {
      // Extract subdomain (e.g., 'clinic-name' from 'clinic-name.nutreeai.com')
      const subdomain = hostname.split('.')[0];
      // In a real implementation, you would fetch organization data from API
      // For demo, we'll simulate organization detection
      if (subdomain && subdomain !== 'www') {
        setIsWhiteLabel(true);
        setShowLandingPage(false);
        // Simulate loading organization data
        // setCurrentOrganization(fetchedOrgData);
      }
    }
  }, []);

  const openAuthModal = () => {
    netlifyIdentity.open(); // Opens the Netlify Identity modal for login/signup
  };

  const handleLogoutClick = () => {
    netlifyIdentity.logout();
  };

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  const handleNutritionistLogin = (nutritionistProfile: NutritionistProfile) => {
    setNutritionist(nutritionistProfile);
    setUserRole('nutritionist');
    setShowNutritionistLogin(false);
    setShowLandingPage(false);
  };

  const handleNutritionistLogout = () => {
    setNutritionist(null);
    setUserRole('patient');
    setShowLandingPage(true);
  };

  const handleSwitchToNutritionistLogin = () => {
    setShowNutritionistLogin(true);
    setShowLandingPage(false);
  };

  const handleBackToPatientPortal = () => {
    setShowNutritionistLogin(false);
    setShowLandingPage(true);
  };

  const handleAdminLogin = (adminProfile: AdminProfile) => {
    setAdmin(adminProfile);
    setUserRole('admin');
    setShowAdminLogin(false);
    setShowLandingPage(false);
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    setUserRole('patient');
    setShowLandingPage(true);
    setAdminView('dashboard');
  };

  const handleSwitchToAdminLogin = () => {
    setShowAdminLogin(true);
    setShowLandingPage(false);
  };

  const handleBackToMainFromAdmin = () => {
    setShowAdminLogin(false);
    setShowLandingPage(true);
  };

  const handleOrganizationRegistration = (organization: OrganizationProfile) => {
    // In a real implementation, this would save to backend
    console.log('Organization registered:', organization);
    setShowOrgRegistration(false);
    setShowLandingPage(true);
    // Show success message or redirect to organization portal
  };

  const handleShowOrgRegistration = () => {
    setShowOrgRegistration(true);
    setShowLandingPage(false);
  };

  const handleWhiteLabelPatientSubmission = (profile: UserProfile, foodLog: DailyFoodLog) => {
    // Handle patient submission in white-label context
    handleDailyLogSubmit(foodLog);
  };

  const handleBulkDataSubmission = async (entries: any[]) => {
    // Process bulk entries - in production, this would send to backend
    console.log('Bulk data submitted:', entries);

    // For demo, we'll simulate processing each entry
    for (const entry of entries) {
      const foodLog: DailyFoodLog = {
        breakfast: entry.breakfast,
        lunch: entry.lunch,
        dinner: entry.dinner,
        snacks: entry.snacks
      };

      // Process each entry through the AI analysis
      await handleDailyLogSubmit(foodLog);
    }

    return Promise.resolve();
  };

  const handleShowBulkCollection = () => {
    setShowBulkCollection(true);
    setShowLandingPage(false);
  };

  const handleViewProfessionalReport = () => {
    setShowProfessionalReport(true);
  };

  const handleCloseProfessionalReport = () => {
    setShowProfessionalReport(false);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    // Ensure API key display is always from env, not user input affecting this specific display
    newSettings.apiKeys.geminiEnvDisplay = DEFAULT_SETTINGS.apiKeys.geminiEnvDisplay;
    setAppSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
    applyTheme(newSettings.themeName);
    setShowSettingsPanel(false); // Close panel after saving
  };

  const commonApiCallStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const commonApiCallEnd = () => {
    setIsLoading(false);
  };
  
  const handleApiError = (err: unknown) => {
    let message = 'An unknown error occurred.';
    if (err instanceof Error) {
      message = err.message;
    }
    setError(message);
    console.error(message, err);
  }

  const handleSingleFoodSearch = useCallback(async (payload: SingleFoodSearchPayload) => {
    if (!process.env.API_KEY) { setError(API_KEY_MISSING_MSG); return; }
    const { food, imageFile } = payload;
    if (!food && !imageFile) { setError("Please enter a food item or upload an image."); return; }

    commonApiCallStart();
    setCalorieData(null);
    setGroundingMetadata(undefined);

    try {
      let apiPayload: { foodDescription?: string; image?: { mimeType: string; data: string } } = {};
      if (food) apiPayload.foodDescription = food;
      if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        apiPayload.image = { mimeType: imageFile.type, data: base64Image };
      }
      const result = await fetchCalorieInfo(apiPayload);
      setCalorieData(result.data);
      setGroundingMetadata(result.groundingMetadata);
    } catch (err) {
      handleApiError(err);
      setCalorieData(null);
    } finally {
      commonApiCallEnd();
    }
  }, []);

  const handleProfileSubmit = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setDailyMealAnalysis(null); 
    setSuggestedMealPlans(null);
    setShowNutritionistView(false);
    setSelectedMealPlan(null);
    setAdherenceLog({});
  }, []);

  const handleDailyLogSubmit = useCallback(async (log: DailyFoodLog) => {
    if (!userProfile) { setError("Please set your profile first."); return; }
    if (!process.env.API_KEY) { setError(API_KEY_MISSING_MSG); return; }

    commonApiCallStart();
    setDailyFoodLog(log);
    setDailyMealAnalysis(null);
    setSuggestedMealPlans(null);
    setShowNutritionistView(false);
    setSelectedMealPlan(null); 
    setAdherenceLog({});

    try {
      const analysis = await analyzeDailyIntake(userProfile, log);
      setDailyMealAnalysis(analysis);

      // Create patient case for nutritionist review
      const patientCase: PatientCase = {
        id: `CASE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        patientEmail: user?.email || 'anonymous@nutreeai.com',
        userProfile: userProfile,
        dailyFoodLog: log,
        aiAnalysis: analysis,
        createdAt: new Date().toISOString(),
        status: 'submitted',
        priority: 'normal'
      };

      setCurrentPatientCase(patientCase);
    } catch (err) {
      handleApiError(err);
    } finally {
      commonApiCallEnd();
    }
  }, [userProfile]);

  const handleSuggestMealPlans = useCallback(async (condition: string) => {
    if (!userProfile || !dailyMealAnalysis) { 
        setError("User profile and daily meal analysis are required to suggest plans."); 
        return; 
    }
    if (!process.env.API_KEY) { setError(API_KEY_MISSING_MSG); return; }

    commonApiCallStart();
    setPatientCondition(condition);
    setSuggestedMealPlans(null);
    setSelectedMealPlan(null); 
    setAdherenceLog({});

    try {
        const plans = await suggestMealPlans(userProfile, condition, dailyMealAnalysis);
        setSuggestedMealPlans(plans);
    } catch (err) {
        handleApiError(err);
    } finally {
        commonApiCallEnd();
    }
  }, [userProfile, dailyMealAnalysis]);

  const handleSelectMealPlan = useCallback((plan: MealPlan) => {
    setSelectedMealPlan(plan);
    setAdherenceLog({}); 
    setShowNutritionistView(false); 
    setError(null);
  }, []);

  const handleUpdateAdherence = useCallback((date: string, meal: keyof DailyAdherence, completed: boolean) => {
    setAdherenceLog(prevLog => ({
      ...prevLog,
      [date]: {
        ...(prevLog[date] || {}),
        [meal]: completed,
      }
    }));
  }, []);

  const toggleNutritionistView = () => {
    if (userProfile && dailyFoodLog && dailyMealAnalysis) {
      setNutritionistData({ userProfile, dailyFoodLog, dailyMealAnalysis });
      setShowNutritionistView(!showNutritionistView);
      if (showNutritionistView) { 
        setSuggestedMealPlans(null); 
        setPatientCondition('');
      }
      setSelectedMealPlan(null); 
      setAdherenceLog({});
      setError(null);
    } else {
      setError("Please complete your profile and daily food log first to enable nutritionist view and meal suggestions.");
    }
  };
  
  const switchMode = (mode: AppMode) => {
    setAppMode(mode);
    setError(null); 
    setCalorieData(null);
    setGroundingMetadata(undefined);
    setDailyMealAnalysis(null);
    setShowNutritionistView(false);
    setSuggestedMealPlans(null);
    setSelectedMealPlan(null);
    setAdherenceLog({});
    setPatientCondition('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-primary-bg-subtle)] via-[var(--color-secondary-bg-subtle)] to-[var(--color-accent-bg-subtle)] p-4">
        {error && error !== API_KEY_MISSING_MSG && <ErrorDisplay message={error} />}
        {apiKeyStatus === API_KEY_MISSING_MSG && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-lg z-50">
                <p className="font-bold">API Key Missing!</p>
                <p>{API_KEY_MISSING_MSG}</p>
                <p className="text-xs mt-1">Some features will be disabled. Please set it up in settings or environment variables.</p>
            </div>
        )}
        <div className="bg-[var(--color-background)] p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
          <div className="inline-flex items-center bg-[var(--color-header-bg)] p-3 sm:p-4 rounded-lg shadow-lg mb-6">
            <img src="/images/santaan.png" alt="Santaan Logo" className="w-auto h-10 sm:h-12 mr-3 sm:mr-4" />
            <img src="/images/skids.png" alt="Skids Logo" className="w-auto h-10 sm:h-12 mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-header-text)]">
              <span className="underline">NUTRITION</span><span className="text-[var(--color-accent)]">.AI</span>
            </h1>
          </div>
          <p className="mb-8 text-[var(--color-text-secondary)]">Please log in or sign up to continue.</p>
          <button
            onClick={openAuthModal}
            className="w-full px-6 py-3 tailwind-primary-button text-white font-semibold rounded-lg shadow-md hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Login / Sign Up
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Show admin dashboard if logged in as admin
  if (userRole === 'admin' && admin) {
    if (adminView === 'nutritionists') {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <button
                onClick={() => setAdminView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <NutritionistManagement onClose={() => setAdminView('dashboard')} />
        </div>
      );
    }

    if (adminView === 'assignments') {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <button
                onClick={() => setAdminView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <AssignmentManagement onClose={() => setAdminView('dashboard')} />
        </div>
      );
    }

    if (adminView === 'organizations') {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <button
                onClick={() => setAdminView('dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Dashboard
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <OrganizationManagement onClose={() => setAdminView('dashboard')} />
        </div>
      );
    }

    return <AdminDashboard admin={admin} onLogout={handleAdminLogout} onNavigate={setAdminView} />;
  }

  // Show nutritionist dashboard if logged in as nutritionist
  if (userRole === 'nutritionist' && nutritionist) {
    return <NutritionistDashboard nutritionist={nutritionist} onLogout={handleNutritionistLogout} />;
  }

  // Show admin login page
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onBackToMain={handleBackToMainFromAdmin} />;
  }

  // Show bulk data collection
  if (showBulkCollection) {
    return (
      <BulkDataCollection
        onSubmit={handleBulkDataSubmission}
        onClose={() => {
          setShowBulkCollection(false);
          setShowLandingPage(true);
        }}
      />
    );
  }

  // Show organization registration
  if (showOrgRegistration) {
    return (
      <OrganizationRegistration
        onRegistrationComplete={handleOrganizationRegistration}
        onCancel={() => {
          setShowOrgRegistration(false);
          setShowLandingPage(true);
        }}
      />
    );
  }

  // Show white-label portal for organization subdomains
  if (isWhiteLabel && currentOrganization) {
    const whiteLabelConfig: WhiteLabelConfig = {
      organizationId: currentOrganization.id,
      domain: window.location.hostname,
      branding: currentOrganization.branding,
      customizations: {
        hideNutreeAIBranding: false,
        enableCustomAnalytics: false
      },
      features: {
        enableAdvancedFoodInput: true,
        enableBulkUpload: currentOrganization.settings.allowBulkUploads,
        enableAPIAccess: false,
        enableCustomReports: currentOrganization.settings.enableCustomReports,
        enableMobileApp: true
      }
    };

    return (
      <WhiteLabelPortal
        organization={currentOrganization}
        whiteLabelConfig={whiteLabelConfig}
        onPatientSubmission={handleWhiteLabelPatientSubmission}
      />
    );
  }

  // Show nutritionist login page
  if (showNutritionistLogin) {
    return <NutritionistLogin onLogin={handleNutritionistLogin} onBackToPatient={handleBackToPatientPortal} />;
  }

  // Show landing page first
  if (showLandingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-400 via-teal-400 to-blue-500">
        <Header clinicName={appSettings.clinicName} onToggleSettings={() => setShowSettingsPanel(true)} userEmail={user?.email} onLogout={handleLogoutClick} />
        <main className="flex-grow">
          <LandingPage
            onGetStarted={handleGetStarted}
            onNutritionistLogin={handleSwitchToNutritionistLogin}
            onAdminLogin={handleSwitchToAdminLogin}
            onPartnerRegistration={handleShowOrgRegistration}
            onBulkCollection={handleShowBulkCollection}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 min-h-screen flex flex-col bg-gray-50 rounded-xl shadow-2xl">
      <Header clinicName={appSettings.clinicName} onToggleSettings={() => setShowSettingsPanel(true)} userEmail={user?.email} onLogout={handleLogoutClick} />
      
      {showSettingsPanel && (
        <SettingsPanel
            currentSettings={appSettings}
            onSave={handleSaveSettings}
            onClose={() => setShowSettingsPanel(false)}
        />
      )}

      <div className="my-6 flex justify-center space-x-2 sm:space-x-4">
        <button
          onClick={() => switchMode('dailyPlanner')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center space-x-2 shadow
                      ${appMode === 'dailyPlanner' ? 'tailwind-primary-button scale-105' : 'tailwind-secondary-button'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm3-6h.008v.008H15v-.008zm0 3h.008v.008H15v-.008zm0 3h.008v.008H15v-.008zm3-6h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zM4.5 13.5H9m-4.5 3H9m-4.5 3H9" />
            </svg>
          <span>Daily Planner</span>
        </button>
        <button
          onClick={() => switchMode('singleChecker')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out flex items-center space-x-2 shadow
                      ${appMode === 'singleChecker' ? 'tailwind-accent-button text-white scale-105' : 'tailwind-secondary-button'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <span>Single Food Lookup</span>
        </button>
      </div>

      <main className="flex-grow">
        <div className="max-w-2xl mx-auto">
          {apiKeyStatus === API_KEY_MISSING_MSG && (
             <div className="my-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
                <p className="font-bold">API Key Missing!</p>
                <p>{apiKeyStatus}</p>
                <p className="text-xs mt-2">Note: Full authentication (like Gmail Login) and persistent storage for adherence tracking visible to a nutritionist require backend infrastructure, which is not part of this demo application.</p>
             </div>
          )}
          {apiKeyStatus === API_KEY_CHECK_MSG && (
             <div className="my-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md shadow-sm">
                <p>{apiKeyStatus}</p>
             </div>
          )}
          
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && <ErrorDisplay message={error} />}

          {/* Single Food Checker Mode */}
          {appMode === 'singleChecker' && apiKeyStatus === API_KEY_PRESENT_MSG && (
            <>
              <FoodInput onSubmit={handleSingleFoodSearch} isLoading={isLoading} />
              {!isLoading && !error && calorieData && <CalorieDisplay data={calorieData} groundingMetadata={groundingMetadata} />}
              {!isLoading && !error && !calorieData && (
                <div className="mt-8 text-center p-6 bg-white rounded-lg shadow-xl">
                    <p className="text-gray-500 text-lg">Enter a food item or upload an image to get its nutritional details.</p>
                </div>
              )}
            </>
          )}

          {/* Daily Meal Planner Mode */}
          {appMode === 'dailyPlanner' && apiKeyStatus === API_KEY_PRESENT_MSG && (
            <div className="space-y-8">
              {!userProfile ? (
                <UserProfileInput onSubmit={handleProfileSubmit} isLoading={isLoading} />
              ) : (
                <div>
                  <div className="p-4 bg-[var(--color-primary-bg-subtle,theme(colors.green.50))] border border-[var(--color-primary,theme(colors.green.200))] rounded-lg shadow mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-primary-text-strong,theme(colors.green.700))]">Current Profile:</h3>
                        <p className="text-sm text-gray-600">Age: {userProfile.ageGroup} | Cuisine: {userProfile.cuisinePreference}</p>
                    </div>
                    <button 
                        onClick={() => {setUserProfile(null); setDailyFoodLog(null); setDailyMealAnalysis(null); setShowNutritionistView(false); setSuggestedMealPlans(null); setSelectedMealPlan(null); setAdherenceLog({});}} 
                        className="text-sm text-[var(--color-accent)] hover:underline p-2 rounded hover:bg-[var(--color-accent-bg-subtle,theme(colors.blue.100))]"
                        aria-label="Change Profile"
                    >
                        Change Profile
                    </button>
                  </div>
                  
                  {!selectedMealPlan ? ( 
                    <>
                      {!dailyMealAnalysis ? (
                        <FlexibleMealInput onSubmit={handleDailyLogSubmit} isLoading={isLoading} profileSet={!!userProfile} />
                      ) : currentPatientCase ? (
                        <PatientStatusTracker
                          patientCase={currentPatientCase}
                          onViewReport={currentPatientCase.status === 'reviewed' ? handleViewProfessionalReport : undefined}
                        />
                      ) : (
                         <DailyMealSummaryDisplay analysis={dailyMealAnalysis} />
                      )}

                      {dailyMealAnalysis && !showNutritionistView && (
                        <div className="mt-6 text-center">
                           <button 
                            onClick={toggleNutritionistView}
                            className="px-6 py-3 tailwind-accent-button text-white font-semibold rounded-md shadow-md hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center mx-auto"
                            >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            Get Meal Suggestions (Nutritionist View)
                           </button>
                        </div>
                      )}

                      {showNutritionistView && nutritionistData && (
                        <NutritionistView 
                            data={nutritionistData} 
                            onSuggestPlans={handleSuggestMealPlans}
                            suggestedPlans={suggestedMealPlans}
                            isLoading={isLoading}
                            patientCondition={patientCondition}
                            setPatientCondition={setPatientCondition}
                            onSelectPlan={handleSelectMealPlan}
                            onClose={() => { setShowNutritionistView(false); setSuggestedMealPlans(null); setPatientCondition('');}}
                            doctorProfile={appSettings.doctorProfile}
                        />
                      )}
                       {!dailyMealAnalysis && userProfile && !isLoading && (
                        <div className="mt-8 text-center p-6 bg-white rounded-lg shadow-xl">
                            <p className="text-gray-500 text-lg">Now, please log your meals for today, or proceed to get meal suggestions if you have a past analysis.</p>
                        </div>
                       )}
                    </>
                  ) : ( 
                    <ActiveMealPlanView 
                        plan={selectedMealPlan}
                        adherenceLog={adherenceLog}
                        onUpdateAdherence={handleUpdateAdherence}
                        onStopTracking={() => {setSelectedMealPlan(null); setAdherenceLog({});}}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Professional Report Modal */}
      {showProfessionalReport && currentPatientCase && (
        <ProfessionalReport
          patientCase={currentPatientCase}
          onClose={handleCloseProfessionalReport}
          onDownloadPDF={() => {
            // TODO: Implement PDF download functionality
            alert('PDF download functionality will be implemented');
          }}
        />
      )}
    </div>
  );
};

export default App;

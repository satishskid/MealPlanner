import React, { useState, useEffect, useCallback } from 'react';
import netlifyIdentity, { User } from 'netlify-identity-widget';
import Header from './components/Header';
import Footer from './components/Footer';
import FoodInput from './components/FoodInput';
import CalorieDisplay from './components/CalorieDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import UserProfileInput from './components/UserProfileInput';
import DailyMealInput from './components/DailyMealInput';
import DailyMealSummaryDisplay from './components/DailyMealSummaryDisplay';
import NutritionistView from './components/NutritionistView';
import ActiveMealPlanView from './components/ActiveMealPlanView';
import SettingsPanel from './components/SettingsPanel'; // Ensured relative path
import { 
  CalorieInfo, GroundingMetadata, AppMode, UserProfile, DailyFoodLog, 
  DailyMealAnalysis, MealPlan, NutritionistViewData, AdherenceLog, DailyAdherence,
  AppSettings, ThemeOption, DoctorProfile
} from './types';
import { fetchCalorieInfo, analyzeDailyIntake, suggestMealPlans } from './services/geminiService';
import { 
    API_KEY_CHECK_MSG, API_KEY_MISSING_MSG, API_KEY_PRESENT_MSG, 
    DEFAULT_SETTINGS, LOCAL_STORAGE_SETTINGS_KEY, THEME_OPTIONS
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

  useEffect(() => {
    netlifyIdentity.init({});
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      netlifyIdentity.close();
    };

    const handleLogout = () => {
      setUser(null);
    };

    netlifyIdentity.on('login', handleLogin);
    netlifyIdentity.on('logout', handleLogout);

    // Initial API Key check (moved here to ensure it runs after identity check)
    if (process.env.API_KEY) {
      setApiKeyStatus(API_KEY_PRESENT_MSG);
    } else {
      setApiKeyStatus(API_KEY_MISSING_MSG);
      // setError(API_KEY_MISSING_MSG); // Only set error if user is logged in and key is missing
    }

    return () => {
      netlifyIdentity.off('login', handleLogin);
      netlifyIdentity.off('logout', handleLogout);
    };
  }, []);

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
    // Set API Key error only if user is logged in and key is missing
    if (user && !process.env.API_KEY) {
        setError(API_KEY_MISSING_MSG);
    } else if (user && process.env.API_KEY && error === API_KEY_MISSING_MSG) {
        setError(null); // Clear API key error if key is now present
    }
  }, [user, error, apiKeyStatus]);

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

  const openAuthModal = () => {
    netlifyIdentity.open();
  };

  const handleLogoutClick = () => {
    netlifyIdentity.logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-700">Welcome to the Diet Planner</h1>
          <p className="mb-8 text-gray-600">Please log in or sign up to continue.</p>
          <button
            onClick={openAuthModal}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Main application content for logged-in users
  if (showSettingsPanel) {
    return <SettingsPanel currentSettings={appSettings} onSave={handleSaveSettings} onClose={() => setShowSettingsPanel(false)} />;
  }
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
                        <DailyMealInput onSubmit={handleDailyLogSubmit} isLoading={isLoading} profileSet={!!userProfile} />
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
    </div>
  );
};

export default App;

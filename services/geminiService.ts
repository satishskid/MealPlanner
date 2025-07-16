
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { CalorieInfo, GroundingMetadata, UserProfile, DailyFoodLog, DailyMealAnalysis, MealPlan } from '../types';

let ai: GoogleGenAI | null = null;

interface FetchCalorieInfoPayload {
  foodDescription?: string;
  image?: {
    mimeType: string;
    data: string; // base64 encoded string
  };
}

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const parseJsonResponse = <T>(responseText: string): T => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonStr, e);
    throw new Error(`Failed to parse JSON response. Raw text: "${jsonStr.substring(0,1000)}"`);
  }
};


export const fetchCalorieInfo = async (
  payload: FetchCalorieInfoPayload
): Promise<{data: CalorieInfo, groundingMetadata?: GroundingMetadata}> => {
  const client = getAiClient();
  const { foodDescription, image } = payload;

  let promptText = "";
  const parts: Part[] = [];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    });
    promptText = `Analyze the food item depicted in the provided image. `;
    if (foodDescription) {
      promptText += `The accompanying text is: "${foodDescription}". Use this text as additional context or to clarify any ambiguities in the image. `;
    }
  } else if (foodDescription) {
    promptText = `Analyze the following food item: "${foodDescription}". `;
  } else {
    throw new Error("Either a food description or an image must be provided.");
  }
  
  promptText += `
Estimate its calorie count, serving size, and key macronutrients (protein, carbohydrates, fat in grams) if available.
Additionally, provide:
1. A brief description of the dish.
2. Its nuances (e.g., key flavor profiles, texture, common ingredients, cultural significance if relevant).
3. What makes it appealing or 'good' (e.g., taste, common enjoyment factors, versatility).
4. Practical tips on how to make it healthier (e.g., cooking methods, ingredient substitutions, portion control advice).

If the food item is ambiguous, provide data for the most common interpretation or state the ambiguity in the 'notes' field.
Return the information strictly as a JSON object with the following structure. Do not include any explanatory text, comments, or markdown fences before or after the JSON object itself.

{
  "foodName": "The name of the food item, as understood or depicted",
  "calories": <number_or_string>, 
  "servingSize": "Description of the serving size, e.g., '1 medium apple', '100g'",
  "macronutrients": {
    "protein": "<value>g (if available)", 
    "carbohydrates": "<value>g (if available)", 
    "fat": "<value>g (if available)" 
  },
  "description": "A brief description of the dish.",
  "nuances": "Specific characteristics, flavors, textures, common ingredients, cultural significance (if any).",
  "positives": "What is generally considered good about this dish (e.g., taste, common enjoyment factors, versatility).",
  "healthyTips": "Practical suggestions to make this dish healthier, potentially as a list or newline-separated points.",
  "notes": "Any additional notes, clarifications, or if calorie info cannot be reliably determined, explain why."
}`;

  parts.push({ text: promptText });

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = parseJsonResponse<CalorieInfo>(response.text);
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    return { data: parsedData, groundingMetadata };

  } catch (error) {
    console.error("Error fetching calorie info:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch or parse calorie information: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching calorie information.");
  }
};

// Helper function to extract meal text from MealEntry or string
const getMealText = (meal: string | any): string => {
  if (typeof meal === 'string') {
    return meal;
  }
  if (meal && typeof meal === 'object' && meal.rawText) {
    return meal.rawText;
  }
  return "Not specified";
};

export const analyzeDailyIntake = async (
  profile: UserProfile,
  log: DailyFoodLog
): Promise<DailyMealAnalysis> => {
  const client = getAiClient();

  // Extract meal texts, handling both string and MealEntry formats
  const breakfastText = getMealText(log.breakfast);
  const lunchText = getMealText(log.lunch);
  const dinnerText = getMealText(log.dinner);
  const snacksText = getMealText(log.snacks);

  const prompt = `
Analyze the daily food intake for a user with the following profile:
Age Group: ${profile.ageGroup}
Cuisine Preference: ${profile.cuisinePreference}

Food Log (Note: "item A OR item B" means the user has alternatives and may consume one of these options on different days. "item A AND item B" means they consume both items together):
Breakfast: ${breakfastText || "Not specified"}
Lunch: ${lunchText || "Not specified"}
Dinner: ${dinnerText || "Not specified"}
Snacks: ${snacksText || "Not specified"}

Please provide:
1.  An estimated total daily calorie intake (as a string, e.g., "2000-2200 kcal" or "Approx. 1800 kcal").
2.  A general nutritional quality assessment that considers the variety and flexibility in their food choices.
3.  A breakdown for each meal (Breakfast, Lunch, Dinner, Snacks), detailing:
    *   Your interpretation of the food items eaten. For "OR" options, acknowledge the variety and analyze the nutritional range. For "AND" combinations, analyze the complete meal.
    *   Estimated calorie range for that meal (consider ranges for OR options).
    *   Specific notes about nutritional balance, variety, and cultural appropriateness.
4.  General recommendations that embrace their food variety and suggest improvements while respecting their choices.
5.  A brief, culturally relevant (based on cuisine preference: ${profile.cuisinePreference}) motivational message that celebrates their food diversity.
6.  A brief, culturally relevant (based on cuisine preference: ${profile.cuisinePreference}) educative tip about optimizing their varied food choices.

Return the information strictly as a JSON object with the following structure. Ensure all string values are appropriately escaped. Do not include any explanatory text or markdown.
{
  "totalEstimatedCalories": "e.g., 1800-2000 kcal",
  "qualityAssessment": "Your overall assessment of the diet's quality.",
  "mealBreakdown": [
    { "meal": "Breakfast", "items": "Interpreted items for breakfast", "estimatedCalories": "e.g., 400-500 kcal", "notes": "Specific notes for breakfast" },
    { "meal": "Lunch", "items": "Interpreted items for lunch", "estimatedCalories": "e.g., 600-700 kcal", "notes": "Specific notes for lunch" },
    { "meal": "Dinner", "items": "Interpreted items for dinner", "estimatedCalories": "e.g., 700-800 kcal", "notes": "Specific notes for dinner" },
    { "meal": "Snacks", "items": "Interpreted items for snacks", "estimatedCalories": "e.g., 100-200 kcal", "notes": "Specific notes for snacks" }
  ],
  "generalRecommendations": "General dietary recommendations or tips.",
  "motivationalMessage": "A culturally relevant motivational message.",
  "educativeTip": "A culturally relevant educative tip."
}
`;

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });
    return parseJsonResponse<DailyMealAnalysis>(response.text);
  } catch (error) {
    console.error("Error analyzing daily intake:", error);
     if (error instanceof Error) {
        throw new Error(`Failed to analyze daily intake: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing daily intake.");
  }
};

export const suggestMealPlans = async (
  profile: UserProfile,
  condition: string,
  currentIntakeAnalysis?: DailyMealAnalysis
): Promise<MealPlan[]> => {
  const client = getAiClient();
  let prompt = `
A user presents with the following profile:
Age Group: ${profile.ageGroup}
Cuisine Preference: ${profile.cuisinePreference}
Reported Health Condition(s): ${condition || "None specified"}

${currentIntakeAnalysis ? `Their current typical daily intake has been analyzed as follows:
Total Estimated Calories: ${currentIntakeAnalysis.totalEstimatedCalories}
Quality Assessment: ${currentIntakeAnalysis.qualityAssessment}
General Recommendations for their current diet: ${currentIntakeAnalysis.generalRecommendations || "None"}
Motivational Message received: ${currentIntakeAnalysis.motivationalMessage || "None"}
Educative Tip received: ${currentIntakeAnalysis.educativeTip || "None"}
` : ''}

Based on this information, please suggest 2-3 distinct meal plans tailored to their needs and cuisine preference.
For each meal plan, provide the information strictly as an array of JSON objects. Each object must follow this exact structure:
{
  "planName": "Descriptive plan name (e.g., 'Balanced Diabetic-Friendly ${profile.cuisinePreference} Plan')",
  "description": "Brief overall description of the plan's philosophy or goals.",
  "dailyMeals": {
    "breakfast": [
      { "name": "Primary Breakfast Item", "portionSuggestion": "e.g., 2 medium", "alternatives": ["Alternative 1", "Alternative 2"] }
      // Can include more breakfast items if it's a multi-component meal
    ],
    "lunch": [
      { "name": "Primary Lunch Item 1", "portionSuggestion": "e.g., 1 cup", "alternatives": [] },
      { "name": "Primary Lunch Item 2 (e.g., side dish)", "portionSuggestion": "e.g., 1 bowl", "alternatives": ["Side Alt 1"]}
    ],
    "dinner": [
      { "name": "Primary Dinner Item", "portionSuggestion": "e.g., 2 pieces", "alternatives": ["Alt Dinner Option"]}
    ],
    "snacks": [
      { "name": "Snack Option 1", "portionSuggestion": "e.g., 1 fruit", "alternatives": ["Handful of nuts", "Yogurt"]}
    ]
  },
  "weeklyVarietyNotes": "Tips on how to introduce variety to this daily plan over a week (e.g., 'Rotate vegetable types in lunch curry', 'Alternate between lentils and legumes for dinner protein').",
  "benefits": "Key benefits of this plan, especially concerning the reported condition(s) and profile.",
  "nuances": "Important nuances or considerations for following this plan (e.g., portion control, specific ingredients to favor/limit, cooking methods, hydration)."
}

Ensure the output is ONLY the JSON array. Do not include any explanatory text, comments, or markdown fences before or after the JSON array itself.
The meal items should be appropriate for the specified cuisine preference (${profile.cuisinePreference}).
Example for one plan in the array:
[
  {
    "planName": "Heart-Healthy ${profile.cuisinePreference} Daily Structure",
    "description": "A plan focused on cardiovascular health, emphasizing whole grains, lean proteins, and healthy fats, with ${profile.cuisinePreference} flavors.",
    "dailyMeals": {
      "breakfast": [
        { "name": "Oats Porridge with nuts and seeds", "portionSuggestion": "1 large bowl", "alternatives": ["${profile.cuisinePreference} style savory semolina (Upma)", "Ragi Malt"] }
      ],
      "lunch": [
        { "name": "Whole wheat Roti/Chapati", "portionSuggestion": "2 medium", "alternatives": ["Brown Rice", "Millet Roti"] },
        { "name": "Mixed Vegetable Sabzi (low oil)", "portionSuggestion": "1 cup", "alternatives": ["Lentil and Spinach Curry (Dal Palak)"] },
        { "name": "Salad (cucumber, tomato, onion)", "portionSuggestion": "1 small bowl", "alternatives": [] }
      ],
      "dinner": [
        { "name": "Grilled Fish or Tofu Steak", "portionSuggestion": "100-120g", "alternatives": ["Baked Chicken Breast", "Paneer Tikka (low fat)"] },
        { "name": "Steamed Vegetables", "portionSuggestion": "1 cup", "alternatives": [] }
      ],
      "snacks": [
        { "name": "Seasonal Fruit", "portionSuggestion": "1 medium", "alternatives": ["Buttermilk (Chaas)", "Sprouts Salad"] }
      ]
    },
    "weeklyVarietyNotes": "Cycle through different seasonal vegetables daily. Include a variety of lentils and legumes throughout the week. Opt for different types of fish or plant-based proteins.",
    "benefits": "Supports heart health by managing cholesterol and blood pressure. Provides sustained energy and essential nutrients.",
    "nuances": "Focus on baking, grilling, or steaming. Limit added salt and sugar. Ensure adequate water intake."
  }
  // ... more plan objects if suggesting multiple plans
]
`;
  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: "user", parts: [{text: prompt}] }],
      config: {
        responseMimeType: "application/json",
      },
    });
    return parseJsonResponse<MealPlan[]>(response.text);
  } catch (error) {
    console.error("Error suggesting meal plans:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to suggest meal plans: ${error.message}`);
    }
    throw new Error("An unknown error occurred while suggesting meal plans.");
  }
};
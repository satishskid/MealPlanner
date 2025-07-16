import React, { useState } from 'react';
import { DailyFoodLog, FoodItem, MealEntry } from '../types';

interface FlexibleMealInputProps {
  onSubmit: (log: DailyFoodLog) => void;
  isLoading: boolean;
  profileSet: boolean;
}

interface MealInputState {
  items: FoodItem[];
  showAdvanced: boolean;
}

const FlexibleMealInput: React.FC<FlexibleMealInputProps> = ({ onSubmit, isLoading, profileSet }) => {
  const [breakfast, setBreakfast] = useState<MealInputState>({ items: [{ name: '' }], showAdvanced: false });
  const [lunch, setLunch] = useState<MealInputState>({ items: [{ name: '' }], showAdvanced: false });
  const [dinner, setDinner] = useState<MealInputState>({ items: [{ name: '' }], showAdvanced: false });
  const [snacks, setSnacks] = useState<MealInputState>({ items: [{ name: '' }], showAdvanced: false });

  const addFoodItem = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', operator: 'AND' | 'OR') => {
    const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
    const setter = setters[mealType];
    
    setter(prev => ({
      ...prev,
      items: [...prev.items, { name: '', operator }]
    }));
  };

  const updateFoodItem = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index: number, name: string) => {
    const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
    const setter = setters[mealType];
    
    setter(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, name } : item)
    }));
  };

  const removeFoodItem = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', index: number) => {
    const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
    const setter = setters[mealType];
    
    setter(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const toggleAdvanced = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
    const setter = setters[mealType];
    
    setter(prev => ({
      ...prev,
      showAdvanced: !prev.showAdvanced
    }));
  };

  const generateMealText = (mealState: MealInputState): string => {
    return mealState.items
      .filter(item => item.name.trim())
      .map((item, index) => {
        if (index === 0) return item.name;
        return `${item.operator} ${item.name}`;
      })
      .join(' ');
  };

  const createMealEntry = (mealState: MealInputState): MealEntry => {
    const validItems = mealState.items.filter(item => item.name.trim());
    return {
      items: validItems,
      rawText: generateMealText(mealState)
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSet) {
      alert("Please set your profile first.");
      return;
    }

    const hasAnyFood = [breakfast, lunch, dinner, snacks].some(meal => 
      meal.items.some(item => item.name.trim())
    );

    if (!hasAnyFood) {
      alert("Please enter at least one meal.");
      return;
    }

    const foodLog: DailyFoodLog = {
      breakfast: breakfast.showAdvanced ? createMealEntry(breakfast) : generateMealText(breakfast),
      lunch: lunch.showAdvanced ? createMealEntry(lunch) : generateMealText(lunch),
      dinner: dinner.showAdvanced ? createMealEntry(dinner) : generateMealText(dinner),
      snacks: snacks.showAdvanced ? createMealEntry(snacks) : generateMealText(snacks)
    };

    onSubmit(foodLog);
  };

  const renderMealInput = (
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    mealState: MealInputState,
    label: string,
    placeholder: string
  ) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => toggleAdvanced(mealType)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {mealState.showAdvanced ? 'Simple Mode' : 'Advanced Options'}
          </button>
        </div>

        {!mealState.showAdvanced ? (
          // Simple mode - single text input
          <textarea
            value={generateMealText(mealState)}
            onChange={(e) => {
              const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
              setters[mealType]({ items: [{ name: e.target.value }], showAdvanced: false });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder={placeholder}
          />
        ) : (
          // Advanced mode - multiple items with operators
          <div className="space-y-2">
            {mealState.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && (
                  <select
                    value={item.operator || 'AND'}
                    onChange={(e) => {
                      const setters = { breakfast: setBreakfast, lunch: setLunch, dinner: setDinner, snacks: setSnacks };
                      setters[mealType](prev => ({
                        ...prev,
                        items: prev.items.map((it, i) => 
                          i === index ? { ...it, operator: e.target.value as 'AND' | 'OR' } : it
                        )
                      }));
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                )}
                
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateFoodItem(mealType, index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={index === 0 ? placeholder : "Additional food item..."}
                />
                
                {mealState.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFoodItem(mealType, index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => addFoodItem(mealType, 'AND')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                + AND
              </button>
              <button
                type="button"
                onClick={() => addFoodItem(mealType, 'OR')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                + OR
              </button>
            </div>
            
            {/* Preview */}
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Preview:</strong> {generateMealText(mealState) || 'No items added'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Food Log</h2>
        <p className="text-gray-600 text-sm">
          Enter your meals for today. Use Advanced Options to specify food alternatives (OR) or combinations (AND).
        </p>
      </div>

      {/* Examples */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Examples:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Simple:</strong> "Eggs with toast and coffee"</p>
          <p><strong>With OR:</strong> "Eggs OR Oats OR Paratha" (alternatives for different days)</p>
          <p><strong>With AND:</strong> "Rice AND Dal AND Vegetables" (combination meal)</p>
          <p><strong>Mixed:</strong> "Rice AND Dal OR Roti AND Sabzi" (different meal combinations)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderMealInput('breakfast', breakfast, 'Breakfast', 'e.g., Paratha with curd, OR Oats with milk')}
        {renderMealInput('lunch', lunch, 'Lunch', 'e.g., Rice AND Dal AND Vegetables')}
        {renderMealInput('dinner', dinner, 'Dinner', 'e.g., Roti OR Rice with curry')}
        {renderMealInput('snacks', snacks, 'Snacks', 'e.g., Tea with biscuits OR Fruits')}

        <button
          type="submit"
          disabled={isLoading || !profileSet}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Analyzing...' : 'Analyze My Nutrition'}
        </button>

        {!profileSet && (
          <p className="text-red-600 text-sm text-center">
            Please set your profile first before submitting your food log.
          </p>
        )}
      </form>
    </div>
  );
};

export default FlexibleMealInput;

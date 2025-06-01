
import React, { useState } from 'react';
import { DailyFoodLog } from '../types';

interface DailyMealInputProps {
  onSubmit: (log: DailyFoodLog) => void;
  isLoading: boolean;
  profileSet: boolean;
}

const DailyMealInput: React.FC<DailyMealInputProps> = ({ onSubmit, isLoading, profileSet }) => {
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [snacks, setSnacks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSet) {
      alert("Please set your profile first.");
      return;
    }
    if (!breakfast && !lunch && !dinner && !snacks) {
      alert("Please enter at least one meal.");
      return;
    }
    onSubmit({ breakfast, lunch, dinner, snacks });
  };

  const commonTextareaProps = (value: string, setter: (val: string) => void, placeholder: string, label: string) => ({
    id: label.toLowerCase(),
    value,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setter(e.target.value),
    placeholder,
    rows: 3,
    className: "w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 disabled:bg-gray-100",
    disabled: isLoading || !profileSet,
    'aria-label': label,
  });

  const PortionGuidance: React.FC = () => (
    <p className="text-xs text-gray-500 mt-1">
      Tip: Use common measures like "1 cup", "1 bowl", "2 pieces". For alternatives, you can write "Food A OR Food B".
    </p>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Log Your Daily Meals</h2>
      {!profileSet && (
        <p className="text-center text-red-500 mb-4">Please complete your profile before logging meals.</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="breakfast" className="block text-sm font-medium text-gray-700 mb-1">
            Breakfast:
          </label>
          <textarea {...commonTextareaProps(breakfast, setBreakfast, "e.g., 2 idlis with sambar OR Poha (1 bowl)", "Breakfast")} />
          <PortionGuidance />
        </div>
        <div>
          <label htmlFor="lunch" className="block text-sm font-medium text-gray-700 mb-1">
            Lunch:
          </label>
          <textarea {...commonTextareaProps(lunch, setLunch, "e.g., Rice (1 cup), Dal (1 bowl) OR 2 Rotis with Veg Curry", "Lunch")} />
          <PortionGuidance />
        </div>
        <div>
          <label htmlFor="dinner" className="block text-sm font-medium text-gray-700 mb-1">
            Dinner:
          </label>
          <textarea {...commonTextareaProps(dinner, setDinner, "e.g., 2 Phulkas, Paneer Sabji OR Chicken Curry (1 bowl) with Rice", "Dinner")} />
          <PortionGuidance />
        </div>
        <div>
          <label htmlFor="snacks" className="block text-sm font-medium text-gray-700 mb-1">
            Snacks (optional):
          </label>
          <textarea {...commonTextareaProps(snacks, setSnacks, "e.g., Apple (1) OR Handful of almonds", "Snacks")} />
          <PortionGuidance />
        </div>
        <button
          type="submit"
          disabled={isLoading || !profileSet || (!breakfast && !lunch && !dinner && !snacks)}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        >
          {isLoading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Analyze My Day
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DailyMealInput;
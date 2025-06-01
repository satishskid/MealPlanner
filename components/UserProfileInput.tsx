
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AGE_GROUPS, CUISINE_PREFERENCES } from '../constants';

interface UserProfileInputProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const UserProfileInput: React.FC<UserProfileInputProps> = ({ onSubmit, isLoading }) => {
  const [ageGroup, setAgeGroup] = useState<string>(AGE_GROUPS[2]); // Default to Adult (20-39)
  const [cuisinePreference, setCuisinePreference] = useState<string>(CUISINE_PREFERENCES[0]); // Default to North Indian

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ageGroup, cuisinePreference });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">
            Select Age Group:
          </label>
          <select
            id="ageGroup"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            {AGE_GROUPS.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cuisinePreference" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Indian Cuisine Style:
          </label>
          <select
            id="cuisinePreference"
            value={cuisinePreference}
            onChange={(e) => setCuisinePreference(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            {CUISINE_PREFERENCES.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Profile...
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Save Profile & Continue
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UserProfileInput;

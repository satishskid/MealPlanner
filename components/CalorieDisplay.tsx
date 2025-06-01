
import React, { useState, useEffect } from 'react';
import { CalorieInfo, GroundingMetadata, GroundingChunkWeb } from '../types';

interface CalorieDisplayProps {
  data: CalorieInfo | null;
  groundingMetadata?: GroundingMetadata;
}

const CalorieDisplay: React.FC<CalorieDisplayProps> = ({ data, groundingMetadata }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false); // Reset visibility for new data
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [data]); // Re-run effect when data changes

  if (!data) {
    return null;
  }

  const renderMacronutrient = (label: string, value?: string) => {
    if (!value || value.toLowerCase().includes("not available") || value.trim() === "g") return null;
    return (
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label}:</span>
        <span className="font-medium">{value}</span>
      </div>
    );
  };
  
  const webSources = groundingMetadata?.groundingChunks?.reduce((acc: GroundingChunkWeb[], chunk) => {
    if (chunk.web && chunk.web.uri) {
      acc.push(chunk.web);
    }
    return acc;
  }, []);

  const hasMacronutrients = data.macronutrients && 
                           (data.macronutrients.protein || data.macronutrients.carbohydrates || data.macronutrients.fat) &&
                           ( (data.macronutrients.protein && !data.macronutrients.protein.toLowerCase().includes("not available") && data.macronutrients.protein.trim() !== "g") ||
                             (data.macronutrients.carbohydrates && !data.macronutrients.carbohydrates.toLowerCase().includes("not available") && data.macronutrients.carbohydrates.trim() !== "g") ||
                             (data.macronutrients.fat && !data.macronutrients.fat.toLowerCase().includes("not available") && data.macronutrients.fat.trim() !== "g")
                           );

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-xl transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      aria-live="polite"
    >
      <div className="flex items-center mb-4">
        <svg className="w-10 h-10 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 10.25V6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5h7.5m4.5-9.75h-4.5M18 15.75l3 3m0 0l-3 3m3-3l-3-3m3 3H12M21.75 2.25H15M16.5 2.25V6" />
        </svg>
        <h2 className="text-3xl font-bold text-gray-800 capitalize">{data.foodName}</h2>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-5xl font-extrabold text-green-600 text-center">{data.calories}</p>
        <p className="text-center text-sm text-gray-500 mt-1">Calories (approx.)</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-md text-gray-700">
          <span className="font-semibold">Serving Size:</span>
          <span className="text-right">{data.servingSize}</span>
        </div>

        {hasMacronutrients && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Macronutrients</h3>
            <div className="space-y-1">
              {renderMacronutrient('Protein', data.macronutrients?.protein)}
              {renderMacronutrient('Carbohydrates', data.macronutrients?.carbohydrates)}
              {renderMacronutrient('Fat', data.macronutrients?.fat)}
            </div>
          </div>
        )}

        {data.description && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-sm text-gray-600">{data.description}</p>
          </div>
        )}

        {data.nuances && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Nuances</h3>
            <p className="text-sm text-gray-600">{data.nuances}</p>
          </div>
        )}

        {data.positives && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">What's Good About It?</h3>
            <p className="text-sm text-gray-600">{data.positives}</p>
          </div>
        )}
        
        {data.healthyTips && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Healthy Tips</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{data.healthyTips}</p>
          </div>
        )}

        {data.notes && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Notes</h3>
            <p className="text-sm text-gray-600 italic">{data.notes}</p>
          </div>
        )}
        
        {webSources && webSources.length > 0 && (
          <div className="pt-3 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sources</h3>
            <ul className="list-disc list-inside space-y-1">
              {webSources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">
                    {source.title || source.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieDisplay;
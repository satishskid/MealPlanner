import React, { useState } from 'react';
import { UserProfile, DailyFoodLog } from '../types';

interface BulkDataEntry {
  id: string;
  uniqueId: string; // Organization-specific unique identifier
  name: string;
  email: string;
  phone?: string;
  ageGroup: string;
  cuisinePreference: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  additionalNotes?: string;
  submittedAt: string;
}

interface BulkDataCollectionProps {
  onSubmit: (entries: BulkDataEntry[]) => void;
  onClose: () => void;
}

const BulkDataCollection: React.FC<BulkDataCollectionProps> = ({ onSubmit, onClose }) => {
  const [entries, setEntries] = useState<BulkDataEntry[]>([createEmptyEntry()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);

  function createEmptyEntry(): BulkDataEntry {
    return {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uniqueId: '',
      name: '',
      email: '',
      phone: '',
      ageGroup: '',
      cuisinePreference: '',
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      additionalNotes: '',
      submittedAt: new Date().toISOString()
    };
  }

  const addNewEntry = () => {
    setEntries([...entries, createEmptyEntry()]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: keyof BulkDataEntry, value: string | boolean) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all entries
    const validEntries = entries.filter(entry =>
      entry.uniqueId &&
      entry.name &&
      entry.email &&
      entry.ageGroup &&
      entry.cuisinePreference &&
      (entry.breakfast || entry.lunch || entry.dinner)
    );

    if (validEntries.length === 0) {
      alert('Please fill in at least one complete entry with unique ID, name, email, age group, cuisine preference, and at least one meal.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(validEntries);
      alert(`Successfully submitted ${validEntries.length} nutrition analysis requests!`);
      setEntries([createEmptyEntry()]);
    } catch (error) {
      alert('Error submitting data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const csvEntries: BulkDataEntry[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0]) {
          const entry: BulkDataEntry = {
            id: `csv_${Date.now()}_${i}`,
            uniqueId: values[0] || '',
            name: values[1] || '',
            email: values[2] || '',
            phone: values[3] || '',
            ageGroup: values[4] || '',
            cuisinePreference: values[5] || '',
            breakfast: values[6] || '',
            lunch: values[7] || '',
            dinner: values[8] || '',
            snacks: values[9] || '',
            additionalNotes: values[10] || '',
            submittedAt: new Date().toISOString()
          };
          csvEntries.push(entry);
        }
      }
      
      if (csvEntries.length > 0) {
        setEntries(csvEntries);
        setShowCSVUpload(false);
        alert(`Loaded ${csvEntries.length} entries from CSV file.`);
      }
    };
    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const headers = [
      'Unique ID', 'Name', 'Email', 'Phone', 'Age Group', 'Cuisine Preference',
      'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Additional Notes'
    ];

    const sampleData = [
      'EMP001', 'John Doe', 'john@example.com', '+1234567890', 'Adult (30-49)', 'North Indian',
      'Paratha with curd OR Oats with milk', 'Rice AND dal AND vegetables', 'Roti AND chicken curry', 'Tea with biscuits OR fruits', 'No allergies'
    ];
    
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutreeai_bulk_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCurrentData = () => {
    const headers = [
      'Unique ID', 'Name', 'Email', 'Phone', 'Age Group', 'Cuisine Preference',
      'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Additional Notes', 'Submitted At'
    ];

    const csvData = entries.map(entry => [
      entry.uniqueId, entry.name, entry.email, entry.phone, entry.ageGroup, entry.cuisinePreference,
      entry.breakfast, entry.lunch, entry.dinner, entry.snacks, entry.additionalNotes, entry.submittedAt
    ]);
    
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutreeai_bulk_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Nutrition Data Collection</h1>
              <p className="text-gray-600 mt-2">
                Collect nutrition data from multiple users for batch analysis
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addNewEntry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Entry
            </button>
            <button
              onClick={() => setShowCSVUpload(!showCSVUpload)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📁 Upload CSV
            </button>
            <button
              onClick={downloadCSVTemplate}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📥 Download Template
            </button>
            <button
              onClick={exportCurrentData}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              📤 Export Data
            </button>
          </div>

          {/* CSV Upload Section */}
          {showCSVUpload && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Upload CSV File</h3>
              <p className="text-blue-700 text-sm mb-3">
                Upload a CSV file with columns: Unique ID, Name, Email, Phone, Age Group, Cuisine Preference,
                Breakfast, Lunch, Dinner, Snacks, Additional Notes. Use OR/AND operators in meal fields for variety.
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="block w-full text-sm text-blue-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Entry #{index + 1}
                  </h3>
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Unique ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unique ID * <span className="text-xs text-gray-500">(Employee ID, Student ID, etc.)</span>
                    </label>
                    <input
                      type="text"
                      value={entry.uniqueId}
                      onChange={(e) => updateEntry(index, 'uniqueId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., EMP001, STU123, etc."
                      required
                    />
                  </div>

                  {/* Personal Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={entry.name}
                      onChange={(e) => updateEntry(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={entry.email}
                      onChange={(e) => updateEntry(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={entry.phone}
                      onChange={(e) => updateEntry(index, 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group *
                    </label>
                    <select
                      value={entry.ageGroup}
                      onChange={(e) => updateEntry(index, 'ageGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select age group</option>
                      <option value="Child (5-12)">Child (5-12)</option>
                      <option value="Teen (13-19)">Teen (13-19)</option>
                      <option value="Young Adult (20-29)">Young Adult (20-29)</option>
                      <option value="Adult (30-49)">Adult (30-49)</option>
                      <option value="Middle-aged (50-64)">Middle-aged (50-64)</option>
                      <option value="Senior (65+)">Senior (65+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Preference *
                    </label>
                    <select
                      value={entry.cuisinePreference}
                      onChange={(e) => updateEntry(index, 'cuisinePreference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select cuisine</option>
                      <option value="North Indian">North Indian</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Maharashtrian">Maharashtrian</option>
                      <option value="Continental">Continental</option>
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Keto">Keto</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Food Log */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Daily Food Log</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Breakfast
                      </label>
                      <textarea
                        value={entry.breakfast}
                        onChange={(e) => updateEntry(index, 'breakfast', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="e.g., Paratha with curd OR Oats with milk OR Bread AND butter"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lunch
                      </label>
                      <textarea
                        value={entry.lunch}
                        onChange={(e) => updateEntry(index, 'lunch', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="e.g., Rice AND dal AND vegetables OR Roti AND sabzi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dinner
                      </label>
                      <textarea
                        value={entry.dinner}
                        onChange={(e) => updateEntry(index, 'dinner', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="e.g., Roti AND chicken curry OR Rice AND dal AND vegetables"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Snacks
                      </label>
                      <textarea
                        value={entry.snacks}
                        onChange={(e) => updateEntry(index, 'snacks', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="e.g., Tea with biscuits OR Coffee AND cookies OR Fruits"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={entry.additionalNotes}
                      onChange={(e) => updateEntry(index, 'additionalNotes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Any allergies, dietary restrictions, health conditions, or special notes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : `Submit ${entries.length} Entries for Analysis`}
            </button>
          </div>
        </form>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Instructions for Bulk Data Collection</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Unique ID is required</strong> for each entry (Employee ID, Student ID, etc.)</li>
            <li>• Fill in at least one meal (breakfast, lunch, or dinner) for each entry</li>
            <li>• Use natural language to describe meals (e.g., "Rice with dal and vegetables")</li>
            <li>• <strong>Use OR for alternatives:</strong> "Eggs OR Oats OR Paratha" (different options on different days)</li>
            <li>• <strong>Use AND for combinations:</strong> "Rice AND dal AND vegetables" (items eaten together)</li>
            <li>• <strong>Mix both operators:</strong> "Rice AND dal OR Roti AND sabzi" (complex meal patterns)</li>
            <li>• Include cooking methods when possible (fried, boiled, grilled)</li>
            <li>• Mention approximate quantities if known (e.g., "2 rotis", "1 bowl rice")</li>
            <li>• Use local food names - our AI understands cultural terms</li>
            <li>• You can upload a CSV file for faster data entry</li>
            <li>• Download the CSV template to see the required format</li>
            <li>• Reports will be generated with unique IDs for easy organization tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulkDataCollection;

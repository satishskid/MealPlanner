import React, { useState, useRef, ChangeEvent, useEffect } from 'react';

interface FoodInputProps {
  onSubmit: (payload: { food?: string; imageFile?: File }) => void;
  isLoading: boolean;
}

const FoodInput: React.FC<FoodInputProps> = ({ onSubmit, isLoading }) => {
  const [food, setFood] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URL when component unmounts or image changes
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic validation for image type (can be expanded)
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (e.g., JPG, PNG, WEBP).');
        // Clear the input value if the file is not an image
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
        }
        return;
      }
      setSelectedImage(file);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl); // Revoke old URL
      }
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (food.trim() || selectedImage) {
      onSubmit({ food: food.trim(), imageFile: selectedImage });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="foodInput" className="block text-lg font-medium text-gray-700 mb-1">
            Enter food item or upload an image:
          </label>
          <input
            id="foodInput"
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="e.g., '1 large apple' or describe image"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          />
           <p className="text-xs text-gray-500 mt-1">You can describe the food, upload an image, or both.</p>
        </div>

        <div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            id="imageUpload"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {selectedImage ? 'Change Image' : 'Upload Image'}
          </button>
        </div>

        {imagePreviewUrl && (
          <div className="mt-3 relative group w-40 h-40 mx-auto border border-gray-200 rounded-md overflow-hidden shadow-sm">
            <img src={imagePreviewUrl} alt="Selected food" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
              aria-label="Clear image"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading || (!food.trim() && !selectedImage)}
          className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FoodInput;
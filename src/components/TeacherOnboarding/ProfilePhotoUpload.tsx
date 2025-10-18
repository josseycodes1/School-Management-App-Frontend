'use client';
import { ChangeEvent } from 'react';

interface ProgressData {
  completed: boolean;
  progress: number;
  required_fields: {
    phone: boolean;
    address: boolean;
    gender: boolean;
    birth_date: boolean;
    subject_specialization: boolean;
    hire_date: boolean;
    photo: boolean;
  };
}

interface ProfilePhotoUploadProps {
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  progress: ProgressData;
}

export default function ProfilePhotoUpload({ 
  previewImage, 
  onFileChange, 
  error,
  progress 
}: ProfilePhotoUploadProps) {
  
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e);
    }
  };

  return (
    <div className={`${error && 'border-l-4 border-red-500 pl-3'}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo *</h2>
      
      <div className="flex items-start">
        {/* Photo Preview */}
        <div className="mr-6">
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Profile preview" 
                className="h-24 w-24 rounded-full object-cover border-2 border-green-500"
              />
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-500 text-sm text-center px-2">No photo selected</span>
            </div>
          )}
        </div>
        
        {/* Upload Controls */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload a clear photo of your face
          </label>
          
          <div className="flex items-center space-x-4">
            <label
              htmlFor="photo"
              className="cursor-pointer bg-[#FC46AA] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#e03d98] transition-colors duration-200"
            >
              Choose Photo
            </label>
            
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {previewImage && (
              <span className="text-sm text-green-600 font-medium">
                Photo selected ✓
              </span>
            )}
          </div>
          
          {/* Instructions and Error Messages */}
          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-2">
              <strong>Requirements:</strong>
            </p>
            <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
              <li>JPEG, PNG, or WebP format</li>
              <li>Maximum file size: 5MB</li>
              <li>Clear, recent photo of your face</li>
              <li>Professional appearance recommended</li>
            </ul>
            
            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">⚠ {error}</p>
              </div>
            )}
            
            {!error && previewImage && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600 font-medium">
                  ✓ Profile photo looks good! You can proceed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
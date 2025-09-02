import { ChangeEvent } from 'react';
import { ProgressData } from './types';

interface ProfilePhotoUploadProps {
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  progress: ProgressData;
}

export default function ProfilePhotoUpload({ previewImage, onFileChange, progress }: ProfilePhotoUploadProps) {
  return (
    <div className={`${!progress.required_fields.photo && 'border-l-4 border-red-500 pl-3'}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo *</h2>
      <div className="flex items-center">
        <div className="mr-4">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Preview" 
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
              <span className="text-gray-500 text-xs">No photo</span>
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#FC46AA] file:text-white
              hover:file:bg-[#e03d98]"
            required
          />
          <p className="mt-1 text-xs text-gray-500">JPEG or PNG, max 5MB</p>
        </div>
      </div>
    </div>
  );
}
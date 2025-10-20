import { ChangeEvent } from 'react';
import { toast } from 'react-hot-toast';
import { ProgressData, ValidationErrors } from './types';

interface ProfilePhotoUploadProps {
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  progress: ProgressData;
  validationErrors: ValidationErrors; // ADD THIS
}

export default function ProfilePhotoUpload({ previewImage, onFileChange, progress, validationErrors }: ProfilePhotoUploadProps) {
  
  const hasError = (fieldName: keyof ValidationErrors) => {
    return !!validationErrors[fieldName];
  };

  const getErrorMessage = (fieldName: keyof ValidationErrors) => {
    return validationErrors[fieldName];
  };

  return (
    <div className={`${!progress.required_fields.photo && 'border-l-4 border-red-500 pl-3'}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo *</h2>
      
      <div className="flex items-center">
        <div className="mr-4">
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile preview" 
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No photo</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload a clear photo of your face
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={onFileChange}
            className={`block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#FC46AA] file:text-white
              hover:file:bg-[#e03d98] ${
                hasError('photo') ? 'border-red-500' : ''
              }`}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            JPEG or PNG, max 5MB
          </p>
          {/* ERROR MESSAGE DISPLAY */}
          {hasError('photo') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('photo')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// import { ChangeEvent } from 'react';
// import { toast } from 'react-hot-toast';
// import { ProgressData } from './types';

// interface ProfilePhotoUploadProps {
//   previewImage: string | null;
//   onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   progress: ProgressData;
// }

// export default function ProfilePhotoUpload({ previewImage, onFileChange, progress }: ProfilePhotoUploadProps) {
//   return (
//     <div className={`${!progress.required_fields.photo && 'border-l-4 border-red-500 pl-3'}`}>
//       <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo *</h2>
      
//       <div className="flex items-center">
//         <div className="mr-4">
//           {previewImage ? (
//             <img 
//               src={previewImage} 
//               alt="Profile preview" 
//               className="h-24 w-24 rounded-full object-cover"
//             />
//           ) : (
//             <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
//               <span className="text-gray-500">No photo</span>
//             </div>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Upload a clear photo of your face
//           </label>
//           <input
//             type="file"
//             id="photo"
//             name="photo"
//             accept="image/*"
//             onChange={onFileChange}
//             className="block w-full text-sm text-gray-500
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-md file:border-0
//               file:text-sm file:font-semibold
//               file:bg-[#FC46AA] file:text-white
//               hover:file:bg-[#e03d98]"
//             required
//           />
//           <p className="mt-1 text-sm text-gray-500">
//             JPEG or PNG, max 5MB
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
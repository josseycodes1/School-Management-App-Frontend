import { FormData, ProgressData, ValidationErrors } from './types';

interface ParentInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
  validationErrors: ValidationErrors; // ADD THIS
}

export default function ParentInfoForm({ formData, onChange, progress, validationErrors }: ParentInfoFormProps) {
  
  const hasError = (fieldName: keyof ValidationErrors) => {
    return !!validationErrors[fieldName];
  };

  const getErrorMessage = (fieldName: keyof ValidationErrors) => {
    return validationErrors[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        <div className={`sm:col-span-3 ${!progress.required_fields.parent_name && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Name *
          </label>
          <input
            type="text"
            name="parent_name"
            id="parent_name"
            value={formData.parent_name}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('parent_name') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          />
          {hasError('parent_name') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('parent_name')}
            </p>
          )}
        </div>

        <div className={`sm:col-span-3 ${!progress.required_fields.parent_contact && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="parent_contact" className="block text-sm font-medium text-gray-700">
            Parent/Guardian Contact *
          </label>
          <input
            type="tel"
            name="parent_contact"
            id="parent_contact"
            value={formData.parent_contact}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('parent_contact') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          />
          {hasError('parent_contact') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('parent_contact')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// import { FormData, ProgressData } from './types';

// interface ParentInfoFormProps {
//   formData: FormData;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
//   progress: ProgressData;
// }

// export default function ParentInfoForm({ formData, onChange, progress }: ParentInfoFormProps) {
//   return (
//     <div className="border-b border-gray-200 pb-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h2>
      
//       <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
//         <div className={`sm:col-span-3 ${!progress.required_fields.parent_name && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
//             Parent/Guardian Name *
//           </label>
//           <input
//             type="text"
//             name="parent_name"
//             id="parent_name"
//             value={formData.parent_name}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           />
//         </div>

//         <div className={`sm:col-span-3 ${!progress.required_fields.parent_contact && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="parent_contact" className="block text-sm font-medium text-gray-700">
//             Parent/Guardian Contact *
//           </label>
//           <input
//             type="tel"
//             name="parent_contact"
//             id="parent_contact"
//             value={formData.parent_contact}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
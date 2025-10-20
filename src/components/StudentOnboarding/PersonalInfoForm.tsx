import { FormData, ProgressData, ValidationErrors } from './types';

interface PersonalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  progress: ProgressData;
  validationErrors: ValidationErrors; // ADD THIS PROP
}

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-'
];

export default function PersonalInfoForm({ formData, onChange, progress, validationErrors }: PersonalInfoFormProps) {
  
  // HELPER FUNCTION TO CHECK IF A FIELD HAS ERROR
  const hasError = (fieldName: keyof ValidationErrors) => {
    return !!validationErrors[fieldName];
  };

  // HELPER FUNCTION TO GET ERROR MESSAGE
  const getErrorMessage = (fieldName: keyof ValidationErrors) => {
    return validationErrors[fieldName];
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        
        {/* PHONE FIELD WITH ERROR HANDLING */}
        <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('phone') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          />
          {/* ERROR MESSAGE DISPLAY */}
          {hasError('phone') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('phone')}
            </p>
          )}
        </div>

        {/* GENDER FIELD WITH ERROR HANDLING */}
        <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('gender') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
            <option value="N">Prefer not to say</option>
          </select>
          {/* ERROR MESSAGE DISPLAY */}
          {hasError('gender') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('gender')}
            </p>
          )}
        </div>

        {/* ADDRESS FIELD WITH ERROR HANDLING */}
        <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('address') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          />
          {/* ERROR MESSAGE DISPLAY */}
          {hasError('address') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('address')}
            </p>
          )}
        </div>

        {/* BIRTH DATE FIELD WITH ERROR HANDLING */}
        <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
            Birth Date *
          </label>
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            value={formData.birth_date}
            onChange={onChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border ${
              hasError('birth_date') 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            required
          />
          {/* ERROR MESSAGE DISPLAY */}
          {hasError('birth_date') && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {getErrorMessage('birth_date')}
            </p>
          )}
        </div>

        {/* BLOOD TYPE FIELD (OPTIONAL - NO ERROR HANDLING NEEDED) */}
        <div className="sm:col-span-3">
          <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">
            Blood Type
          </label>
          <select
            id="blood_type"
            name="blood_type"
            value={formData.blood_type}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
          >
            <option value="">Select blood type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">Optional</p>
        </div>

      </div>
    </div>
  );
}


// import { FormData, ProgressData } from './types';

// interface PersonalInfoFormProps {
//   formData: FormData;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
//   progress: ProgressData;
// }

// const bloodTypes = [
//   'A+', 'A-', 'B+', 'B-', 
//   'AB+', 'AB-', 'O+', 'O-'
// ];

// export default function PersonalInfoForm({ formData, onChange, progress }: PersonalInfoFormProps) {
//   return (
//     <div className="border-b border-gray-200 pb-6">
//       <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      
//       <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
//         <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//             Phone Number *
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             id="phone"
//             value={formData.phone}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           />
//         </div>

//         <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
//             Gender *
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={formData.gender}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           >
//             <option value="">Select gender</option>
//             <option value="M">Male</option>
//             <option value="F">Female</option>
//             <option value="O">Other</option>
//             <option value="N">Prefer not to say</option>
//           </select>
//         </div>

//         <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//             Address *
//           </label>
//           <input
//             type="text"
//             name="address"
//             id="address"
//             value={formData.address}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           />
//         </div>

//         <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
//           <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
//             Birth Date *
//           </label>
//           <input
//             type="date"
//             name="birth_date"
//             id="birth_date"
//             value={formData.birth_date}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//             required
//           />
//         </div>

//         <div className="sm:col-span-3">
//           <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">
//             Blood Type
//           </label>
//           <select
//             id="blood_type"
//             name="blood_type"
//             value={formData.blood_type}
//             onChange={onChange}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
//           >
//             <option value="">Select blood type</option>
//             {bloodTypes.map(type => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }
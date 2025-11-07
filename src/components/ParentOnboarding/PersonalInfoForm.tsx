import { FormData, ProgressData } from './types';

interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  emergency_contact?: string;
  photo?: string;
  [key: string]: string | undefined;
}

interface PersonalInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: ValidationErrors;
  getFieldError: (fieldName: string) => string | undefined;
  progress: ProgressData;
}

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-'
];

export default function PersonalInfoForm({ 
  formData, 
  onChange, 
  onBlur,
  errors,
  getFieldError,
  progress 
}: PersonalInfoFormProps) {
  
  const getInputClass = (fieldName: string) => {
    const baseClass = "mt-1 block w-full rounded-md shadow-sm focus:ring-[#FC46AA] sm:text-sm p-2 border";
    const error = getFieldError(fieldName);
    
    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:border-[#FC46AA]`;
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Phone */}
        <div className={`sm:col-span-3 ${getFieldError('phone') && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('phone')}
            placeholder="e.g., 123-456-7890"
            required
          />
          {getFieldError('phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
          )}
          {!getFieldError('phone') && formData.phone && (
            <p className="mt-1 text-sm text-blue-600">✓ Valid phone number</p>
          )}
        </div>

        {/* Gender */}
        <div className={`sm:col-span-3 ${getFieldError('gender') && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('gender')}
            required
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          {getFieldError('gender') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('gender')}</p>
          )}
          {!getFieldError('gender') && formData.gender && (
            <p className="mt-1 text-sm text-blue-600">✓ Gender selected</p>
          )}
        </div>

        {/* Address */}
        <div className={`sm:col-span-6 ${getFieldError('address') && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('address')}
            placeholder="Enter your complete address"
            required
          />
          {getFieldError('address') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
          )}
          {!getFieldError('address') && formData.address && (
            <p className="mt-1 text-sm text-blue-600">✓ Address looks good</p>
          )}
        </div>

        {/* Birth Date */}
        <div className={`sm:col-span-3 ${getFieldError('birth_date') && 'border-l-4 border-red-500 pl-3'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('birth_date')}
            required
          />
          {getFieldError('birth_date') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('birth_date')}</p>
          )}
          {!getFieldError('birth_date') && formData.birth_date && (
            <p className="mt-1 text-sm text-blue-600">✓ Valid birth date</p>
          )}
        </div>

        {/* Blood Type */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={onChange}
            onBlur={onBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-josseypink1 focus:ring-josseypink1 sm:text-sm p-2 border"
          >
            <option value="">Select blood type</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {formData.blood_type && (
            <p className="mt-1 text-sm text-blue-600">✓ Blood type selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
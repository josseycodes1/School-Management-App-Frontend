import { FormData, ProgressData } from './types';

interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  admission_number?: string;
  class_level?: string;
  photo?: string;
  parent_name?: string;
  parent_contact?: string;
  [key: string]: string | undefined;
}

interface AcademicInfoFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: ValidationErrors;
  getFieldError: (fieldName: string) => string | undefined;
  progress: ProgressData;
}

const classLevels = [
  'JSS1', 'JSS2', 'JSS3',
  'SSS1', 'SSS2', 'SSS3'
];

export default function AcademicInfoForm({ 
  formData, 
  onChange, 
  onBlur,
  errors,
  getFieldError,
  progress 
}: AcademicInfoFormProps) {
  
  const getInputClass = (fieldName: string) => {
    const baseClass = "mt-1 block w-full rounded-md shadow-sm focus:ring-josseypink1 sm:text-sm p-2 border";
    const error = getFieldError(fieldName);
    
    if (error) {
      return `${baseClass} border-red-300 focus:border-red-500 bg-red-50`;
    }
    return `${baseClass} border-gray-300 focus:border-josseypink1`;
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
      
      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
        {/* Admission Number - Auto-generated */}
        <div className="sm:col-span-3">
          <label htmlFor="admission_number" className="block text-sm font-medium text-gray-700">
            Admission Number
          </label>
          <input
            type="text"
            name="admission_number"
            id="admission_number"
            value={formData.admission_number}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2 border"
            placeholder="Will be generated automatically"
          />
          <p className="mt-1 text-sm text-gray-500">
            Your admission number will be automatically generated after you submit the form.
          </p>
          {formData.admission_number && (
            <p className="mt-1 text-sm text-josseypink1">✓ Admission number assigned</p>
          )}
        </div>

        {/* Class Level */}
        <div className={`sm:col-span-3 ${getFieldError('class_level') && 'border-l-4 border-red-500 pl-3'}`}>
          <label htmlFor="class_level" className="block text-sm font-medium text-gray-700">
            Class Level *
          </label>
          <select
            id="class_level"
            name="class_level"
            value={formData.class_level}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClass('class_level')}
            required
          >
            <option value="">Select class</option>
            {classLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {getFieldError('class_level') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('class_level')}</p>
          )}
          {!getFieldError('class_level') && formData.class_level && (
            <p className="mt-1 text-sm text-josseypink1">✓ Class level selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
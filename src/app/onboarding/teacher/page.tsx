'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ProgressHeader from '@/components/TeacherOnboarding/ProgressHeader';
import PersonalInfoForm from '@/components/TeacherOnboarding/PersonalInfoForm';
import ProfessionalInfoForm from '@/components/TeacherOnboarding/ProfessionalInfoForm';
import ProfilePhotoUpload from '@/components/TeacherOnboarding/ProfilePhotoUpload';

export interface FormData {
  phone: string;
  address: string;
  gender: string;
  birth_date: string;
  blood_type: string;
  subject_specialization: string;
  hire_date: string;
  qualifications: string;
  photo: File | null;
  photo_url?: string; // For existing photo URL from backend
}

export interface ProgressData {
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

export interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  subject_specialization?: string;
  hire_date?: string;
  photo?: string;
  [key: string]: string | undefined;
}

export default function TeacherOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    address: '',
    gender: '',
    birth_date: '',
    blood_type: '',
    subject_specialization: '',
    hire_date: '',
    qualifications: '',
    photo: null,
    photo_url: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressData>({
    completed: false,
    progress: 0,
    required_fields: {
      phone: false,
      address: false,
      gender: false,
      birth_date: false,
      subject_specialization: false,
      hire_date: false,
      photo: false
    }
  });

  // Validation functions
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'phone':
        if (!value) return 'Phone number is required';
        // More flexible phone validation
        const cleanedPhone = value.replace(/[\s\-\(\)\+]/g, '');
        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(cleanedPhone)) {
          return 'Please enter a valid phone number (8-15 digits)';
        }
        return undefined;

      case 'address':
        if (!value) return 'Address is required';
        if (value.length < 10) return 'Address should be at least 10 characters';
        return undefined;

      case 'gender':
        if (!value) return 'Gender is required';
        return undefined;

      case 'birth_date':
        if (!value) return 'Birth date is required';
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate > today) return 'Birth date cannot be in the future';
        // Check if age is at least 18
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 18);
        if (birthDate > minAgeDate) return 'You must be at least 18 years old';
        return undefined;

      case 'hire_date':
        if (!value) return 'Hire date is required';
        const hireDate = new Date(value);
        const todayDate = new Date();
        if (hireDate > todayDate) return 'Hire date cannot be in the future';
        return undefined;

      case 'subject_specialization':
        if (!value) return 'Subject specialization is required';
        if (value.length < 2) return 'Subject specialization should be at least 2 characters';
        return undefined;

      case 'photo':
        if (!value && !previewImage) return 'Profile photo is required';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
      const errors: ValidationErrors = {};
      
      // Only validate REQUIRED fields
      const requiredFields: (keyof FormData)[] = [
        'phone', 'address', 'gender', 'birth_date', 
        'subject_specialization', 'hire_date'
      ];

      requiredFields.forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
        }
      });

      // Special handling for photo
      if (!formData.photo && !previewImage) {
        errors.photo = 'Profile photo is required';
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };

  // Check if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) {
          router.push('/log-in');
          return;
        }

        // Get onboarding progress
        const progressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/onboarding/progress/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setProgress(progressRes.data);

        // If onboarding is complete, redirect to dashboard
        if (progressRes.data.completed) {
          router.push('/teacher');
          return;
        }

        // Pre-fill existing data if available
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/onboarding/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const existingData = profileRes.data;
        setFormData(prev => ({
          ...prev,
          ...existingData,
          photo: null,
          photo_url: existingData.photo || ''
        }));

        if (existingData.photo) {
          setPreviewImage(existingData.photo);
        }

      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast.error('Failed to load onboarding data');
      } finally {
        setLoadingProgress(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // Mark field as touched
  setTouchedFields(prev => new Set(prev).add(name));

  // Validate field in real-time
  const error = validateField(name, value);
  setValidationErrors(prev => ({
    ...prev,
    [name]: error
  }));
};

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = 'Please select a valid image file (JPEG, PNG, or WebP)';
      setValidationErrors(prev => ({ ...prev, photo: errorMsg }));
      toast.error(errorMsg);
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'File size should be less than 5MB';
      setValidationErrors(prev => ({ ...prev, photo: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setFormData(prev => ({
      ...prev,
      photo: file
    }));

    // Clear photo error
    setValidationErrors(prev => ({ ...prev, photo: undefined }));

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.onerror = () => {
      const errorMsg = 'Failed to read file';
      setValidationErrors(prev => ({ ...prev, photo: errorMsg }));
      toast.error(errorMsg);
    };
    reader.readAsDataURL(file);
  }
};

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => new Set(prev).add(name));
    
    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return touchedFields.has(fieldName) ? validationErrors[fieldName] : undefined;
  };

  const calculateProgress = (): void => {
      const requiredFields: (keyof FormData)[] = [
        'phone', 'address', 'gender', 'birth_date', 
        'subject_specialization', 'hire_date'
      ];
      
      // Count how many required fields are filled and valid
      const filledFields = requiredFields.filter(field => {
        const value = formData[field];
        const stringValue = value ? value.toString().trim() : '';
        const validationError = validateField(field, value);
        return stringValue !== '' && !validationError;
      }).length;
      
      // Add photo if present
      const hasPhoto = !!formData.photo || !!previewImage;
      const totalFilled = filledFields + (hasPhoto ? 1 : 0);
      const totalRequired = requiredFields.length + 1; // +1 for photo
      
      const progressPercentage = Math.round((totalFilled / totalRequired) * 100);
      
      // Update required_fields for the progress display
      const requiredFieldsStatus = {
        phone: !!formData.phone && !validateField('phone', formData.phone),
        address: !!formData.address && !validateField('address', formData.address),
        gender: !!formData.gender && !validateField('gender', formData.gender),
        birth_date: !!formData.birth_date && !validateField('birth_date', formData.birth_date),
        subject_specialization: !!formData.subject_specialization && !validateField('subject_specialization', formData.subject_specialization),
        hire_date: !!formData.hire_date && !validateField('hire_date', formData.hire_date),
        photo: hasPhoto
      };
      
      setProgress({
        completed: progressPercentage === 100,
        progress: progressPercentage,
        required_fields: requiredFieldsStatus
      });
    };

  useEffect(() => {
    calculateProgress();
  }, [formData, previewImage]);

  const isFormValid = (): boolean => {
      // Define required fields with proper typing
      const requiredFields: (keyof FormData)[] = [
        'phone', 'address', 'gender', 'birth_date', 
        'subject_specialization', 'hire_date'
      ];
      
      // Check if all required fields have values and pass validation
      const hasAllRequiredFields = requiredFields.every(field => {
        const value = formData[field];
        const stringValue = value ? value.toString().trim() : '';
        const validationError = validateField(field, value);
        return stringValue !== '' && !validationError;
      });
      
      // Check photo exists
      const hasPhoto = !!formData.photo || !!previewImage;
      
      // Check no validation errors - filter out undefined/empty errors
      const actualErrors = Object.values(validationErrors).filter(error => 
        error && error.trim() !== ''
      );
      const hasNoErrors = actualErrors.length === 0;
      
      return hasAllRequiredFields && hasPhoto && hasNoErrors;
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    const allFields = ['phone', 'address', 'gender', 'birth_date', 'subject_specialization', 'hire_date', 'photo'];
    setTouchedFields(prev => new Set([...prev, ...allFields]));

    // Final validation
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }

    if (!isFormValid()) {
      toast.error('Please complete all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();

      function formatDateForBackend(date: string | Date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
      }

      // Append all fields with proper names
      formPayload.append('phone', formData.phone);
      formPayload.append('address', formData.address);
      formPayload.append('gender', formData.gender);
      formPayload.append('birth_date', formatDateForBackend(formData.birth_date));
      formPayload.append('subject_specialization', formData.subject_specialization);
      formPayload.append('hire_date', formatDateForBackend(formData.hire_date));
      
      if (formData.photo) {
        formPayload.append('photo', formData.photo);
      }
      
      // Optional fields
      if (formData.blood_type) {
        formPayload.append('blood_type', formData.blood_type);
      }
      if (formData.qualifications) {
        formPayload.append('qualifications', formData.qualifications);
      }

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        router.push('/log-in');
        return;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/onboarding/`,
        formPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Check progress after submission
      const progressRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/teachers/onboarding/progress/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setProgress(progressRes.data);

      if (progressRes.data.completed) {
        toast.success('Onboarding completed successfully!');
        router.push('/teacher');
      } else {
        toast.success('Progress saved successfully!');
      }

    } catch (error: any) {
      console.error('Error:', error);
      
      if (error.response?.data) {
        // Handle backend validation errors
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          const newErrors: ValidationErrors = {};
          Object.entries(backendErrors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              newErrors[key] = value.join(', ');
              value.forEach(err => toast.error(`${key}: ${err}`));
            } else {
              newErrors[key] = value as string;
              toast.error(`${key}: ${value}`);
            }
          });
          setValidationErrors(newErrors);
        } else {
          toast.error(backendErrors.detail || 'Onboarding failed. Please check your data.');
        }
      } else if (error.request) {
        toast.error('No response from server. Please check your connection and try again.');
      } else {
        toast.error('Request error: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProgress) {
    return (
      <div className="min-h-screen bg-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-[#FC46AA] border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Checking onboarding status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ProgressHeader progress={progress} />
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <PersonalInfoForm 
            formData={formData} 
            onChange={handleChange}
            onBlur={handleBlur}
            errors={validationErrors}
            getFieldError={getFieldError}
            progress={progress} 
          />
          
          <ProfessionalInfoForm 
            formData={formData} 
            onChange={handleChange}
            onBlur={handleBlur}
            errors={validationErrors}
            getFieldError={getFieldError}
            progress={progress} 
          />
          
          <ProfilePhotoUpload 
            previewImage={previewImage} 
            onFileChange={handleFileChange}
            error={getFieldError('photo')}
            progress={progress} 
          />

          {/* Validation Summary */}
            {Object.keys(validationErrors).filter(key => validationErrors[key]).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-red-800 font-medium mb-2">
                  Please fix the following errors:
                </h3>
                <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                  {Object.entries(validationErrors)
                    .filter(([field, error]) => error && error.trim() !== '')
                    .map(([field, error]) => (
                      <li key={field}>
                        <span className="capitalize">{field.replace('_', ' ')}</span>: {error}
                      </li>
                    ))
                  }
                </ul>
              </div>
            )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FC46AA] hover:bg-[#e03d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC46AA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="spinner border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin mr-2"></div>
                  Submitting...
                </span>
              ) : progress.completed ? 'Update Profile' : 'Complete Onboarding'}
            </button>
            
            {!isFormValid() && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Please complete all required fields correctly to submit the form
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
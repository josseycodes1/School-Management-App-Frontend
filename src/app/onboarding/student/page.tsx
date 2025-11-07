'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ProgressHeader from '@/components/StudentOnboarding/ProgressHeader';
import PersonalInfoForm from '@/components/StudentOnboarding/PersonalInfoForm';
import ParentInfoForm from '@/components/StudentOnboarding/ParentInfoForm';
import AcademicInfoForm from '@/components/StudentOnboarding/AcademicInfoForm';
import MedicalInfoForm from '@/components/StudentOnboarding/MedicalInfoForm';
import ProfilePhotoUpload from '@/components/StudentOnboarding/ProfilePhotoUpload';

export interface FormData {
  phone: string;
  address: string;
  gender: string;
  birth_date: string;
  blood_type: string;
  admission_number: string;
  class_level: string;
  photo: File | null;
  medical_notes: string;
  parent_name: string;
  parent_contact: string;
}

export interface ProgressData {
  completed: boolean;
  progress: number;
  required_fields: {
    phone: boolean;
    address: boolean;
    gender: boolean;
    birth_date: boolean;
    admission_number: boolean;
    class_level: boolean;
    photo: boolean;
    parent_name: boolean;
    parent_contact: boolean;
  };
}

export interface ValidationErrors {
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

export default function StudentOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    address: '',
    gender: '',
    birth_date: '',
    blood_type: '',
    admission_number: '',
    class_level: '',
    photo: null,
    medical_notes: '',
    parent_name: '',
    parent_contact: ''
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
      admission_number: false,
      class_level: false,
      photo: false,
      parent_name: false,
      parent_contact: false
    }
  });


  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'phone':
        if (!value) return 'Phone number is required';
        const cleanedPhone = value.replace(/[\s\-\(\)\+]/g, '');
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(cleanedPhone)) {
          return 'Please enter a valid phone number (10-15 digits)';
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
        
        const minStudentAge = new Date();
        minStudentAge.setFullYear(today.getFullYear() - 6);
        if (birthDate > minStudentAge) return 'Student must be at least 6 years old';
        return undefined;

      case 'class_level':
        if (!value) return 'Class level is required';
        return undefined;

      case 'parent_name':
        if (!value) return 'Parent name is required';
        if (value.length < 2) return 'Parent name should be at least 2 characters';
        return undefined;

      case 'parent_contact':
        if (!value) return 'Parent contact is required';
        const cleanedParentContact = value.replace(/[\s\-\(\)\+]/g, '');
        const parentPhoneRegex = /^[0-9]{10,15}$/;
        if (!parentPhoneRegex.test(cleanedParentContact)) {
          return 'Please enter a valid parent contact number (10-15 digits)';
        }
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
    
    const requiredFields: (keyof FormData)[] = [
      'phone', 'address', 'gender', 'birth_date', 
      'class_level', 'parent_name', 'parent_contact'
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

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

        
        const progressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setProgress(progressRes.data);

       
        if (progressRes.data.completed) {
          router.push('/student');
          return;
        }

        
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const profileData = profileRes.data;
        console.log('📥 Fetched profile data:', profileData);

        setFormData(prev => ({
          ...prev,
          ...profileData,
          photo: null,
          birth_date: profileData.birth_date || '',
          class_level: profileData.class_level || ''
        }));

        if (profileData.photo) {
          setPreviewImage(profileData.photo);
        }

        
        if (profileData.admission_number) {
          setFormData(prev => ({
            ...prev,
            admission_number: profileData.admission_number
          }));
        }

      } catch (error) {
        console.error('Error checking onboarding status:', error);
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

    setTouchedFields(prev => new Set(prev).add(name));

    const error = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = 'Please select a valid image file (JPEG, PNG, or WebP)';
        setValidationErrors(prev => ({ ...prev, photo: errorMsg }));
        toast.error(errorMsg);
        return;
      }
      
      
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

      setValidationErrors(prev => ({ ...prev, photo: undefined }));

      
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
      'class_level', 'parent_name', 'parent_contact'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = formData[field];
      const stringValue = value ? value.toString().trim() : '';
      const validationError = validateField(field, value);
      return stringValue !== '' && !validationError;
    }).length;
    
    const hasPhoto = !!formData.photo || !!previewImage;
    const totalFilled = filledFields + (hasPhoto ? 1 : 0);
    const totalRequired = requiredFields.length + 1;
    
    const progressPercentage = Math.round((totalFilled / totalRequired) * 100);
    
    const requiredFieldsStatus = {
      phone: !!formData.phone && !validateField('phone', formData.phone),
      address: !!formData.address && !validateField('address', formData.address),
      gender: !!formData.gender && !validateField('gender', formData.gender),
      birth_date: !!formData.birth_date && !validateField('birth_date', formData.birth_date),
      admission_number: !!formData.admission_number,
      class_level: !!formData.class_level && !validateField('class_level', formData.class_level),
      photo: hasPhoto,
      parent_name: !!formData.parent_name && !validateField('parent_name', formData.parent_name),
      parent_contact: !!formData.parent_contact && !validateField('parent_contact', formData.parent_contact)
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
    const requiredFields: (keyof FormData)[] = [
      'phone', 'address', 'gender', 'birth_date', 
      'class_level', 'parent_name', 'parent_contact'
    ];
    
    const hasAllRequiredFields = requiredFields.every(field => {
      const value = formData[field];
      const stringValue = value ? value.toString().trim() : '';
      const validationError = validateField(field, value);
      return stringValue !== '' && !validationError;
    });
    
    const hasPhoto = !!formData.photo || !!previewImage;
    
    const actualErrors = Object.values(validationErrors).filter(error => 
      error && error.trim() !== ''
    );
    const hasNoErrors = actualErrors.length === 0;
    
    return hasAllRequiredFields && hasPhoto && hasNoErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const allFields = ['phone', 'address', 'gender', 'birth_date', 'class_level', 'parent_name', 'parent_contact', 'photo'];
    setTouchedFields(prev => new Set([...prev, ...allFields]));

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

     
      formPayload.append('phone', formData.phone);
      formPayload.append('address', formData.address);
      formPayload.append('gender', formData.gender);
      formPayload.append('birth_date', formatDateForBackend(formData.birth_date));
      formPayload.append('class_level', formData.class_level);
      if (formData.photo) formPayload.append('photo', formData.photo);
      formPayload.append('parent_name', formData.parent_name);
      formPayload.append('parent_contact', formData.parent_contact);
      
      
      if (formData.blood_type) {
        formPayload.append('blood_type', formData.blood_type);
      }
      if (formData.medical_notes) {
        formPayload.append('medical_notes', formData.medical_notes);
      }

      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        router.push('/log-in');
        return;
      }

      console.log('Submitting onboarding data...');
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/`,
        formPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const userProfileData = response.data;
      console.log('Onboarding response:', userProfileData);
      
     
      localStorage.setItem('user_profile', JSON.stringify(userProfileData));
      localStorage.setItem('onboarding_complete', 'true');
      
      
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          admission_number: userProfileData.admission_number,
          class_level: userProfileData.class_level
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Updated user data with admission number:', updatedUser.admission_number);
      }

      
      const progressRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setProgress(progressRes.data);

      if (progressRes.data.completed) {
        console.log('Onboarding completed successfully!');
        console.log('Admission Number:', userProfileData.admission_number);
        console.log('Class Level:', userProfileData.class_level);
        
        toast.success(`Onboarding completed! Your Admission Number is ${userProfileData.admission_number}`);
        router.push('/student');
      } else {
        toast.success('Progress saved!');
      }

    } catch (error: any) {
      console.error('❌ Onboarding error:', error);
      
      if (error.response?.data) {
        const backendErrors = error.response.data;
        console.error('Backend errors:', backendErrors);
        
        if (typeof backendErrors === 'object') {
          const newErrors: ValidationErrors = {};
          Object.entries(backendErrors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              newErrors[key] = value.join(', ');
              value.forEach((err: string) => toast.error(`${key}: ${err}`));
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
      <div className="min-h-screen bg-josseypink2 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-josseypink1 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Checking onboarding status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-josseypink2 py-10 px-4">
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
          
          <ParentInfoForm 
            formData={formData} 
            onChange={handleChange}
            onBlur={handleBlur}
            errors={validationErrors}
            getFieldError={getFieldError}
            progress={progress} 
          />
          
          <AcademicInfoForm 
            formData={formData} 
            onChange={handleChange}
            onBlur={handleBlur}
            errors={validationErrors}
            getFieldError={getFieldError}
            progress={progress} 
          />
          
          <MedicalInfoForm 
            formData={formData} 
            onChange={handleChange}
            onBlur={handleBlur}
            errors={validationErrors}
            getFieldError={getFieldError}
          />
          
          <ProfilePhotoUpload 
            previewImage={previewImage} 
            onFileChange={handleFileChange}
            error={getFieldError('photo')}
            progress={progress} 
          />

          {/* Debug Info */}
          <div className="bg-gray-100 p-4 rounded-md text-xs">
            <h4 className="font-bold mb-2">Debug Info:</h4>
            <p>Admission Number: {formData.admission_number || 'Not generated'}</p>
            <p>Class Level: {formData.class_level || 'Not selected'}</p>
            <p>Form Valid: {isFormValid() ? 'Yes' : 'No'}</p>
            <p>Progress: {progress.progress}%</p>
            <p>Completed: {progress.completed ? 'Yes' : 'No'}</p>
          </div>

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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-josseypink1 hover:bg-josseypink10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-josseypink1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
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

// ADD THIS NEW INTERFACE FOR VALIDATION ERRORS
export interface ValidationErrors {
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  parent_name?: string;
  parent_contact?: string;
  class_level?: string;
  photo?: string;
  [key: string]: string | undefined;
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
  // ADD THIS FOR BACKEND VALIDATION ERRORS
  validation_errors?: ValidationErrors;
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
  
  // ADD THIS STATE FOR VALIDATION ERRORS
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
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

  // Check if user is already onboarded (NO CHANGES HERE)
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setProgress(progressRes.data);

        // If onboarding is complete, redirect to dashboard
        if (progressRes.data.completed) {
          router.push('/student');
          return;
        }

        // Pre-fill existing data if available
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setFormData(prev => ({
          ...prev,
          ...profileRes.data,
          photo: null
        }));

        if (profileRes.data.photo) {
          setPreviewImage(profileRes.data.photo);
        }

      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoadingProgress(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  // NO CHANGES TO THESE FUNCTIONS
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // COMPLETELY REPLACE THE handleSubmit FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // STEP 1: Frontend Validation - Check for empty required fields
    const errors: ValidationErrors = {};
    
    // Check all required fields
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!formData.birth_date) {
      errors.birth_date = 'Birth date is required';
    }
    
    if (!formData.parent_name.trim()) {
      errors.parent_name = 'Parent/Guardian name is required';
    }
    
    if (!formData.parent_contact.trim()) {
      errors.parent_contact = 'Parent/Guardian contact is required';
    }
    
    if (!formData.class_level) {
      errors.class_level = 'Class level is required';
    }
    
    if (!formData.photo && !previewImage) {
      errors.photo = 'Profile photo is required';
    }
    
    // STEP 2: Format Validation (only if field is not empty)
    const phoneRegex = /^[0-9]{10,15}$/;
    
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10-15 digits only';
    }
    
    if (formData.parent_contact && !phoneRegex.test(formData.parent_contact.replace(/\D/g, ''))) {
      errors.parent_contact = 'Parent contact must be 10-15 digits only';
    }
    
    // STEP 3: Check if phone numbers are different
    if (formData.phone && formData.parent_contact && 
        formData.phone.replace(/\D/g, '') === formData.parent_contact.replace(/\D/g, '')) {
      errors.parent_contact = 'Parent contact must be different from student phone number';
    }
    
    // STEP 4: Birth date validation
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      
      if (birthDate > today) {
        errors.birth_date = 'Birth date cannot be in the future';
      } else {
        // Calculate age
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || 
                                 (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        const actualAge = hasBirthdayPassed ? age : age - 1;
        
        if (actualAge < 5) {
          errors.birth_date = 'Student must be at least 5 years old';
        } else if (actualAge > 25) {
          errors.birth_date = 'Student age seems unrealistic';
        }
      }
    }
    
    // STEP 5: If there are validation errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }
    
    // STEP 6: If validation passes, proceed with submission
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
      formPayload.append('admission_number', formData.admission_number);
      formPayload.append('class_level', formData.class_level);
      if (formData.photo) formPayload.append('photo', formData.photo);
      formPayload.append('parent_name', formData.parent_name);
      formPayload.append('parent_contact', formData.parent_contact);
      
      // Optional fields
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

      // Check progress after submission
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
        toast.success(`Onboarding completed! Your Admission Number is ${response.data.admission_number}`);
        router.push('/student');
      } else {
        toast.success('Progress saved!');
      }

    } catch (error: any) {
      console.error('Error:', error);
      
      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data === 'object') {
            Object.entries(error.response.data).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach(err => toast.error(`${key}: ${err}`));
              } else {
                toast.error(`${key}: ${value}`);
              }
            });
          } else {
            toast.error(error.response.data.detail || 'Onboarding failed. Please check your data.');
          }
        }
      } else if (error.request) {
        toast.error('No response from server. Please try again.');
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

  // UPDATE THE RETURN SECTION - Pass validationErrors to all form components
  return (
    <div className="min-h-screen bg-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ProgressHeader progress={progress} />
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* PASS validationErrors TO ALL FORM COMPONENTS */}
          <PersonalInfoForm 
            formData={formData} 
            onChange={handleChange} 
            progress={progress}
            validationErrors={validationErrors}
          />
          
          <ParentInfoForm 
            formData={formData} 
            onChange={handleChange} 
            progress={progress}
            validationErrors={validationErrors}
          />
          
          <AcademicInfoForm 
            formData={formData} 
            onChange={handleChange} 
            progress={progress}
            validationErrors={validationErrors}
          />
          
          <MedicalInfoForm 
            formData={formData} 
            onChange={handleChange} 
          />
          
          <ProfilePhotoUpload 
            previewImage={previewImage} 
            onFileChange={handleFileChange} 
            progress={progress}
            validationErrors={validationErrors}
          />

          {/* ADD VALIDATION SUMMARY */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-red-800 font-medium mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Please fix the following errors:
              </h3>
              <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                {Object.entries(validationErrors).map(([field, error]) => (
                  <li key={field}>
                    <span className="capitalize">{field.replace('_', ' ')}</span>: {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FC46AA] hover:bg-[#e03d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC46AA] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : progress.completed ? 'Update Profile' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 'use client';
// import { useState, useEffect, ChangeEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import ProgressHeader from '@/components/StudentOnboarding/ProgressHeader';
// import PersonalInfoForm from '@/components/StudentOnboarding/PersonalInfoForm';
// import ParentInfoForm from '@/components/StudentOnboarding/ParentInfoForm';
// import AcademicInfoForm from '@/components/StudentOnboarding/AcademicInfoForm';
// import MedicalInfoForm from '@/components/StudentOnboarding/MedicalInfoForm';
// import ProfilePhotoUpload from '@/components/StudentOnboarding/ProfilePhotoUpload';

// export interface FormData {
//   phone: string;
//   address: string;
//   gender: string;
//   birth_date: string;
//   blood_type: string;
//   admission_number: string;
//   class_level: string;
//   photo: File | null;
//   medical_notes: string;
//   parent_name: string;
//   parent_contact: string;
// }

// export interface ProgressData {
//   completed: boolean;
//   progress: number;
//   required_fields: {
//     phone: boolean;
//     address: boolean;
//     gender: boolean;
//     birth_date: boolean;
//     admission_number: boolean;
//     class_level: boolean;
//     photo: boolean;
//     parent_name: boolean;
//     parent_contact: boolean;
//   };
// }

// export default function StudentOnboarding() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingProgress, setLoadingProgress] = useState(true);
//   const [formData, setFormData] = useState<FormData>({
//     phone: '',
//     address: '',
//     gender: '',
//     birth_date: '',
//     blood_type: '',
//     admission_number: '',
//     class_level: '',
//     photo: null,
//     medical_notes: '',
//     parent_name: '',
//     parent_contact: ''
//   });
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [progress, setProgress] = useState<ProgressData>({
//     completed: false,
//     progress: 0,
//     required_fields: {
//       phone: false,
//       address: false,
//       gender: false,
//       birth_date: false,
//       admission_number: false,
//       class_level: false,
//       photo: false,
//       parent_name: false,
//       parent_contact: false
//     }
//   });

//   // Check if user is already onboarded
//   useEffect(() => {
//     const checkOnboardingStatus = async () => {
//       try {
//         const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
//         if (!token) {
//           router.push('/log-in');
//           return;
//         }

//         // Get onboarding progress
//         const progressRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`, 
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//         );

//         setProgress(progressRes.data);

//         // If onboarding is complete, redirect to dashboard
//         if (progressRes.data.completed) {
//           router.push('/student');
//           return;
//         }

//         // Pre-fill existing data if available
//         const profileRes = await axios.get(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/`,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           }
//         );

//         setFormData(prev => ({
//           ...prev,
//           ...profileRes.data,
//           photo: null
//         }));

//         if (profileRes.data.photo) {
//           setPreviewImage(profileRes.data.photo);
//         }

//       } catch (error) {
//         console.error('Error checking onboarding status:', error);
//       } finally {
//         setLoadingProgress(false);
//       }
//     };

//     checkOnboardingStatus();
//   }, [router]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
      
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please select an image file (JPEG, PNG)');
//         return;
//       }
      
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('File size should be less than 5MB');
//         return;
//       }

//       setFormData(prev => ({
//         ...prev,
//         photo: file
//       }));

//       // Create preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Validate required fields
//     const requiredFields = [
//       'phone', 'address', 'gender', 'birth_date', 'class_level', 'photo',
//       'parent_name', 'parent_contact'
//     ];

//     for (const field of requiredFields) {
//       if (!formData[field as keyof FormData]) {
//         toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
//         return;
//       }
//     }

//     // Verify phone numbers are valid
//     const phoneRegex = /^[0-9]{10,15}$/;
//     if (!phoneRegex.test(formData.phone)) {
//       toast.error('Please enter a valid phone number (10-15 digits)');
//       return;
//     }

//     if (!phoneRegex.test(formData.parent_contact)) {
//       toast.error('Please enter a valid parent contact number (10-15 digits)');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formPayload = new FormData();

//       function formatDateForBackend(date: string | Date) {
//         const d = new Date(date);
//         return d.toISOString().split('T')[0];
//       }

//       // Append all fields with proper names
//       formPayload.append('phone', formData.phone);
//       formPayload.append('address', formData.address);
//       formPayload.append('gender', formData.gender);
//       formPayload.append('birth_date', formatDateForBackend(formData.birth_date));
//       formPayload.append('admission_number', formData.admission_number);
//       formPayload.append('class_level', formData.class_level);
//       if (formData.photo) formPayload.append('photo', formData.photo);
//       formPayload.append('parent_name', formData.parent_name);
//       formPayload.append('parent_contact', formData.parent_contact);
      
//       // Optional fields
//       if (formData.blood_type) {
//         formPayload.append('blood_type', formData.blood_type);
//       }
//       if (formData.medical_notes) {
//         formPayload.append('medical_notes', formData.medical_notes);
//       }

//       const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
//       if (!token) {
//         toast.error('Authentication token not found. Please login again.');
//         router.push('/log-in');
//         return;
//       }

//       const response = await axios.patch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/`,
//         formPayload,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       // Check progress after submission
//       const progressRes = await axios.get(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       setProgress(progressRes.data);

//       if (progressRes.data.completed) {
//         toast.success(`Onboarding completed! Your Admission Number is ${response.data.admission_number}`);
//         router.push('/student');
//       } else {
//         toast.success('Progress saved!');
//       }

//     } catch (error: any) {
//       console.error('Error:', error);
      
//       if (error.response) {
//         if (error.response.data) {
//           if (typeof error.response.data === 'object') {
//             Object.entries(error.response.data).forEach(([key, value]) => {
//               if (Array.isArray(value)) {
//                 value.forEach(err => toast.error(`${key}: ${err}`));
//               } else {
//                 toast.error(`${key}: ${value}`);
//               }
//             });
//           } else {
//             toast.error(error.response.data.detail || 'Onboarding failed. Please check your data.');
//           }
//         }
//       } else if (error.request) {
//         toast.error('No response from server. Please try again.');
//       } else {
//         toast.error('Request error: ' + error.message);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loadingProgress) {
//     return (
//       <div className="min-h-screen bg-pink-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="spinner border-4 border-[#FC46AA] border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-700">Checking onboarding status...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-pink-100 py-10 px-4">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <ProgressHeader progress={progress} />
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <PersonalInfoForm 
//             formData={formData} 
//             onChange={handleChange} 
//             progress={progress} 
//           />
          
//           <ParentInfoForm 
//             formData={formData} 
//             onChange={handleChange} 
//             progress={progress} 
//           />
          
//           <AcademicInfoForm 
//             formData={formData} 
//             onChange={handleChange} 
//             progress={progress} 
//           />
          
//           <MedicalInfoForm 
//             formData={formData} 
//             onChange={handleChange} 
//           />
          
//           <ProfilePhotoUpload 
//             previewImage={previewImage} 
//             onFileChange={handleFileChange} 
//             progress={progress} 
//           />

//           <div className="pt-6">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FC46AA] hover:bg-[#e03d98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC46AA] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Submitting...' : progress.completed ? 'Update Profile' : 'Complete Onboarding'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface FormData {
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

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-'
];

const classLevels = [
  'JSS1', 'JSS2', 'JSS3',
  'SSS1', 'SSS2', 'SSS3'
];


interface ProgressData {
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

  //check if user is already onboarded
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        if (!token) {
          router.push('/log-in');
          return;
        }

        //get onboarding progress
        const progressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/students/onboarding/progress/`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setProgress(progressRes.data);

        //if onboarding is complete, redirect to dashboard
        if (progressRes.data.completed) {
          router.push('/student');
          return;
        }

        //pre-fill existing data if available
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
      
      //validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPEG, PNG)');
        return;
      }
      
      //validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }));

      //create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    //validate required fields
    const requiredFields = [
      'phone', 'address', 'gender', 'birth_date', 'class_level', 'photo',
      'parent_name', 'parent_contact'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
        return;
      }
    }

    //verify phone numbers are valid
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number (10-15 digits)');
      return;
    }

    if (!phoneRegex.test(formData.parent_contact)) {
      toast.error('Please enter a valid parent contact number (10-15 digits)');
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();

      function formatDateForBackend(date: string | Date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // formats to "YYYY-MM-DD"
      }

      //append all fields with proper names
      formPayload.append('phone', formData.phone);
      formPayload.append('address', formData.address);
      formPayload.append('gender', formData.gender);
      formPayload.append('birth_date', formatDateForBackend(formData.birth_date));
      formPayload.append('admission_number', formData.admission_number);
      formPayload.append('class_level', formData.class_level);
      if (formData.photo) formPayload.append('photo', formData.photo);
      formPayload.append('parent_name', formData.parent_name);
      formPayload.append('parent_contact', formData.parent_contact);
      
      //optional fields
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

      //check progress after submission
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

  return (
    <div className="min-h-screen bg-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with pink background and progress tracker */}
        <div className="bg-[#FC46AA] py-4 px-6">
          <h1 className="text-2xl font-bold text-center text-white">Student Onboarding</h1>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-white">
              <span>Progress: {progress.progress}%</span>
              <span>
                {Object.values(progress.required_fields).filter(Boolean).length}/
                {Object.keys(progress.required_fields).length} completed
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-1">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                  <option value="N">Prefer not to say</option>
                </select>
              </div>

              <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  id="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  id="blood_type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Parent Information Section */}
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
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
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
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              <div className={`sm:col-span-3 ${!progress.required_fields.admission_number && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="admission_number" className="block text-sm font-medium text-gray-700">
                  Admission Number *
                </label>
                <input
                    type="text"
                    name="admission_number"
                    id="admission_number"
                    value={formData.admission_number}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                <p className="text-sm text-gray-500 mt-1">
                  Your admission number will be automatically generated once you submit this form.
                </p>
              </div>

              <div className={`sm:col-span-3 ${!progress.required_fields.class_level && 'border-l-4 border-red-500 pl-3'}`}>
                <label htmlFor="class_level" className="block text-sm font-medium text-gray-700">
                  Class Level *
                </label>
                <select
                  id="class_level"
                  name="class_level"
                  value={formData.class_level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                >
                  <option value="">Select class</option>
                  {classLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Medical Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="medical_notes" className="block text-sm font-medium text-gray-700">
                  Medical Notes
                </label>
                <textarea
                  name="medical_notes"
                  id="medical_notes"
                  rows={3}
                  value={formData.medical_notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  placeholder="Any allergies, conditions, or special medical requirements"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
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
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#FC46AA] file:text-white
                    hover:file:bg-[#e03d98]"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  JPEG or PNG, max 5MB
                </p>
              </div>
            </div>
          </div>

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
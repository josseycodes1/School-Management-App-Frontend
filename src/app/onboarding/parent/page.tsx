'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import ProgressHeader from '@/components/ParentOnboarding/ProgressHeader'
import PersonalInfoForm from '@/components/ParentOnboarding/PersonalInfoForm'
import EmergencyInfoForm from '@/components/ParentOnboarding/EmergencyInfoForm'
import ProfilePhotoUpload from '@/components/ParentOnboarding/ProfilePhotoUpload'

// Define interfaces directly in the page (like student page)
export interface FormData {
  phone: string
  address: string
  gender: string
  birth_date: string
  emergency_contact: string
  occupation: string
  blood_type: string
  photo: File | null
}

export interface ProgressData {
  completed: boolean
  progress: number
  required_fields: {
    phone: boolean
    address: boolean
    gender: boolean
    birth_date: boolean
    emergency_contact: boolean
    photo: boolean
  }
}

export default function ParentOnboarding() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    address: '',
    gender: '',
    birth_date: '',
    emergency_contact: '',
    occupation: '',
    blood_type: '',
    photo: null
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressData>({
    completed: false,
    progress: 0,
    required_fields: {
      phone: false,
      address: false,
      gender: false,
      birth_date: false,
      emergency_contact: false,
      photo: false
    }
  })

  // Check onboarding progress on load
  useEffect(() => {
    const checkProgress = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
        if (!token) {
          router.push('/login')
          return
        }

        // Get onboarding progress
        const progressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/onboarding/progress/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        setProgress(progressRes.data)

        // Only redirect if onboarding is complete
        if (progressRes.data.completed) {
          router.push('/parent')
          return
        }

        // Pre-fill existing data
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/onboarding/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        setFormData(prev => ({
          ...prev,
          phone: profileRes.data.phone || '',
          address: profileRes.data.address || '',
          gender: profileRes.data.gender || '',
          birth_date: profileRes.data.birth_date || '',
          emergency_contact: profileRes.data.emergency_contact || '',
          occupation: profileRes.data.occupation || '',
          blood_type: profileRes.data.blood_type || '',
          photo: null
        }))

        if (profileRes.data.photo) {
          setPreviewImage(profileRes.data.photo)
        }

      } catch (error) {
        console.error('Progress check error:', error)
        toast.error('Failed to load onboarding data')
      } finally {
        setLoadingProgress(false)
      }
    }

    checkProgress()
  }, [router])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPEG, PNG)')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }))
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        toast.error('Authentication token not found')
        router.push('/login')
        return
      }

      // Validate required fields
      const requiredFields = [
        'phone', 'address', 'gender', 'birth_date',
        'emergency_contact', 'photo'
      ]

      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          toast.error(`Please fill in the ${field.replace('_', ' ')} field`)
          return
        }
      }

      // Validate phone numbers
      const phoneRegex = /^[0-9]{10,15}$/
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Please enter a valid phone number (10-15 digits)')
        return
      }

      if (!phoneRegex.test(formData.emergency_contact)) {
        toast.error('Please enter a valid emergency contact number (10-15 digits)')
        return
      }

      const formPayload = new FormData()
      formPayload.append('phone', formData.phone)
      formPayload.append('address', formData.address)
      formPayload.append('gender', formData.gender)
      formPayload.append('birth_date', formData.birth_date)
      formPayload.append('emergency_contact', formData.emergency_contact)
      if (formData.occupation) formPayload.append('occupation', formData.occupation)
      if (formData.blood_type) formPayload.append('blood_type', formData.blood_type)
      if (formData.photo) formPayload.append('photo', formData.photo)

      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/onboarding/`,
        formPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Verify completion status
      const progressRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/parents/onboarding/progress/`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setProgress(progressRes.data)

      if (progressRes.data.completed) {
        toast.success('Onboarding completed successfully!')
        router.push('/parent')
      } else {
        toast.success('Progress saved successfully!')
      }

    } catch (error: any) {
      console.error('Submission error:', error)
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          toast.error(`${key}: ${Array.isArray(value) ? value[0] : value}`)
        })
      } else {
        toast.error(error.message || 'Failed to save onboarding data')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingProgress) {
    return (
      <div className="min-h-screen bg-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-[#FC46AA] border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading onboarding data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <ProgressHeader progress={progress} />
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <PersonalInfoForm 
            formData={formData} 
            onChange={handleChange} 
            progress={progress} 
          />
          
          <EmergencyInfoForm 
            formData={formData} 
            onChange={handleChange} 
            progress={progress} 
          />
          
          <ProfilePhotoUpload 
            previewImage={previewImage} 
            onFileChange={handleFileChange} 
            progress={progress} 
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FC46AA] hover:bg-[#e03d98] text-white py-3 px-4 rounded-md shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Complete Onboarding'}
          </button>
        </form>
      </div>
    </div>
  )
}
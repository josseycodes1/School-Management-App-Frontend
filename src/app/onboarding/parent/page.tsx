'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface FormData {
  phone: string
  address: string
  gender: string
  birth_date: string
  emergency_contact: string
  occupation: string
  blood_type: string
  photo: File | null
}

const bloodTypes = [
  'A+', 'A-', 'B+', 'B-', 
  'AB+', 'AB-', 'O+', 'O-'
]

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
  const [progress, setProgress] = useState({
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

        const progressRes = await axios.get(
          'http://localhost:8000/api/accounts/parents/onboarding/progress/',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        setProgress(progressRes.data)

        if (progressRes.data.completed) {
          router.push('/parent')
          return
        }

        const profileRes = await axios.get(
          'http://localhost:8000/api/accounts/parents/onboarding/',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        
        setFormData(prev => ({
          ...prev,
          ...profileRes.data,
          photo: null
        }))

        if (profileRes.data.photo) {
          setPreviewImage(`http://localhost:8000${profileRes.data.photo}`)
        }

      } catch (error) {
        toast.error('Failed to load onboarding data')
      } finally {
        setLoadingProgress(false)
      }
    }

    checkProgress()
  }, [router])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

      setFormData(prev => ({ ...prev, photo: file }))
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
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

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        toast.error('Authentication token not found')
        router.push('/login')
        return
      }

      const formPayload = new FormData()
      
      // Append all fields including user fields
      formPayload.append('phone', formData.phone)
      formPayload.append('address', formData.address)
      formPayload.append('gender', formData.gender)
      formPayload.append('birth_date', formData.birth_date)
      formPayload.append('emergency_contact', formData.emergency_contact)
      if (formData.occupation) formPayload.append('occupation', formData.occupation)
      if (formData.blood_type) formPayload.append('blood_type', formData.blood_type)
      if (formData.photo) formPayload.append('photo', formData.photo)

      const response = await axios.patch(
        'http://localhost:8000/api/accounts/parents/onboarding/',
        formPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      // Check if onboarding is complete
      const progressRes = await axios.get(
        'http://localhost:8000/api/accounts/parents/onboarding/progress/',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (progressRes.data.completed) {
        toast.success('Onboarding completed successfully!')
        router.push('/parent')
      } else {
        toast.success('Progress saved successfully!')
        setProgress(progressRes.data)
      }

    } catch (error: any) {
      console.error('Submission error:', error)
      if (error.response?.data) {
        // Handle Django serializer errors
        if (typeof error.response.data === 'object') {
          Object.entries(error.response.data).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(err => toast.error(`${key}: ${err}`))
            } else {
              toast.error(`${key}: ${value}`)
            }
          })
        } else {
          toast.error(error.response.data.detail || 'Onboarding failed')
        }
      } else {
        toast.error('Network error. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadingProgress) {
    return <div className="min-h-screen bg-pink-100 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-pink-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#FC46AA] py-4 px-6">
          <h1 className="text-2xl font-bold text-center text-white">Parent Onboarding</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                <select
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
                </select>
              </div>

              <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700">Birth Date *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Information</h2>
            
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              <div className={`sm:col-span-3 ${!progress.required_fields.emergency_contact && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact *</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FC46AA] focus:ring-[#FC46AA] sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                <select
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
              {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
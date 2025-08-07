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

        // Get onboarding progress
        const progressRes = await axios.get(
          'http://localhost:8000/api/accounts/parents/onboarding/progress/',
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
          'http://localhost:8000/api/accounts/parents/onboarding/',
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
          setPreviewImage(`http://localhost:8000${profileRes.data.photo}`)
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
        'http://localhost:8000/api/accounts/parents/onboarding/',
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
        'http://localhost:8000/api/accounts/parents/onboarding/progress/',
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
        {/* Header with progress */}
        <div className="bg-[#FC46AA] py-4 px-6 text-white">
          <h1 className="text-2xl font-bold text-center">Parent Onboarding</h1>
          <div className="mt-2">
            <div className="flex justify-between text-sm">
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
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              {/* Phone */}
              <div className={`sm:col-span-3 ${!progress.required_fields.phone && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                  required
                />
              </div>

              {/* Gender */}
              <div className={`sm:col-span-3 ${!progress.required_fields.gender && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>

              {/* Address */}
              <div className={`sm:col-span-6 ${!progress.required_fields.address && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                  required
                />
              </div>

              {/* Birth Date */}
              <div className={`sm:col-span-3 ${!progress.required_fields.birth_date && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                  required
                />
              </div>

              {/* Blood Type */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Information</h2>
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
              {/* Emergency Contact */}
              <div className={`sm:col-span-3 ${!progress.required_fields.emergency_contact && 'border-l-4 border-red-500 pl-3'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                  required
                />
              </div>

              {/* Occupation */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:border-[#FC46AA] focus:ring-[#FC46AA]"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className={`${!progress.required_fields.photo && 'border-l-4 border-red-500 pl-3'}`}>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo *</h2>
            <div className="flex items-center">
              <div className="mr-4">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
                    <span className="text-gray-500 text-xs">No photo</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
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
                <p className="mt-1 text-xs text-gray-500">JPEG or PNG, max 5MB</p>
              </div>
            </div>
          </div>

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
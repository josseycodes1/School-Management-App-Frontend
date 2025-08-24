'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface LogoutButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'text'
  children?: React.ReactNode
}

export default function LogoutButton({ 
  className = '', 
  variant = 'primary',
  children 
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    
    // Show success message
    toast.success('You have been successfully logged out!')
    
    // Redirect to login page
    router.push('/log-in')
  }

  const buttonClass = variant === 'primary' 
    ? `bg-[#FC46AA] text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition-colors ${className}`
    : variant === 'secondary'
    ? `bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors ${className}`
    : `text-[#FC46AA] hover:text-[#F699CD] transition-colors ${className}`

  return (
    <button onClick={handleLogout} className={buttonClass}>
      {children || 'Logout'}
    </button>
  )
}
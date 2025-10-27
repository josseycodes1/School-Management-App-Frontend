'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface LogoutButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'text'
  children?: React.ReactNode
  onClick?: () => void 
}

export default function LogoutButton({ 
  className = '', 
  variant = 'primary',
  children,
  onClick 
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
   
    if (onClick) {
      onClick()
    }
    
   
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    
    
    toast.success('You have been successfully logged out!')
    
    
    router.push('/log-in')
  }

  const buttonClass = variant === 'primary' 
    ? `bg-josseypink1 text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition-colors ${className}`
    : variant === 'secondary'
    ? `bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors ${className}`
    : `text-josseypink1 hover:text-josseypink8 transition-colors ${className}`

  return (
    <button onClick={handleLogout} className={buttonClass}>
      {children || 'Logout'}
    </button>
  )
}
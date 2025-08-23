'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const logout = async () => {
      try {
        // Clear all user data from localStorage
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        
        // Show success message
        toast.success('You have been successfully logged out!')
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push('/log-in')
        }, 1500)
      } catch (error) {
        console.error('Logout error:', error)
        toast.error('An error occurred during logout')
        setIsLoggingOut(false)
      }
    }

    logout()
  }, [router])

  const handleCancel = () => {
    router.back() // Go back to the previous page
  }

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
          JC
        </div>
        
        {isLoggingOut ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Logging Out</h2>
            <p className="text-gray-600 mb-6">
              Please wait while we securely log you out...
            </p>
            <div className="w-12 h-12 border-t-2 border-b-2 border-[#FC46AA] rounded-full animate-spin mx-auto"></div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Logout Failed</h2>
            <p className="text-gray-600 mb-6">
              There was an issue logging you out. Please try again.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#FC46AA] text-white py-2 rounded-md hover:bg-[#F699CD] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Changed your mind?{' '}
            <Link href="/" className="font-medium text-[#FC46AA] hover:text-[#F699CD]">
              Go back to dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
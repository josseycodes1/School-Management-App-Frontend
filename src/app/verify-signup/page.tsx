'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function Verify() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
      })

      if (response.ok) {
        toast.success('Account verified successfully!')
        window.location.href = '/login'
      } else {
        const error = await response.json()
        toast.error(error.message || 'Verification failed')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = async () => {
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      toast.success('Verification code resent!')
    } catch (error) {
      toast.error('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Verify Your Account</h2>
          <p className="text-gray-600 mt-2">
            We sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-[#FC46AA] focus:border-[#FC46AA]"
              placeholder="Enter 6-digit code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FC46AA] text-white py-2 rounded-md hover:bg-[#F699CD] transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Didn't receive a code?{' '}
            <button
              onClick={resendCode}
              className="font-medium text-[#FC46AA] hover:text-[#F699CD]"
            >
              Resend code
            </button>
          </p>
          <p className="mt-2">
            Wrong email?{' '}
            <Link href="/signup" className="font-medium text-[#FC46AA] hover:text-[#F699CD]">
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
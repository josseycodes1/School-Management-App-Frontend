'use client'

import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  profile_image?: string
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setLoading(false)
          return
        }

       
        const decoded: any = jwtDecode(token)
        const userId = decoded.user_id || decoded.id

        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/user/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUserData(userData)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { userData, loading }
}
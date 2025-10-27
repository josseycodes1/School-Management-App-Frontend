'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  id: number
  title: string
  content: string
  created_at: string
  is_read: boolean
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/announcements/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setAnnouncements(data)
          
      
          const unread = data.filter((item: Announcement) => !item.is_read).length
          setUnreadCount(unread)
        }
      } catch (error) {
        console.error('Error fetching announcements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  return { announcements, unreadCount, loading }
}
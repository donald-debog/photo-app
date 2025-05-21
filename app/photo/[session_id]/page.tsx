'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function PhotoPage({ params }: { params: { session_id: string } }) {
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { session_id } = params

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true)
      try {
        const res = await fetch(`/api/list-photos?session=${session_id}`)
        const data = await res.json()
        setPhotos(data.urls || [])
      } catch (error) {
        console.error('Error fetching photos:', error)
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchPhotos()
  }, [session_id])
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (photos.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No photos found for this session</div>
  }

  return (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-6">Photos from Your Session</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((url, idx) => (
        <div key={url} className="border rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 w-full">
            <img
              src={url}
              alt={`Photo ${idx + 1}`}
              className="object-cover w-full h-full"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

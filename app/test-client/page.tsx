'use client'

import { useState, useEffect } from 'react'

export default function TestClient() {
  const [message, setMessage] = useState('Initial state (server)')
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    console.log('useEffect is running!')
    setMessage('Client-side JavaScript is working!')

    fetch('/api/marketplace/listings?status=active&limit=1')
      .then(res => res.json())
      .then(data => {
        console.log('API data:', data)
        setApiData(data)
      })
      .catch(err => {
        console.error('API error:', err)
      })
  }, [])

  return (
    <div style={{padding: '40px', fontFamily: 'Arial'}}>
      <h1>Client-Side Test Page</h1>
      <p><strong>Message:</strong> {message}</p>
      <p><strong>API Data:</strong> {apiData ? JSON.stringify(apiData).substring(0, 200) : 'Loading...'}</p>
    </div>
  )
}

export default function SimplePage() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#0a1929', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ IT WORKS!</h1>
      <p style={{ fontSize: '24px' }}>If you can see this, the basic app is fine.</p>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>The problem is with the AuthProvider or main layout.</p>
      <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #10b981', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Status:</h2>
        <p>✅ Next.js is working</p>
        <p>✅ Vercel deployment is working</p>
        <p>✅ Routing is working</p>
        <p>⚠️  Main layout has an issue</p>
      </div>
    </div>
  )
}

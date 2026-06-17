export default function TestPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-xl">If you can see this, the basic app works!</p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Environment Check:</h2>
        <ul className="space-y-2">
          <li>✅ Next.js is working</li>
          <li>✅ Tailwind CSS is working</li>
          <li>✅ Page routing is working</li>
        </ul>
      </div>
    </div>
  )
}

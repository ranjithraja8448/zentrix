import React from 'react';

// Main landing page component for your Next.js application
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="max-w-3xl text-center">
        
        {/* Main Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
          Welcome to Zentrix
        </h1>
        
        {/* Subtitle / Description */}
        <p className="text-lg mb-8 text-gray-600">
          You've successfully started your Next.js frontend. Let's build something awesome da.
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition shadow-sm">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-200 text-black rounded-lg font-medium hover:bg-gray-300 transition shadow-sm">
            Documentation
          </button>
        </div>
        
      </div>
    </main>
  );
}

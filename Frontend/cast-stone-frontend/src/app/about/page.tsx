import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Cast Stone</h1>
        <p className="text-xl text-gray-600">
          Building the future with modern technology and innovative solutions
        </p>
      </div>
      
      <div className="prose prose-lg mx-auto">
        <h2>Our Mission</h2>
        <p>
          Cast Stone is dedicated to creating robust, scalable, and modern web applications 
          that meet the evolving needs of businesses and users alike. We leverage cutting-edge 
          technologies to deliver exceptional digital experiences.
        </p>
        
        <h2>Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Next.js 14 with App Router</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Component-based Architecture</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• .NET 8 Web API</li>
              <li>• MongoDB with MongoDB.Driver</li>
              <li>• Repository Pattern</li>
              <li>• Clean Architecture</li>
            </ul>
          </div>
        </div>
        
        <h2>Features</h2>
        <ul>
          <li>Modern, responsive design</li>
          <li>RESTful API architecture</li>
          <li>Type-safe development</li>
          <li>Scalable database design</li>
          <li>Component-based UI</li>
        </ul>
      </div>
    </div>
  );
}

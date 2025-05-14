import React from 'react';

const ApiDocsLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
};

export default ApiDocsLayout; 
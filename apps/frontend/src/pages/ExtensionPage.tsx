import React from 'react';

export const ExtensionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mt-10 mb-4 text-center">Real-Time Web3 Protection</h1>
      <p className="text-xl text-gray-400 max-w-2xl text-center mb-10">
        Block phishing domains and fake wallet interactions instantly with the ShieldWeb3 browser extension.
      </p>
      
      <div className="bg-slate border border-gray-700 p-8 rounded-xl max-w-sm w-full text-center">
        <div className="text-6xl mb-6">🛡️</div>
        <a 
          href="/releases/shieldweb3-v1.0.0.zip" 
          download
          className="block w-full bg-primary-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mb-4 cursor-not-allowed opacity-50 transition-colors"
          onClick={(e) => { e.preventDefault(); alert("Extension packaging pending."); }}
        >
          Add to Chrome - Free
        </a>
        <div className="text-sm text-gray-400 text-left mt-4 space-y-2">
          <p><strong>Step 1:</strong> Download ZIP</p>
          <p><strong>Step 2:</strong> Enable Developer Mode</p>
          <p><strong>Step 3:</strong> Load Unpacked Extension</p>
          <p><strong>Step 4:</strong> Click with Confidence</p>
        </div>
      </div>
    </div>
  );
};

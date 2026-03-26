import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-16 left-8 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-16 right-8 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] -z-10" />

      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/20 text-center max-w-lg w-full animate-fade-in-up">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-2xl font-bold text-white mb-2">Not Authorized</h2>
        <p className="text-gray-400 mb-6">
          You don’t have permission to view this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-white/10"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/"
            className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;

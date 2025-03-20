import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text hover:from-cyan-300 hover:to-blue-400 transition-all duration-300"
          >
            <Lock className="h-8 w-8 text-cyan-400" />
            <span>StegoCrypt</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
import React from 'react';
import { 
  KeyRound, Lock, Shuffle, FileImage, 
  FileText, Key, ArrowDownToLine, FileCheck,
  Linkedin
} from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';

import Ashish from "../static/Ashish.jpeg";

import Sushant from "../static/sushant_photo.jpeg";

const features = [
  {
    title: 'AES Encryption',
    description: 'Encrypt images and get a secure key',
    icon: KeyRound,
    method: 'aes-encrypt'
  },
  {
    title: 'Triple DES Encryption',
    description: 'Encrypt images using Triple DES',
    icon: Lock,
    method: 'des-encrypt'
  },
  {
    title: 'Chaos-based Encryption',
    description: 'Encrypt images using chaos theory',
    icon: Shuffle,
    method: 'chaos-encrypt'
  },
  {
    title: 'LSB Steganography Hide',
    description: 'Hide text in images securely',
    icon: FileText,
    method: 'lsb-hide'
  },
  {
    title: 'AES Decryption',
    description: 'Decrypt AES encrypted files',
    icon: Key,
    method: 'aes-decrypt'
  },
  {
    title: 'Triple DES Decryption',
    description: 'Decrypt Triple DES files',
    icon: FileCheck,
    method: 'des-decrypt'
  },
  {
    title: 'Chaos-based Decryption',
    description: 'Decrypt chaos encrypted images',
    icon: ArrowDownToLine,
    method: 'chaos-decrypt'
  },
  {
    title: 'LSB Steganography Extract',
    description: 'Extract hidden text from images',
    icon: FileImage,
    method: 'lsb-extract'
  }
];

const creators = [
  {
    name: "Ashish Sharma",
    role: "SY BTECH CSE-CSF",
    image: Ashish,
    linkedin: "https://www.linkedin.com/in/ashish-sharma-31a229281/"
  },
  {
    name: "Sushant Kumar",
    role: "SY BTECH CSE-CSF",
    image: Sushant,
    linkedin: "https://www.linkedin.com/in/sushant-kumar-7450362b8/"
  }
];

export const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500
                     [text-shadow:0_0_20px_rgba(6,182,212,0.2)]">
          Welcome to StegoCrypt
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A project Showcasing modern cryptographic and steganographic techniques for image security
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature) => (
          <FeatureCard key={feature.method} {...feature} />
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          Created By
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {creators.map((creator) => (
            <a
              key={creator.name}
              href={creator.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-cyan-500/50 
                       transition-all duration-500 hover:scale-105 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/50 transition-all duration-300"
                />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-cyan-300 transition-colors duration-300">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {creator.role}
                  </p>
                  <div className="flex items-center mt-2 text-cyan-400 group-hover:text-cyan-300">
                    <Linkedin className="w-4 h-4 mr-1" />
                    <span className="text-sm">View Profile</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
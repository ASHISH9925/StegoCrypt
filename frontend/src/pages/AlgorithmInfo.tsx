import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const algorithmInfo = {
  'aes-encrypt': {
    title: 'AES Encryption',
    description: `The Advanced Encryption Standard (AES) is a widely recognized symmetric encryption algorithm designed for secure data transmission. StegoCrypt implements AES-256, ensuring high computational security by transforming image data into an encrypted binary format. This encryption methodology guarantees confidentiality and resistance to brute-force attacks through a high-entropy key generation process.`,
    details: [
      'Utilizes AES-256 bit encryption, ensuring a high level of security.',
      'Encrypts pixel data, converting images into ciphered binary representations.',
      'Generates a unique encryption key for each session to prevent replay attacks.',
      'Ensures fast and efficient encryption with minimal processing overhead.',
    ]
  },


  'des-encrypt': {
    title: 'Triple DES Encryption',
    description: 'Triple DES applies the DES cipher algorithm three times to each data block, providing an extra layer of security. The process converts your image into an encrypted file with a secure key.',
    details: [
      'Uses a 168-bit key length for enhanced encryption complexity.',
  'Encrypts image data through three independent DES cipher stages.',
  'Maintains backward compatibility with DES-based security systems.',
  'Provides protection against cryptanalytic attacks, including differential cryptanalysis.',
    ]
  },
  'chaos-encrypt': {
    title: 'Chaos-based Encryption',
    description: 'Chaos-based encryption leverages nonlinear dynamic systems to generate highly unpredictable encryption keys. This approach disrupts image pixel distributions, making unauthorized decryption infeasible.',
    details: [
      'Utilizes chaotic key sequences for enhanced unpredictability and security.',
      'Resistant to statistical, brute-force, and differential attacks due to nonlinearity.',
      'Provides high-speed encryption while ensuring computational efficiency.',
      'Ideal for military, forensic, and high-security digital transmission systems.'
    ]
  },
  'lsb-hide': {
    title: 'LSB Steganography Hide',
    description: 'Least Significant Bit (LSB) steganography is a covert data-hiding technique that embeds secret messages within the least significant bits of image pixels. This method maintains the visual integrity of the original image while ensuring secure data concealment.',
    details: [
      'Embeds confidential data in non-disruptive pixel bit layers.',
      'Maintains original image appearance, preventing detection.',
      'Resistant to common image compression techniques (JPEG, PNG).',
      'Suitable for forensic applications, secure communication, and watermarking.',
    ]
  },
  'aes-decrypt': {
    title: 'AES Decryption',
    description: 'The AES decryption module allows for lossless image reconstruction by applying the inverse transformation of AES encryption. Utilizing the correct decryption key, the algorithm retrieves the original image while maintaining data integrity.',
    details: [
        'Implements inverse AES-256 decryption, restoring encrypted images to their original form.',
        'Ensures zero-loss decryption with precise key matching.',
        'Provides secure key-based access, preventing unauthorized data retrieval.',
        'Designed for high-speed decryption with minimal computational overhead.',
       ]
  },
  'des-decrypt': {
    title: 'Triple DES Decryption',
    description:' Triple DES decryption follows the reverse computational process of 3DES encryption, ensuring accurate restoration of image data.' ,
    details: [
      'Employs a three-stage decryption mechanism, reversing encryption transformations.',
      'Ensures data integrity preservation, reconstructing original images without distortion.',
      'Supports legacy security infrastructures, making it suitable for enterprise applications.',
      'Mitigates the risk of cipher block collisions through expanded key scheduling.',
    ]
  },
  'chaos-decrypt': {
    title: 'Chaos-based Decryption',
    description: 'Chaos-based decryption relies on exact key sequence alignment to restore the original image without degradation.',
    details: [
      'Utilizes chaotic map reconstruction to decode encrypted images accurately.',
      'Ensures zero-data loss, provided the original chaotic key is available.',
      'Resistant to linear predictive decryption techniques.',
      'Suitable for high-security environments requiring non-repetitive encryption methods.',
    ]
  },
  'lsb-extract': {
    title: 'LSB Steganography Extract',
    description: 'The LSB extraction algorithm retrieves embedded data from steganographic images, ensuring precise recovery of hidden messages.',
    details: [
      'Extracts concealed data without altering image quality.',
      'Ensures 100% accurate message retrieval, provided the correct decoding parameters.',
      'Resistant to data loss during transmission or compression.',
      'Used in digital forensics, cybersecurity, and confidential communications.',
    ]
  }
};

export const AlgorithmInfo = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const info = algorithmInfo[method];

  if (!info) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 glow">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          {info.title}
        </h2>
        
        <div className="space-y-6 mb-8">
          <p className="text-gray-300 leading-relaxed">
            {info.description}
          </p>
          
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {info.details.map((detail, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-cyan-500 mr-2">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => navigate(`/process/${method}`)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg
                   text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                   font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                   transition-all duration-200"
        >
          Continue to Process
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};
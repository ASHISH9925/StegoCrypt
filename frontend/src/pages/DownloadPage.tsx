import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Home, Key, FileText } from 'lucide-react';

export const DownloadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem('encryptionKey');
    if (key) {
      setEncryptionKey(key);
      localStorage.removeItem('encryptionKey');
    }

    const message = localStorage.getItem('extractedMessage');
    if (message) {
      setExtractedMessage(message);
      localStorage.removeItem('extractedMessage');
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 text-center glow">
        {extractedMessage ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                          flex items-center justify-center ring-1 ring-purple-500/30">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>

            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Hidden Message Extracted!
            </h2>

            <div className="mb-8 p-4 bg-black/30 rounded-lg border border-purple-500/30">
              <p className="text-gray-300 break-words font-mono text-sm whitespace-pre-wrap">
                {extractedMessage}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 
                          flex items-center justify-center ring-1 ring-green-500/30">
              <Download className="w-8 h-8 text-green-400" />
            </div>

            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
              Processing Complete!
            </h2>
            <p className="text-gray-400 mb-4">
              Your file has been processed successfully. If the download hasn't started automatically, check the notifications above.
            </p>

            {encryptionKey && (
              <div className="mb-8 p-4 bg-black/30 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-center mb-2">
                  <Key className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">Encryption Key</span>
                </div>
                <p className="text-gray-300 break-all font-mono text-sm">{encryptionKey}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Save this key! You'll need it to decrypt your file later.
                </p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg
                   text-gray-300 bg-black/50 hover:bg-black/70
                   font-medium border border-gray-700 hover:border-gray-600
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                   transition-all duration-200 group"
        >
          <Home className="w-5 h-5 mr-2 transition-transform duration-200" />
          Back to Home
        </button>
      </div>
    </div>
  );
};
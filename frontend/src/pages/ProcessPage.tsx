import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileText, Key } from 'lucide-react';
import { handleApiSubmission, downloadFile } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ProcessPage = () => {
  const { method } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrambleOrderFile, setScrambleOrderFile] = useState<File | null>(null);

  const isLSBHide = method === 'lsb-hide';
  const isLSBExtract = method === 'lsb-extract';
  const isDecryption = method?.includes('decrypt');
  const isEncryption = method?.includes('encrypt') && !method?.includes('chaos');
  const acceptedFiles = isDecryption && !method?.includes('chaos') ? '.bin,.txt' : 'image/*';
  const needsNumpyArray = method === 'chaos-decrypt';

  const getApiEndpoint = () => {
    switch (method) {
      case 'aes-encrypt': return '/encrypt/aes';
      case 'aes-decrypt': return '/decrypt/aes';
      case 'des-encrypt': return '/encrypt/des';
      case 'des-decrypt': return '/decrypt/des';
      case 'lsb-hide': return '/encode/lsb';
      case 'lsb-extract': return '/decode/lsb';
      case 'chaos-encrypt': return '/scramble/chaos';
      case 'chaos-decrypt': return '/decrypt/chaos';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();

    try {
      const endpoint = getApiEndpoint();
      const isDownload = isDecryption || method === 'chaos-encrypt';

      if (method?.includes('decrypt') && !method?.includes('chaos')) {
        formData.append('encrypted_file', file);
        formData.append('key', password);
      } else if (method === 'chaos-decrypt') {
        formData.append('image', file);
        if (scrambleOrderFile) {
          formData.append('scramble_order_file', scrambleOrderFile);
        }
      } else if (isLSBHide) {
        formData.append('image', file);
        formData.append('message', text);
        formData.append('password', password);
      } else if (isLSBExtract) {
        formData.append('image', file);
        formData.append('password', password);
      } else {
        formData.append('image', file);
      }

      const response = await handleApiSubmission(endpoint, formData, isDownload, isEncryption);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.message) {
        localStorage.setItem('extractedMessage', response.message);
      }

      if (response.key) {
        localStorage.setItem('encryptionKey', response.key);
        toast.info(`Encryption Key: ${response.key}`, {
          autoClose: false,
          closeOnClick: false
        });
      }

      if (response.output_file) {
        if (isDownload) {
          downloadFile(response.output_file, 'output');
        } else {
          const fileUrl = `${response.output_file}`;
          downloadFile(fileUrl, isEncryption ? 'encrypted_file.bin' : 'output.png');
        }
      }

      navigate('/download');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <ToastContainer position="top-right" theme="dark" />
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-gray-800 glow">
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 text-center">
          {method?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              {isDecryption && !method?.includes('chaos') ? 'Upload Encrypted File' : 'Upload Image'}
            </label>
            <div className="relative">
              <input
                type="file"
                accept={acceptedFiles}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed 
                         border-gray-700 hover:border-cyan-500/50 cursor-pointer bg-black/30 hover:bg-black/50 
                         transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileImage className="w-12 h-12 text-gray-400 mb-3 transition-colors duration-200" />
                  <p className="text-sm text-gray-400 transition-colors duration-200">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                </div>
              </label>
            </div>

            {needsNumpyArray && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Upload Scramble Order File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setScrambleOrderFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 text-gray-300 bg-black/30 rounded-lg border border-gray-700 
                             focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            )}

            {isLSBHide && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Text to Hide
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 px-3 py-2 text-gray-300 bg-black/30 rounded-lg border border-gray-700 
                           focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                  placeholder="Enter text to hide in the image..."
                  required
                />
              </div>
            )}

            {((isLSBHide || isLSBExtract || isDecryption) && !needsNumpyArray) && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {isDecryption ? 'Decryption Key' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={isDecryption ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pl-10 text-gray-300 bg-black/30 rounded-lg border border-gray-700 
                             focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-200"
                    placeholder={isDecryption ? "Enter decryption key..." : "Enter password..."}
                    required
                  />
                  <Key className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-white
                     bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                     font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                     relative overflow-hidden"
          >
            {loading ? (
              <div className="loading-ring w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2 transition-transform duration-200" />
                Process File
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
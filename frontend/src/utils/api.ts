import { saveAs } from 'file-saver';

interface ApiResponse {
  output_file?: string;
  key?: string;
  message?: string;
  error?: string;
}

export const handleApiSubmission = async (
  url: string,
  formData: FormData,
  isDownload: boolean = false,
  isEncryption: boolean = false
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }

    // For decryption and chaos operations, return blob
    if (isDownload && !isEncryption) {
      const blob = await response.blob();
      return { output_file: URL.createObjectURL(blob) };
    }

    // For all other operations, return JSON response
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const downloadFile = (url: string, filename: string) => {
  saveAs(url, filename);
};
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore, useSkillStore } from '@/lib/store';
import { resumeAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function UploadResume() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setExtractedSkills } = useSkillStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(selected.type)) {
        setFile(selected);
        setError('');
      } else {
        setError('Please upload a PDF or DOCX file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await resumeAPI.uploadResume(file);
      setExtractedData(response);
      setExtractedSkills(response);
      setSuccess(true);
      setFile(null);

      setTimeout(() => {
        router.push('/dashboard/student/skills');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume. Make sure the backend server is running.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Upload Your Resume</h1>
          <p className="text-gray-400 mb-8">Upload your resume to extract skills and get job recommendations</p>

          {/* Upload Area */}
          <div className="max-w-2xl">
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02 }}
              className="p-12 border-2 border-dashed border-purple-500 rounded-2xl bg-purple-500/10 cursor-pointer hover:bg-purple-500/20 transition-all text-center"
            >
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {file ? file.name : 'Drop your resume here'}
              </h3>
              <p className="text-gray-400">or click to select PDF/DOCX files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>

            {/* Upload Button */}
            <div className="mt-6 flex gap-4">
              <motion.button
                onClick={handleUpload}
                disabled={!file || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-xl disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : 'Upload & Extract Skills'}
              </motion.button>

              <motion.button
                onClick={() => setFile(null)}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-4 border-2 border-gray-600 text-white rounded-lg hover:bg-gray-600/20 transition-all"
              >
                Clear
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400"
              >
                ✓ Resume uploaded successfully! Redirecting...
              </motion.div>
            )}

            {extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <h3 className="text-xl font-bold text-white mb-4">Extracted Information</h3>
                <div className="space-y-3 text-gray-300">
                  {extractedData.name && <p><strong>Name:</strong> {extractedData.name}</p>}
                  {extractedData.email && <p><strong>Email:</strong> {extractedData.email}</p>}
                  {extractedData.phone && <p><strong>Phone:</strong> {extractedData.phone}</p>}
                  {extractedData.experience && <p><strong>Experience:</strong> {extractedData.experience}</p>}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

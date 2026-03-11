'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function RecruiterProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="recruiter" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Company Profile</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl p-8 bg-gray-800/50 border border-gray-700 rounded-xl"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
            >
              Edit Profile
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

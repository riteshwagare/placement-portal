'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

          <div className="max-w-2xl">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-2xl mb-8"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  <span className="inline-block mt-2 px-4 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm font-semibold">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Email Address</label>
                  <p className="text-white font-semibold">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">User ID</label>
                  <p className="text-white font-semibold">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Account Type</label>
                  <p className="text-white font-semibold capitalize">{user.role} Account</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
              >
                Edit Profile
              </motion.button>
            </motion.div>

            {/* Settings */}
            <div className="p-8 bg-gray-800/50 border border-gray-700 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Settings</h3>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full p-4 text-left hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Notifications</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full p-4 text-left hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Privacy Settings</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full p-4 text-left hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Help & Support</span>
                    <span className="text-gray-400">→</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

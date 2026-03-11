'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="admin" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

          <div className="max-w-2xl space-y-6">
            {['General Settings', 'Email Configuration', 'API Keys', 'Notifications'].map((setting, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-bold">{setting}</h3>
                  <span className="text-gray-400">→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

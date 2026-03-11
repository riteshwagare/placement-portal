'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="admin" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Analytics & Reports</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {['Placement Rate', 'Average Skills', 'Top Companies', 'Popular Skills'].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <h3 className="text-xl font-bold text-white mb-4">{metric}</h3>
                <div className="h-40 bg-gradient-to-b from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Analytics data</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor system performance and manage the platform</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Students', value: '1,234', icon: '👨‍🎓' },
              { label: 'Companies', value: '45', icon: '🏢' },
              { label: 'Active Jobs', value: '156', icon: '💼' },
              { label: 'Placements', value: '342', icon: '✅' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
                <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Placement Trend</h3>
              <div className="h-40 bg-gradient-to-b from-purple-600/20 to-blue-600/20 rounded-lg flex items-end justify-around p-4">
                {[40, 60, 45, 70, 55, 80, 75].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Skills Distribution</h3>
              <div className="space-y-3">
                {['Python', 'JavaScript', 'Java', 'SQL', 'React'].map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-gray-300 text-sm mb-1">
                      <span>{skill}</span>
                      <span>{Math.random() * 100 | 0}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">System Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New student registration', time: '2 minutes ago', icon: '👤' },
                { action: 'Company job posting', time: '15 minutes ago', icon: '📝' },
                { action: 'Successful placement', time: '1 hour ago', icon: '✅' },
                { action: 'Student quiz completion', time: '2 hours ago', icon: '✏️' },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

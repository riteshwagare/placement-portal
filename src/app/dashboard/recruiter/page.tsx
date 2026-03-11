'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecruiterDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'recruiter') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="recruiter" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-400">Manage job postings and connect with top talent</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Active Jobs', value: '3', icon: '💼' },
              { label: 'Applications', value: '24', icon: '📋' },
              { label: 'Shortlisted', value: '8', icon: '⭐' },
              { label: 'Hired', value: '2', icon: '✅' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl backdrop-blur"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
                <div className="text-3xl font-bold text-white mt-2">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Link href="/dashboard/recruiter/post-job">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">➕</div>
                <h3 className="text-xl font-bold text-white">Post New Job</h3>
                <p className="text-white/80 mt-2">Create and publish a new job opening</p>
              </motion.div>
            </Link>

            <Link href="/dashboard/recruiter/applicants">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-white">View Applicants</h3>
                <p className="text-white/80 mt-2">Review and manage applications</p>
              </motion.div>
            </Link>
          </div>

          {/* Recent Jobs */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Job Postings</h2>
            <div className="space-y-4">
              {['Senior Python Developer', 'Full Stack React Developer', 'ML Engineer'].map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">{job}</h3>
                      <p className="text-gray-400 text-sm">Posted 2 days ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">12 Applications</p>
                      <p className="text-green-400 text-sm">3 Shortlisted</p>
                    </div>
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

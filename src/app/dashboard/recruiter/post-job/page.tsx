'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Post a New Job</h1>

          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gray-800/50 border border-gray-700 rounded-xl"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Senior Python Developer"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="Job description..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Required Skills</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="Python, Django, PostgreSQL"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Salary Range</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder="$80,000 - $120,000"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
                >
                  Post Job
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function RecruiterJobsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'recruiter') {
    router.push('/login');
    return null;
  }

  const jobs = [
    { id: 1, title: 'Senior Python Developer', applications: 12, status: 'Open' },
    { id: 2, title: 'Full Stack React Developer', applications: 8, status: 'Open' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="recruiter" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">My Job Postings</h1>

          <div className="space-y-4">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">{job.title}</h3>
                    <p className="text-gray-400">{job.applications} Applications</p>
                  </div>
                  <span className="px-4 py-2 bg-green-500/30 text-green-300 rounded-full">{job.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

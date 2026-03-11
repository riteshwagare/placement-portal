'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function CompaniesPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  const companies = [
    { id: 1, name: 'TechCorp', jobs: 5, placements: 12 },
    { id: 2, name: 'AI Innovations', jobs: 3, placements: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="admin" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Companies</h1>

          <div className="space-y-4">
            {companies.map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg">{company.name}</h3>
                  <div className="space-x-6">
                    <span className="text-purple-400">{company.jobs} Jobs</span>
                    <span className="text-green-400">{company.placements} Placements</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

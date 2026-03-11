'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ApplicantsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'recruiter') {
    router.push('/login');
    return null;
  }

  const applicants = [
    { id: 1, name: 'John Doe', skills: ['Python', 'Django'], status: 'Shortlisted', score: 85 },
    { id: 2, name: 'Jane Smith', skills: ['Python', 'FastAPI'], status: 'Review', score: 78 },
    { id: 3, name: 'Mike Johnson', skills: ['Python', 'PostgreSQL'], status: 'Rejected', score: 62 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="recruiter" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Applicants</h1>

          <div className="space-y-4">
            {applicants.map((applicant, i) => (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{applicant.name}</h3>
                    <div className="flex gap-2 mt-2">
                      {applicant.skills.map((skill, j) => (
                        <span key={j} className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{applicant.score}%</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                      applicant.status === 'Shortlisted' ? 'bg-green-500/30 text-green-300' :
                      applicant.status === 'Review' ? 'bg-yellow-500/30 text-yellow-300' :
                      'bg-red-500/30 text-red-300'
                    }`}>
                      {applicant.status}
                    </span>
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

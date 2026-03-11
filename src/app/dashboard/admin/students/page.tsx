'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function StudentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', skills: 5, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', skills: 8, status: 'Active' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="admin" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-white mb-8">Students</h1>

          <div className="space-y-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold">{student.name}</h3>
                    <p className="text-gray-400">{student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{student.skills} Skills</p>
                    <span className="text-green-400">{student.status}</span>
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

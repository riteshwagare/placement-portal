'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore, useSkillStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function SkillsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { extractedSkills } = useSkillStore();

  if (!user || user.role !== 'student') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Your Extracted Skills</h1>
          <p className="text-gray-400 mb-8">Skills extracted from your resume using AI</p>

          {extractedSkills && extractedSkills.skills.length > 0 ? (
            <>
              {/* Contact Information */}
              <div className="mb-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                  {extractedSkills.email && <p><strong>Email:</strong> {extractedSkills.email}</p>}
                  {extractedSkills.phone && <p><strong>Phone:</strong> {extractedSkills.phone}</p>}
                  {extractedSkills.name && <p><strong>Name:</strong> {extractedSkills.name}</p>}
                  {extractedSkills.experience && <p><strong>Experience:</strong> {extractedSkills.experience}</p>}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Technical & Professional Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {extractedSkills.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/dashboard/student/quiz')}
                  className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">✏️</div>
                  <h3 className="font-bold text-white">Take Skill Quiz</h3>
                  <p className="text-white/80 text-sm mt-2">Test your knowledge</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/dashboard/student/jobs')}
                  className="p-6 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">💼</div>
                  <h3 className="font-bold text-white">View Jobs</h3>
                  <p className="text-white/80 text-sm mt-2">Get job recommendations</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/dashboard/student/upload')}
                  className="p-6 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="text-3xl mb-2">📄</div>
                  <h3 className="font-bold text-white">Update Resume</h3>
                  <p className="text-white/80 text-sm mt-2">Upload a new resume</p>
                </motion.div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 bg-gray-800/50 border border-gray-700 rounded-lg text-center"
            >
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Skills Extracted Yet</h2>
              <p className="text-gray-400 mb-6">Upload your resume to get started</p>
              <motion.button
                onClick={() => router.push('/dashboard/student/upload')}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
              >
                Upload Resume
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

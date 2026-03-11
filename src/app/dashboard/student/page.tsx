'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore, useSkillStore, useJobStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { extractedSkills } = useSkillStore();
  const { jobRecommendations } = useJobStore();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-400">Your AI-powered placement journey starts here</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Skills Extracted', value: extractedSkills?.skills?.length || 0, icon: '⚡' },
              { label: 'Quizzes Completed', value: '0', icon: '✏️' },
              { label: 'Job Matches', value: jobRecommendations.length || 0, icon: '💼' },
              { label: 'Profile Strength', value: '45%', icon: '💪' },
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
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/student/upload">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-white">Upload Resume</h3>
                <p className="text-white/80 mt-2">Start by uploading your resume</p>
              </motion.div>
            </Link>

            <Link href="/dashboard/student/skills">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white">View Skills</h3>
                <p className="text-white/80 mt-2">Check your extracted skills</p>
              </motion.div>
            </Link>

            <Link href="/dashboard/student/quiz">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">✏️</div>
                <h3 className="text-xl font-bold text-white">Take Quiz</h3>
                <p className="text-white/80 mt-2">Test your knowledge</p>
              </motion.div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity yet. Start by uploading your resume!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

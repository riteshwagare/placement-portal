'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { useAuthStore, useSkillStore, useJobStore } from '@/lib/store';
import { jobAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { extractedSkills } = useSkillStore();
  const { jobRecommendations, setJobRecommendations } = useJobStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }

    if (extractedSkills && extractedSkills.skills.length > 0 && jobRecommendations.length === 0) {
      loadRecommendations();
    }
  }, [extractedSkills, user, router, jobRecommendations.length]);

  const loadRecommendations = async () => {
    if (!extractedSkills) return;

    setLoading(true);
    try {
      const jobs = await jobAPI.getJobRecommendations(extractedSkills.skills);
      setJobRecommendations(jobs);
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar role="student" />

      <div className="flex-1 ml-64 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Recommended Jobs</h1>
          <p className="text-gray-400 mb-8">
            {extractedSkills && extractedSkills.skills.length > 0
              ? `Based on your skills: ${extractedSkills.skills.slice(0, 3).join(', ')}...`
              : 'Upload your resume to get job recommendations'}
          </p>

          {extractedSkills && extractedSkills.skills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 bg-gray-800/50 border border-gray-700 rounded-lg text-center"
            >
              <div className="text-5xl mb-4">💼</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Skills Found</h2>
              <p className="text-gray-400 mb-6">Upload your resume to get personalized job recommendations</p>
              <motion.button
                onClick={() => router.push('/dashboard/student/upload')}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg"
              >
                Upload Resume
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {jobRecommendations.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-xl hover:border-purple-500 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{job.role}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                        {Math.round(job.matchScore)}%
                      </div>
                      <p className="text-sm text-gray-400">Match</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{job.description}</p>

                  {/* Skills Match */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => {
                        const isMatched = extractedSkills?.skills?.some(
                          (s) =>
                            s.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(s.toLowerCase())
                        );
                        return (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              isMatched
                                ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                : 'bg-gray-600/30 text-gray-300 border border-gray-600/50'
                            }`}
                          >
                            {skill}
                            {isMatched && ' ✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Salary and Action */}
                  <div className="flex justify-between items-center">
                    {job.salary && <p className="text-lg font-semibold text-green-400">{job.salary}</p>}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg"
                    >
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

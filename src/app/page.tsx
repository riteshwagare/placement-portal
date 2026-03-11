'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold text-white mb-6"
          >
            NextGen <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Placement</span> Portal
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Empower your career with AI-driven skill extraction, personalized quizzes, and intelligent job recommendations
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Get Started
              </motion.button>
            </Link>
            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white text-lg font-bold rounded-lg hover:bg-white hover:text-purple-900 transition-all"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📄',
                title: 'Smart Resume Parser',
                description: 'AI-powered NLP technology extracts skills, experience, and contact info from your resume',
              },
              {
                icon: '⚡',
                title: 'Skill Extraction',
                description: 'Automatically identify and categorize your technical and soft skills',
              },
              {
                icon: '✏️',
                title: 'AI Quizzes',
                description: 'Test your knowledge with personalized quizzes based on your extracted skills',
              },
              {
                icon: '💼',
                title: 'Job Matching',
                description: 'Get intelligent job recommendations based on your skill profile',
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                description: 'Track your progress and performance metrics in one place',
              },
              {
                icon: '🎯',
                title: 'Career Insights',
                description: 'Get personalized career guidance and skill development recommendations',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-500/50 hover:bg-white/20 transition-all group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              { step: '1', title: 'Upload Your Resume', desc: 'Upload your resume in PDF or DOCX format' },
              { step: '2', title: 'AI Extracts Skills', desc: 'Our NLP engine analyzes and extracts your skills' },
              { step: '3', title: 'Take Quizzes', desc: 'Test your knowledge with personalized quizzes' },
              { step: '4', title: 'Get Job Matches', desc: 'Receive intelligent job recommendations' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Companies Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-12">
            Trusted by Top Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 font-bold text-lg hover:text-white transition-colors"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students already using NextGen to land their dream jobs
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 text-lg font-bold rounded-lg hover:shadow-2xl transition-all"
            >
              Sign Up Now
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold mb-4">NextGen</h4>
            <p className="text-gray-400">AI-powered placement portal for modern careers</p>
          </div>
          {['Product', 'Company', 'Resources', 'Legal'].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-4">{col}</h4>
              <ul className="space-y-2 text-gray-400">
                {['Link 1', 'Link 2', 'Link 3'].map((link, j) => (
                  <li key={j} className="hover:text-white cursor-pointer transition-colors">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center text-gray-400 border-t border-white/10 pt-8">
          <p>&copy; 2026 NextGen AI Placement Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

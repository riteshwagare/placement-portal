'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

interface SidebarProps {
  role: 'student' | 'recruiter' | 'admin';
}

const menuItems = {
  student: [
    { label: 'Dashboard', href: '/dashboard/student', icon: '📊' },
    { label: 'Upload Resume', href: '/dashboard/student/upload', icon: '📄' },
    { label: 'Skills', href: '/dashboard/student/skills', icon: '⚡' },
    { label: 'Skill Test', href: '/dashboard/student/quiz', icon: '✏️' },
    { label: 'Job Recommendations', href: '/dashboard/student/jobs', icon: '💼' },
    { label: 'Profile', href: '/dashboard/student/profile', icon: '👤' },
  ],
  recruiter: [
    { label: 'Dashboard', href: '/dashboard/recruiter', icon: '📊' },
    { label: 'Post Job', href: '/dashboard/recruiter/post-job', icon: '➕' },
    { label: 'Applicants', href: '/dashboard/recruiter/applicants', icon: '👥' },
    { label: 'My Jobs', href: '/dashboard/recruiter/jobs', icon: '💼' },
    { label: 'Profile', href: '/dashboard/recruiter/profile', icon: '👤' },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈' },
    { label: 'Students', href: '/dashboard/admin/students', icon: '👨‍🎓' },
    { label: 'Companies', href: '/dashboard/admin/companies', icon: '🏢' },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const items = menuItems[role];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto"
    >
      <div className="p-6">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="font-bold">NG</span>
          </div>
          <span className="font-bold text-lg">NextGen</span>
        </motion.div>

        <nav className="space-y-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 rounded-lg hover:bg-purple-600/30 transition-all cursor-pointer flex items-center gap-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
        >
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;

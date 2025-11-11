import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  CreditCard,
  FileText,
  MessageSquare,
  ClipboardList,
  Upload,
  Video,
  Menu,
  X,
  User
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const studentTabs = [
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Credits', path: '/student/credits', icon: CreditCard },
    { name: 'Completed', path: '/student/completed', icon: GraduationCap },
    { name: 'Documents', path: '/student/documents', icon: FileText },
    { name: 'Summarizer', path: '/student/summarizer', icon: FileText },
    { name: 'Peer Chat', path: '/student/chat', icon: MessageSquare },
    { name: 'Assessments', path: '/student/assessments', icon: ClipboardList },
  ];

  const instructorTabs = [
    { name: 'Upload Course', path: '/instructor/upload', icon: Upload },
    { name: 'Live Classes', path: '/instructor/live-classes', icon: Video },
    { name: 'Credits', path: '/instructor/credits', icon: CreditCard },
  ];

  const activeTab = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-gray-300 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* ✅ Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black font-bold text-xl">
              S
            </div>
            <span className="text-xl font-bold text-black dark:text-white">Sarvasva</span>
          </Link>

          {/* ✅ Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">

            {studentTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all
                  ${activeTab(tab.path)
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
              </Link>
            ))}

            {instructorTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all
                  ${activeTab(tab.path)
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
              </Link>
            ))}
          </div>

          {/* ✅ Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* ✅ Profile Box */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 px-3 py-2 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                <User size={18} />
                <span className="hidden md:block">Guest</span>
              </button>

              {/* ✅ Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-2 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ✅ Mobile Menu Icon */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden rounded-lg p-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-300 dark:border-gray-800"
            >
              <div className="space-y-2">

                {studentTabs.map((tab) => (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setShowMenu(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg
                      ${activeTab(tab.path)
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.name}</span>
                  </Link>
                ))}

                {instructorTabs.map((tab) => (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setShowMenu(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg
                      ${activeTab(tab.path)
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

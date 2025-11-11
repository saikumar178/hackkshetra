import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  FlaskConical,
  Languages,
} from 'lucide-react';

const skills = [
  { name: 'Web Development', icon: Code, category: 'programming' },
  { name: 'UI/UX Design', icon: Palette, category: 'design' },
  { name: 'Business Strategy', icon: Briefcase, category: 'business' },
  { name: 'Data Science', icon: FlaskConical, category: 'science' },
  { name: 'Languages', icon: Languages, category: 'language' },
];

const certifications = [
  { name: 'Full Stack Developer', category: 'programming' },
  { name: 'UI/UX Designer', category: 'design' },
  { name: 'Business Analyst', category: 'business' },
  { name: 'Data Scientist', category: 'science' },
  { name: 'Language Expert', category: 'language' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          
          {/* ✅ Skills */}
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-black dark:text-white">
              <BookOpen size={20} />
              Popular Skills
            </h3>
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li key={skill.name}>
                  <Link
                    to={`/?category=${skill.category}`}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                               hover:text-black dark:hover:text-white transition"
                  >
                    <skill.icon size={16} />
                    {skill.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Certifications */}
          <div>
            <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-black dark:text-white">
              <Award size={20} />
              Certifications
            </h3>
            <ul className="space-y-2">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <Link
                    to={`/?category=${cert.category}`}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 
                               hover:text-black dark:hover:text-white transition"
                  >
                    <GraduationCap size={16} />
                    {cert.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              About Sarvasva
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Learn without limits. Access courses, earn credits, and grow your career with our 
              next-generation learning platform.
            </p>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <GraduationCap size={20} />
              <span>Empowering learners worldwide</span>
            </div>
          </div>
        </div>

        {/* ✅ Footer Bottom */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; 2024 Sarvasva — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

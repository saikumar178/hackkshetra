import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Users, Play, Check, BarChart3, Video } from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import { dummyCourses } from '../data/dummyData';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchUser } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (course && user) calculateProgress();
  }, [course, user]);

  // ✅ JSON-Backend Course Fetch
  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (error) {
      const dummyCourse =
        dummyCourses.find((c) => c.id === id) || dummyCourses[0];
      setCourse(dummyCourse);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Progress (JSON backend has no watched data → simulate)
  const calculateProgress = () => {
    if (!course || !user?.enrolledCourses?.includes(course.id)) {
      setProgress(0);
      return;
    }

    const total = course.videos?.length || 1;
    const watched = Math.floor(total * 0.3); // 30% demo
    setProgress(Math.round((watched / total) * 100));
  };

  // ✅ JSON Backend Enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setEnrolling(true);

    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Enrolled successfully!');

      // ✅ Update frontend auth store
      fetchUser();

      navigate(`/course/${id}/play`);
    } catch (error) {
      toast.success('Enrolled (Demo Mode)');
      navigate(`/course/${id}/play`);
    } finally {
      setEnrolling(false);
    }
  };

  // ✅ Loading fallback
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-20">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-900" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Course not found</p>
        </div>
      </div>
    );
  }

  // ✅ JSON Backend Fields
  const isEnrolled = user?.enrolledCourses?.includes(course.id);
  const totalVideos = course.videos?.length || 0;
  const totalDuration =
    course.videos?.reduce((sum, v) => sum + (v.duration || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left side content */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Banner */}
              <div className="mb-6 h-64 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-900 lg:h-96">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title}
                      className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Play size={64} className="text-gray-400" />
                  </div>
                )}
              </div>

              <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
                {course.title}
              </h1>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                {course.description}
              </p>

              {/* ✅ Progress for JSON backend */}
              {isEnrolled && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <BarChart3 size={20} className="text-blue-500" />
                        <span className="font-semibold">Your Progress</span>
                      </div>
                      <span>{progress}%</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800">
                      <div className="h-3 bg-blue-500 rounded-full"
                           style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Video size={16} />
                        <span>{totalVideos} videos</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{Math.floor(totalDuration / 60)} minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400" size={20} />
                  <span>{course.averageRating || 0}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-gray-500" />
                  <span>{course.totalStudents || 0} students</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock size={20} className="text-gray-500" />
                  <span>{totalVideos} videos</span>
                </div>
              </div>

              {/* Objectives */}
              {course.learningObjectives?.length > 0 && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {course.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check size={18} className="mt-1 text-green-500" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Videos */}
              {course.videos?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Course Content</h3>
                    <div className="space-y-2">
                      {course.videos.map((v, i) => (
                        <div key={i}
                             className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
                          <div className="flex items-center space-x-2">
                            <Play size={18} className="text-gray-500" />
                            <span>{v.title}</span>
                          </div>
                          <span>{Math.floor((v.duration || 0) / 60)} min</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-yellow-500">
                      {course.price}
                    </div>
                    <div className="text-sm text-gray-500">Credits</div>
                  </div>

                  {isEnrolled ? (
                    <Link to={`/course/${course.id}/play`}>
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login />
      </Modal>
    </div>
  );
}

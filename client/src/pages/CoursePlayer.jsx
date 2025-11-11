import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Languages, ChevronDown, Video, Clock } from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../lib/api';
import useAuthStore from '../store/authStore';
import { dummyCourses } from '../data/dummyData';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatTime } from '../lib/utils';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [subtitleLanguage, setSubtitleLanguage] = useState('en');
  const [boardLanguage, setBoardLanguage] = useState('en');
  const [subtitleText, setSubtitleText] = useState('');
  const [boardText, setBoardText] = useState([]);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showBoardText, setShowBoardText] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // ✅ FETCH COURSE (JSON BACKEND)
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        const fallback = dummyCourses.find(c => c.id === courseId) || dummyCourses[0];
        setCourse(fallback);
      }
    };
    load();
  }, [courseId]);

  // ✅ Update subtitles + board text dynamically
  useEffect(() => {
    if (course?.videos?.[currentVideoIndex]) {
      updateSubtitles();
      updateBoardText();
    }
  }, [currentVideoIndex, subtitleLanguage, boardLanguage, course, played]);

  // ✅ JSON-safe subtitle handling
  const updateSubtitles = () => {
    const video = course?.videos?.[currentVideoIndex];
    if (!video) return;

    const subs = video.subtitles;

    const text =
      subs?.[subtitleLanguage] ||
      subs?.['en'] ||
      `[${subtitleLanguage.toUpperCase()}] Subtitles not available`;

    setSubtitleText(text);
  };

  // ✅ JSON-safe board text handling
  const updateBoardText = () => {
    const video = course?.videos?.[currentVideoIndex];
    if (!video) return;

    const currentTime = played * (video.duration || 0);

    if (video.boardTextData?.length > 0) {
      const matches = video.boardTextData.filter(
        item => Math.abs(item.timestamp - currentTime) < 5
      );

      const translated = matches.map(item => ({
        ...item,
        translated:
          item.translatedText?.[boardLanguage] ||
          item.translatedText?.['en'] ||
          item.text,
      }));

      setBoardText(translated);
    } else {
      setBoardText([]);
    }
  };

  // ✅ Track progress
  const handleProgress = state => {
    setPlayed(state.played);
    updateBoardText();
  };

  // ✅ JSON Backend course completion
  const handleCompleteCourse = async () => {
    try {
      const guestId = localStorage.getItem("guestId"); // if needed
      await api.post(`/students/${guestId}/complete-course`, { courseId });

      toast.success("✅ Course Completed! 50 credits added.");
      navigate("/student/completed");
    } catch (err) {
      toast.success("✅ Course Completed! (Demo)");
      navigate("/student/completed");
    }
  };

  if (!course) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Loading course...</p>
      </div>
    );
  }

  const video = course.videos?.[currentVideoIndex];
  const totalVideos = course.videos?.length || 0;
  const progressPercent = ((currentVideoIndex + 1) / totalVideos) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-20">

        {/* Back */}
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="text-gray-600 dark:text-gray-300 mb-4"
        >
          ← Back to Course
        </button>

        {/* Player Section */}
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Player */}
              <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
                <ReactPlayer
                  url={video.videoUrl}
                  playing={playing}
                  muted={muted}
                  volume={volume}
                  onProgress={handleProgress}
                  onEnded={() => {
                    if (currentVideoIndex < totalVideos - 1) {
                      setCurrentVideoIndex(currentVideoIndex + 1);
                      setPlaying(true);
                    } else {
                      handleCompleteCourse();
                    }
                  }}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                />

                {/* Subtitles */}
                {showSubtitles && subtitleText && (
                  <div className="absolute bottom-24 w-full text-center">
                    <p className="inline-block bg-black/80 text-white px-4 py-2 rounded text-lg">
                      {subtitleText}
                    </p>
                  </div>
                )}

                {/* Board text */}
                {showBoardText && boardText.length > 0 && (
                  <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg max-w-xs">
                    {boardText.map((item, i) => (
                      <p key={i} className="text-sm text-white">
                        {item.translated}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">

                {/* Main controls */}
                <div className="flex items-center space-x-3 mb-4">
                  <button onClick={() => setPlaying(!playing)} className="p-2 bg-black text-white rounded">
                    {playing ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button onClick={() => setMuted(!muted)} className="p-2 bg-gray-300 rounded">
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                  />
                </div>

                {/* Language Menu */}
                <div className="relative mb-4">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center space-x-2 p-2 bg-gray-200 dark:bg-gray-800 rounded"
                  >
                    <Languages size={18} />
                    <span>Languages</span>
                    <ChevronDown size={16} />
                  </button>

                  {showLanguageMenu && (
                    <div className="absolute mt-2 bg-white dark:bg-gray-900 p-4 rounded shadow z-50">
                      <label className="text-sm">Subtitles</label>
                      <select
                        className="w-full mt-1 p-2 rounded bg-gray-200 dark:bg-gray-800"
                        value={subtitleLanguage}
                        onChange={e => setSubtitleLanguage(e.target.value)}
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>

                      <label className="text-sm mt-3 block">Board Language</label>
                      <select
                        className="w-full mt-1 p-2 rounded bg-gray-200 dark:bg-gray-800"
                        value={boardLanguage}
                        onChange={e => setBoardLanguage(e.target.value)}
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Seek Bar */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={played}
                  onChange={e => setPlayed(parseFloat(e.target.value))}
                  className="w-full"
                />

                <div className="flex justify-between text-xs mt-2 text-gray-600 dark:text-gray-300">
                  <span>{formatTime(played * (video.duration || 0))}</span>
                  <span>{formatTime(video.duration || 0)}</span>
                </div>
              </div>
            </Card>

            {/* Course description */}
            <Card className="mt-6">
              <CardContent>
                <h2 className="text-xl font-bold">{course.title}</h2>
                <p className="mt-2 text-gray-600">{course.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent>
                <h3 className="font-bold mb-3">Course Videos</h3>
                <div className="space-y-2">
                  {course.videos?.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentVideoIndex(i);
                        setPlaying(true);
                      }}
                      className={`w-full text-left p-3 rounded border ${
                        i === currentVideoIndex
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">{v.title}</p>
                      <p className="text-xs text-gray-500">{formatTime(v.duration)}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

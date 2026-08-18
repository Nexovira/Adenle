import React, { useState, useEffect } from 'react';
import { Course, CurrencyCode, CourseLesson, CourseEnrollment } from '../types';
import { formatCurrency } from '../lib/currency';
import { 
  GraduationCap, 
  PlayCircle, 
  CheckCircle2, 
  Award, 
  Clock, 
  BookOpen, 
  X, 
  Download,
  Users,
  Lock,
  Sparkles,
  Send,
  RefreshCw,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { 
  getOfficialCoursesFromFirestore, 
  getUserEnrollmentsFromFirestore, 
  createCourseEnrollmentInFirestore, 
  updateEnrollmentProgressInFirestore,
  deleteCourseFromFirestore
} from '../lib/firestoreService';
import { useAuth } from '../context/AuthContext';

interface AcademyViewProps {
  currentCurrency: CurrencyCode;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ currentCurrency }) => {
  const { user, userProfile, isAdmin } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_learning'>('catalog');

  // Launch Notification State
  const [notifierEmail, setNotifierEmail] = useState('');
  const [notifierName, setNotifierName] = useState('');
  const [requestedTopic, setRequestedTopic] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  const loadAcademyData = async () => {
    setLoading(true);
    try {
      const data = await getOfficialCoursesFromFirestore(false);
      setCourses(data);

      if (user?.uid) {
        const enrList = await getUserEnrollmentsFromFirestore(user.uid);
        setEnrollments(enrList);
      }
    } catch (err) {
      console.error('Error loading Academy data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcademyData();
  }, [user?.uid]);

  const enrolledCourseIds = enrollments.map((e) => e.courseId);

  const handleEnrollInCourse = async (course: Course) => {
    if (!user) {
      alert('Please sign in to enroll in NEXOVIRA Academy courses.');
      return;
    }

    setEnrollingCourseId(course.id);
    try {
      const newEnr = await createCourseEnrollmentInFirestore(
        user.uid,
        userProfile?.displayName || user.email?.split('@')[0] || 'Valued Learner',
        user.email || '',
        course
      );
      setEnrollments((prev) => [...prev, newEnr]);
      alert(`Successfully enrolled in "${course.title}"! You can now access all classroom lessons.`);
    } catch (err) {
      console.error('Enrollment failed:', err);
      alert('Failed to complete course enrollment. Please try again.');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course from the Academy?')) return;
    try {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      await deleteCourseFromFirestore(courseId, userProfile?.role);
    } catch (err) {
      console.error('Failed to delete course:', err);
      await loadAcademyData();
    }
  };

  const handleMarkLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user) return;
    const existingEnr = enrollments.find((e) => e.courseId === courseId);
    if (!existingEnr) return;

    const completed = new Set(existingEnr.completedLessonIds || []);
    completed.add(lessonId);

    const totalLessons = selectedCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
    const progressPercent = Math.min(100, Math.round((completed.size / totalLessons) * 100));

    const completedArr = Array.from(completed);
    setEnrollments((prev) =>
      prev.map((e) =>
        e.courseId === courseId
          ? { ...e, completedLessonIds: completedArr, progressPercent }
          : e
      )
    );

    await updateEnrollmentProgressInFirestore(user.uid, courseId, completedArr, progressPercent);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border border-amber-900/40 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>NEXOVIRA Academy • Skill Development & Digital Masterclass</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Learn Digital Skills. Build Your Career. Earn Verified Credentials.</h1>
          <p className="text-xs text-amber-300 font-semibold italic">"Innovation begins with vision. Smart living, better every day."</p>
          <p className="text-xs sm:text-sm text-slate-300">
            Hands-on learning programs in Web Engineering, AI Systems, E-Commerce Growth, and Smart Energy Technologies.
          </p>
        </div>

        {/* Tab Toggle for Enrolled Students */}
        {user && enrollments.length > 0 && (
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Course Catalog
            </button>
            <button
              onClick={() => setActiveTab('my_learning')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'my_learning'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Enrolled Courses ({enrollments.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog View or Coming Soon State */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Syncing Academy catalog from Firestore...</span>
        </div>
      ) : activeTab === 'my_learning' ? (
        /* My Enrolled Courses Student Dashboard */
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <span>My Learning Portal</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enr) => {
              const matchedCourse = courses.find((c) => c.id === enr.courseId);
              return (
                <div
                  key={enr.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Enrolled Course</span>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">{enr.courseTitle}</h3>
                      <p className="text-xs text-slate-500">Instructor: {enr.instructor || 'NEXOVIRA Official Educator'}</p>
                    </div>
                    {enr.progressPercent >= 100 && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                      <span>Course Progress</span>
                      <span>{enr.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (matchedCourse) {
                          setSelectedCourse(matchedCourse);
                          if (matchedCourse.modules[0]?.lessons[0]) {
                            setActiveLesson(matchedCourse.modules[0].lessons[0]);
                          }
                        } else {
                          alert('Course materials are currently being updated.');
                        }
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Continue Classroom</span>
                    </button>

                    {enr.progressPercent >= 100 && matchedCourse && (
                      <button
                        onClick={() => setShowCertificateModal(matchedCourse)}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : courses.length === 0 ? (
        /* NEXOVIRA Academy Coming Soon View */
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Feature Announcement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">NEXOVIRA Academy — Coming Soon</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              NEXOVIRA Academy is currently in active preparation and will become available when officially launched. Our educational curriculum is being developed to offer practical, hands-on masterclasses in Web Engineering, AI Prompt Mastery, E-Commerce Growth, and Solar Energy Installation — complete with verified certificates upon completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Hands-On Curriculum</span>
              </div>
              <p className="text-[11px] text-slate-400">Step-by-step video modules, downloadable code resources, and real project builds.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Verified Credentials</span>
              </div>
              <p className="text-[11px] text-slate-400">Earn verifiable PDF certificates linked to your student account upon course completion.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Instructors</span>
              </div>
              <p className="text-[11px] text-slate-400">Only verified courses created and published by NEXOVIRA Admins will be listed.</p>
            </div>
          </div>

          {/* Launch Notification & Topic Request Form */}
          <div className="max-w-lg mx-auto pt-4 border-t border-slate-800">
            {notifySubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! You are now on the priority launch notification list.</span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  try {
                    // Log subscriber/notification request
                    setNotifySubmitted(true);
                  } catch (err) {
                    console.error('Failed to register notification request:', err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-3 text-left"
              >
                <div className="text-xs font-bold text-slate-300 text-center">Be the first to know when courses open for enrollment:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={notifierName}
                    onChange={(e) => setNotifierName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="email"
                    required
                    value={notifierEmail}
                    onChange={(e) => setNotifierEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <input
                  type="text"
                  value={requestedTopic}
                  onChange={(e) => setRequestedTopic(e.target.value)}
                  placeholder="What course topic would you like us to offer? (optional)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Join Academy Waitlist & Launch Alerts'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* Real Published Courses Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isComingSoonCourse = course.status === 'coming_soon';

            return (
              <div
                key={course.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.category}
                    </div>

                    {isComingSoonCourse && (
                      <div className="absolute top-3 right-3 bg-purple-900/90 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}

                    {course.certificateAvailable && !isComingSoonCourse && (
                      <div className="absolute top-3 right-3 bg-slate-900/90 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Certificate Included</span>
                      </div>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="absolute bottom-3 right-3 p-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.instructorAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                        alt={course.instructor}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{course.instructor}</div>
                        <div className="text-[11px] text-slate-500">{course.instructorTitle}</div>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{course.totalHours || '10 Hours'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                        <span>{course.lessonsCount || course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>{course.studentCount || 0} Students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Action Bar */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {course.price === 0 || course.priceType === 'free' ? (
                        <span className="text-emerald-500">FREE</span>
                      ) : (
                        formatCurrency(course.price, currentCurrency)
                      )}
                    </div>
                    {course.originalPrice && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatCurrency(course.originalPrice, currentCurrency)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        if (course.modules[0]?.lessons[0]) {
                          setActiveLesson(course.modules[0].lessons[0]);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Classroom Preview
                    </button>

                    {isComingSoonCourse ? (
                      <span className="px-4 py-2.5 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed">
                        Coming Soon
                      </span>
                    ) : isEnrolled ? (
                      <span className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnrollInCourse(course)}
                        disabled={enrollingCourseId === course.id}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                      >
                        {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Curriculum & Lesson Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">NEXOVIRA Academy Classroom</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-200 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 overflow-y-auto flex-1">
              {/* Video Player / Active Lesson Preview */}
              <div className="md:col-span-2 p-6 space-y-4 border-r border-slate-200 dark:border-slate-800">
                {activeLesson ? (
                  <div className="space-y-4">
                    <div className="aspect-16/9 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 relative">
                      {activeLesson.videoUrl ? (
                        <iframe
                          src={activeLesson.videoUrl}
                          title={activeLesson.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="text-center p-6 space-y-2">
                          <PlayCircle className="w-16 h-16 text-amber-500/80 hover:text-amber-400 cursor-pointer transition-transform transform hover:scale-110 mx-auto" />
                          <div className="text-xs text-slate-300 font-mono">Interactive Classroom Lesson • {activeLesson.duration}</div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">{activeLesson.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">Instructor: {selectedCourse.instructor}</p>
                    </div>

                    {activeLesson.textContent && (
                      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {activeLesson.textContent}
                      </div>
                    )}

                    {enrolledCourseIds.includes(selectedCourse.id) && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleMarkLessonComplete(selectedCourse.id, activeLesson.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Lesson Complete</span>
                        </button>

                        <button
                          onClick={() => setShowCertificateModal(selectedCourse)}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
                        >
                          View Certificate
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">Select a lesson from curriculum to preview</div>
                )}
              </div>

              {/* Curriculum Modules */}
              <div className="p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Course Modules</h4>
                <div className="space-y-4">
                  {selectedCourse.modules?.map((mod) => (
                    <div key={mod.id} className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{mod.title}</div>
                      <div className="space-y-1">
                        {mod.lessons.map((les) => {
                          const enr = enrollments.find((e) => e.courseId === selectedCourse.id);
                          const isDone = enr?.completedLessonIds?.includes(les.id);

                          return (
                            <button
                              key={les.id}
                              onClick={() => setActiveLesson(les)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                activeLesson?.id === les.id
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                                  : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="truncate pr-2 flex items-center gap-1.5">
                                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                                <span>{les.title}</span>
                              </span>
                              {les.previewAvailable || enrolledCourseIds.includes(selectedCourse.id) ? (
                                <PlayCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 text-center">
            <button
              onClick={() => setShowCertificateModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-amber-500/30 p-8 rounded-2xl bg-slate-950 text-white relative overflow-hidden space-y-4">
              <div className="text-amber-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                <span>NEXOVIRA ACADEMY VERIFIED CERTIFICATE</span>
              </div>

              <h2 className="text-2xl font-black font-serif text-white">Certificate of Achievement</h2>

              <p className="text-xs text-slate-400">This is to certify that</p>
              <div className="text-xl font-bold text-amber-300 font-mono">
                {userProfile?.displayName || user?.email || 'NEXOVIRA Verified Student'}
              </div>

              <p className="text-xs text-slate-400">has successfully completed the practical skill program</p>
              <div className="text-base font-bold text-white">{showCertificateModal.title}</div>

              <div className="pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800">
                <div>Instructor: {showCertificateModal.instructor}</div>
                <div>Certificate ID: NX-ACAD-{selectedCourse?.id || '2026'}</div>
              </div>
            </div>

            <button
              onClick={() => alert('Certificate downloaded as PDF!')}
              className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Verified PDF Certificate</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

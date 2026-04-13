import React, { useState, useEffect } from 'react';
import { 
  Course, 
  Semester,
  Grade, 
  CourseWeight, 
  GpaScale,
  GRADE_POINTS_4_0, 
  calculateSemesterGPA, 
  calculateCumulativeGPA, 
  calculateTargetGPA 
} from './utils';
import Results from './Results';
import { Calculator, Plus, X, GraduationCap, Target, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

type Mode = 'semester' | 'cumulative' | 'target' | 'reference';

export default function GPACalculator() {
  const [mode, setMode] = useState<Mode>('semester');
  const [scale, setScale] = useState<GpaScale>('4.0');
  
  // Semester State
  const [semesterCourses, setSemesterCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 3, grade: 'A', weight: 'Regular' },
    { id: '2', name: '', credits: 3, grade: 'B+', weight: 'Regular' },
    { id: '3', name: '', credits: 3, grade: 'A-', weight: 'Regular' },
    { id: '4', name: '', credits: 3, grade: 'B', weight: 'Regular' },
  ]);
  
  // Cumulative State
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: 'sem1',
      name: 'Fall 2023',
      courses: [
        { id: 'c1', name: '', credits: 3, grade: 'A', weight: 'Regular' },
        { id: 'c2', name: '', credits: 3, grade: 'B+', weight: 'Regular' },
      ],
      isQuickEntry: false
    }
  ]);
  const [expandedSemesters, setExpandedSemesters] = useState<Record<string, boolean>>({ sem1: true });

  // Target Specific State
  const [targetCurrentGpa, setTargetCurrentGpa] = useState<number | ''>('');
  const [targetCurrentCredits, setTargetCurrentCredits] = useState<number | ''>('');
  const [targetGoalGpa, setTargetGoalGpa] = useState<number | ''>('');
  const [targetPlannedCredits, setTargetPlannedCredits] = useState<number | ''>('');

  // Results & Error
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Recalculate when scale changes if there's already a result
  useEffect(() => {
    if (result && mode !== 'reference') {
      handleCalculate();
    }
  }, [scale]);

  // Semester Course Management
  const addSemesterCourse = () => {
    if (semesterCourses.length < 30) {
      setSemesterCourses([...semesterCourses, { id: Date.now().toString(), name: '', credits: 3, grade: '', weight: 'Regular' }]);
    }
  };

  const removeSemesterCourse = (id: string) => {
    if (semesterCourses.length > 1) {
      setSemesterCourses(semesterCourses.filter(c => c.id !== id));
    }
  };

  const updateSemesterCourse = (id: string, field: keyof Course, value: any) => {
    setSemesterCourses(semesterCourses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const clearSemesterCourses = () => {
    setSemesterCourses([{ id: Date.now().toString(), name: '', credits: 3, grade: '', weight: 'Regular' }]);
    setResult(null);
  };

  // Cumulative Semester Management
  const addSemester = () => {
    if (semesters.length < 12) {
      const newId = Date.now().toString();
      setSemesters([...semesters, {
        id: newId,
        name: `Semester ${semesters.length + 1}`,
        courses: [{ id: Date.now().toString() + 'c', name: '', credits: 3, grade: '', weight: 'Regular' }],
        isQuickEntry: false
      }]);
      setExpandedSemesters({ ...expandedSemesters, [newId]: true });
    }
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const toggleSemesterExpand = (id: string) => {
    setExpandedSemesters({ ...expandedSemesters, [id]: !expandedSemesters[id] });
  };

  const updateSemester = (id: string, field: keyof Semester, value: any) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addCourseToSemester = (semId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId && s.courses.length < 30) {
        return { ...s, courses: [...s.courses, { id: Date.now().toString(), name: '', credits: 3, grade: '', weight: 'Regular' }] };
      }
      return s;
    }));
  };

  const removeCourseFromSemester = (semId: string, courseId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId && s.courses.length > 1) {
        return { ...s, courses: s.courses.filter(c => c.id !== courseId) };
      }
      return s;
    }));
  };

  const updateCourseInSemester = (semId: string, courseId: string, field: keyof Course, value: any) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return { ...s, courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c) };
      }
      return s;
    }));
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    try {
      if (mode === 'semester') {
        const validCourses = semesterCourses.filter(c => c.grade !== '');
        if (validCourses.length === 0) throw new Error('Please enter at least one course with a grade.');
        if (validCourses.some(c => c.credits <= 0)) throw new Error('Credits must be greater than 0.');
        
        const res = calculateSemesterGPA(validCourses, scale);
        setResult(res);
      } 
      else if (mode === 'cumulative') {
        // Validate
        let hasValidEntry = false;
        for (const sem of semesters) {
          if (sem.isQuickEntry) {
            if (sem.quickGpa !== undefined && sem.quickCredits !== undefined && sem.quickCredits > 0) {
              hasValidEntry = true;
            }
          } else {
            const validCourses = sem.courses.filter(c => c.grade !== '');
            if (validCourses.length > 0) {
              if (validCourses.some(c => c.credits <= 0)) throw new Error(`Credits must be greater than 0 in ${sem.name || 'a semester'}.`);
              hasValidEntry = true;
            }
          }
        }

        if (!hasValidEntry) throw new Error('Please enter at least one valid course or quick entry semester.');

        const res = calculateCumulativeGPA(semesters, scale);
        setResult(res);
      }
      else if (mode === 'target') {
        if (targetCurrentGpa === '' || targetCurrentCredits === '' || targetGoalGpa === '' || targetPlannedCredits === '') {
          throw new Error('Please fill in all fields.');
        }
        const maxScale = scale === '4.0' ? 4.0 : 4.3;
        if (targetCurrentGpa < 0 || targetCurrentGpa > maxScale) throw new Error(`Current GPA must be between 0 and ${maxScale}.`);
        if (targetGoalGpa < 0 || targetGoalGpa > maxScale) throw new Error(`Target GPA must be between 0 and ${maxScale}.`);
        if (targetCurrentCredits < 0 || targetPlannedCredits <= 0) throw new Error('Credits must be positive.');

        const res = calculateTargetGPA(
          Number(targetCurrentGpa), 
          Number(targetCurrentCredits), 
          Number(targetGoalGpa), 
          Number(targetPlannedCredits),
          scale
        );
        setResult(res);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderCourseTable = (courses: Course[], onUpdate: (id: string, field: keyof Course, val: any) => void, onRemove: (id: string) => void, canRemove: boolean) => (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-4">Course Name</div>
        <div className="col-span-2">Credits</div>
        <div className="col-span-2">Grade</div>
        <div className="col-span-3">Course Type</div>
        <div className="col-span-1"></div>
      </div>

      {courses.map((course, index) => (
        <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-0 bg-slate-50 md:bg-transparent dark:bg-slate-900/50 md:dark:bg-transparent rounded-xl border border-outline-variant/50 md:border-none dark:border-slate-700 items-center">
          <div className="md:col-span-4">
            <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Course Name</label>
            <input 
              type="text" 
              value={course.name} 
              onChange={(e) => onUpdate(course.id, 'name', e.target.value)} 
              placeholder={`e.g. Math 101`}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-12 md:col-span-8 gap-3 items-end md:items-center">
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Credits</label>
              <input 
                type="number" 
                min="0.5" 
                max="6"
                step="0.5"
                value={course.credits} 
                onChange={(e) => onUpdate(course.id, 'credits', Number(e.target.value))} 
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Grade</label>
              <select 
                value={course.grade} 
                onChange={(e) => onUpdate(course.id, 'grade', e.target.value as Grade)} 
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="">--</option>
                {Object.keys(GRADE_POINTS_4_0).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 md:col-span-5">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
              <select 
                value={course.weight} 
                onChange={(e) => onUpdate(course.id, 'weight', e.target.value as CourseWeight)} 
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Regular">Regular</option>
                <option value="Honors">Honors</option>
                <option value="AP">AP (Advanced Placement)</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="Dual Enrollment">Dual Enrollment</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
              {canRemove && (
                <button 
                  onClick={() => onRemove(course.id)} 
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent dark:bg-slate-800 md:dark:bg-transparent rounded-lg border border-outline-variant/50 md:border-none dark:border-slate-700"
                  title="Remove Course"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-secondary" />
          GPA Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate your semester GPA, cumulative GPA, or find out what grades you need to reach your target GPA. Supports standard and weighted scales.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl dark:rounded-xl shadow-xl border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-outline-variant/50 dark:border-slate-700 scrollbar-hide">
          {[
            { id: 'semester', label: 'Semester GPA' },
            { id: 'cumulative', label: 'Cumulative GPA' },
            { id: 'target', label: 'Target GPA' },
            { id: 'reference', label: 'GPA Reference' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id as Mode);
                if (tab.id === 'reference') setResult(null); // Clear result to show reference panel
              }}
              className={`flex-1 min-w-[140px] py-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-[1px] ${
                mode === tab.id
                  ? 'bg-primary text-background shadow-md'
                  : 'bg-surface-container text-primary/50 hover:text-secondary hover:bg-secondary/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Scale Selector (Hidden on Reference tab) */}
        {mode !== 'reference' && (
          <div className="px-6 md:px-8 pt-6 pb-2 flex items-center justify-end gap-3">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">GPA Scale:</span>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-outline-variant/50 dark:border-slate-700">
              <button
                onClick={() => setScale('4.0')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${scale === '4.0' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                4.0 Scale
              </button>
              <button
                onClick={() => setScale('4.3')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${scale === '4.3' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                4.3 Scale
              </button>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-8">
          
          {/* SEMESTER GPA */}
          {mode === 'semester' && (
            <div className="space-y-6">
              {renderCourseTable(semesterCourses, updateSemesterCourse, removeSemesterCourse, semesterCourses.length > 1)}
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={addSemesterCourse} 
                  disabled={semesterCourses.length >= 30}
                  className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-secondary bg-indigo-50 dark:bg-secondary/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Add Course
                </button>
                <button 
                  onClick={clearSemesterCourses} 
                  className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* CUMULATIVE GPA */}
          {mode === 'cumulative' && (
            <div className="space-y-6">
              {semesters.map((sem, i) => (
                <div key={sem.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors"
                    onClick={() => toggleSemesterExpand(sem.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {expandedSemesters[sem.id] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                      <input 
                        type="text" 
                        value={sem.name}
                        onChange={(e) => updateSemester(sem.id, 'name', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={`Semester ${i + 1}`}
                        className="font-bold text-slate-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-48"
                      />
                      {!expandedSemesters[sem.id] && (
                        <span className="text-sm text-slate-500">
                          {sem.isQuickEntry ? `${sem.quickCredits || 0} credits` : `${sem.courses.length} courses`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 mr-4" onClick={e => e.stopPropagation()}>
                        <span className="text-xs font-bold text-slate-500">Quick Entry</span>
                        <button
                          onClick={() => updateSemester(sem.id, 'isQuickEntry', !sem.isQuickEntry)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${sem.isQuickEntry ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${sem.isQuickEntry ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      {semesters.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeSemester(sem.id); }}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedSemesters[sem.id] && (
                    <div className="p-6 border-t border-outline-variant/50 dark:border-slate-700">
                      {sem.isQuickEntry ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Semester GPA</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              max={scale === '4.0' ? 5.0 : 5.3}
                              value={sem.quickGpa ?? ''} 
                              onChange={(e) => updateSemester(sem.id, 'quickGpa', e.target.value === '' ? undefined : Number(e.target.value))} 
                              placeholder="e.g. 3.5"
                              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Total Credits</label>
                            <input 
                              type="number" 
                              min="0"
                              value={sem.quickCredits ?? ''} 
                              onChange={(e) => updateSemester(sem.id, 'quickCredits', e.target.value === '' ? undefined : Number(e.target.value))} 
                              placeholder="e.g. 15"
                              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {renderCourseTable(
                            sem.courses, 
                            (cId, field, val) => updateCourseInSemester(sem.id, cId, field, val),
                            (cId) => removeCourseFromSemester(sem.id, cId),
                            sem.courses.length > 1
                          )}
                          <button 
                            onClick={() => addCourseToSemester(sem.id)} 
                            disabled={sem.courses.length >= 30}
                            className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-secondary bg-indigo-50 dark:bg-secondary/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" /> Add Course
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <button 
                onClick={addSemester} 
                disabled={semesters.length >= 12}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-indigo-600 dark:hover:text-secondary hover:border-indigo-300 dark:hover:border-secondary hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-slate-300"
              >
                <Plus className="w-5 h-5" /> Add Semester
              </button>
            </div>
          )}

          {/* TARGET GPA */}
          {mode === 'target' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-500" /> Current Status
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Current Cumulative GPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max={scale === '4.0' ? 4.0 : 4.3}
                      value={targetCurrentGpa} 
                      onChange={(e) => setTargetCurrentGpa(e.target.value === '' ? '' : Number(e.target.value))} 
                      placeholder="e.g. 3.2"
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Credits Completed So Far</label>
                    <input 
                      type="number" 
                      min="0"
                      value={targetCurrentCredits} 
                      onChange={(e) => setTargetCurrentCredits(e.target.value === '' ? '' : Number(e.target.value))} 
                      placeholder="e.g. 60"
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>

                <div className="p-6 bg-indigo-50 dark:bg-secondary/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 space-y-4">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" /> Your Goal
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">Target Cumulative GPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max={scale === '4.0' ? 4.0 : 4.3}
                      value={targetGoalGpa} 
                      onChange={(e) => setTargetGoalGpa(e.target.value === '' ? '' : Number(e.target.value))} 
                      placeholder="e.g. 3.5"
                      className="w-full p-3 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">Credits Remaining / Planned</label>
                    <input 
                      type="number" 
                      min="1"
                      value={targetPlannedCredits} 
                      onChange={(e) => setTargetPlannedCredits(e.target.value === '' ? '' : Number(e.target.value))} 
                      placeholder="e.g. 30"
                      className="w-full p-3 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">
              {error}
            </div>
          )}

          {mode !== 'reference' && (
            <div className="pt-4">
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Calculator className="w-6 h-6" /> Calculate GPA
              </button>
            </div>
          )}
        </div>
      </div>

      {(result || mode === 'reference') && <Results mode={mode} result={result} scale={scale} />}
    </div>
  );
}

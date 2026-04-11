import React from 'react';
import { SemesterResult, CumulativeResult, TargetResult, getPercentageEquivalent, getAcademicStanding, GpaScale, GRADE_REFERENCE } from './utils';
import { Target, AlertTriangle, CheckCircle2, Award, TrendingUp, BookOpen } from 'lucide-react';

interface ResultsProps {
  mode: 'semester' | 'cumulative' | 'target' | 'reference';
  result?: SemesterResult | CumulativeResult | TargetResult;
  scale?: GpaScale;
}

export default function Results({ mode, result, scale = '4.0' }: ResultsProps) {
  if (mode === 'reference') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> GPA Conversion Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-6 font-bold">Letter</th>
                  <th className="py-3 px-6 font-bold">4.0 Scale</th>
                  <th className="py-3 px-6 font-bold">4.3 Scale</th>
                  <th className="py-3 px-6 font-bold">Percentage</th>
                  <th className="py-3 px-6 font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {GRADE_REFERENCE.map(r => (
                  <tr key={r.letter} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-6 font-black text-indigo-600 dark:text-indigo-400">{r.letter}</td>
                    <td className="py-3 px-6 font-mono font-bold text-slate-900 dark:text-white">{r.p40.toFixed(1)}</td>
                    <td className="py-3 px-6 font-mono font-bold text-slate-900 dark:text-white">{r.p43.toFixed(1)}</td>
                    <td className="py-3 px-6 text-slate-600 dark:text-slate-400">{r.pct}</td>
                    <td className="py-3 px-6 text-slate-600 dark:text-slate-400">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weighted GPA Scale</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Bonus points added to the standard grade point value:</p>
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Regular</span>
                  <span className="font-mono font-bold text-slate-500">+0.0</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Honors / Dual Enrollment</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">+0.5</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">AP / IB</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+1.0</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">Note: Weighted grade points are typically capped at 5.0 (on a 4.0 scale) or 5.3 (on a 4.3 scale).</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Standing</h3>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">4.0</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Perfect / Valedictorian</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">3.9+</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Summa Cum Laude</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">3.7+</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Magna Cum Laude</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">3.5+</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Cum Laude / Dean's List</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">3.0+</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Good Academic Standing</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">2.0+</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Satisfactory / Min for graduation</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">Below 2.0</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Academic Probation Risk</span>
                </li>
              </ul>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
                <p className="text-xs text-slate-500 italic">Thresholds vary significantly by institution. Always verify with your school's official academic policies.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  if (mode === 'target') {
    const res = result as TargetResult;
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className={`p-8 text-center border-b ${
            res.status === 'achieved' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50' :
            res.status === 'impossible' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50' :
            'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50'
          }`}>
            <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${
              res.status === 'achieved' ? 'text-emerald-600 dark:text-emerald-400' :
              res.status === 'impossible' ? 'text-red-600 dark:text-red-400' :
              'text-indigo-600 dark:text-indigo-400'
            }`}>
              Required GPA for Remaining Credits
            </p>
            <div className={`text-5xl md:text-6xl font-black tracking-tight mb-2 ${
              res.status === 'achieved' ? 'text-emerald-600 dark:text-emerald-400' :
              res.status === 'impossible' ? 'text-red-600 dark:text-red-400' :
              'text-slate-900 dark:text-white'
            }`}>
              {res.status === 'achieved' ? 'Achieved!' : res.status === 'impossible' ? 'N/A' : res.requiredGpa.toFixed(2)}
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center gap-2">
              Difficulty Level: <span className={`font-bold px-2 py-1 rounded text-xs uppercase ${
                res.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                res.difficulty === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                res.difficulty === 'Challenging' ? 'bg-amber-100 text-amber-700' :
                res.difficulty === 'Very Challenging' ? 'bg-orange-100 text-orange-700' :
                res.difficulty === 'Already Achieved' ? 'bg-emerald-100 text-emerald-700' :
                'bg-red-100 text-red-700'
              }`}>{res.difficulty}</span>
            </p>
          </div>

          {res.status === 'impossible' && (
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-300">Target is not achievable</h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Your target GPA is not achievable with the remaining credits even with straight A+s. You need to take more credits or lower your target.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-700">
            <div className="p-6 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Current GPA</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.currentGpa.toFixed(2)}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Target GPA</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.targetGpa.toFixed(2)}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Credits Completed</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.creditsCompleted}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Credits Remaining</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.creditsRemaining}</p>
            </div>
            <div className="p-6 text-center col-span-2 md:col-span-1 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total at Completion</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.creditsCompleted + res.creditsRemaining}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">What-If Scenarios</h3>
            <p className="text-sm text-slate-500">What your cumulative GPA will be based on your performance in the remaining {res.creditsRemaining} credits.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-6 font-bold">GPA in Remaining Credits</th>
                  <th className="py-3 px-6 font-bold">Resulting Cumulative GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {res.whatIfs.map((wi, i) => {
                  const isTarget = Math.abs(wi.gpa - res.requiredGpa) < 0.01;
                  return (
                    <tr key={i} className={isTarget ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'}>
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        {wi.gpa.toFixed(2)}
                        {wi.gpa === 4.0 && <span className="text-xs text-slate-500">(All A's)</span>}
                        {wi.gpa === 3.0 && <span className="text-xs text-slate-500">(All B's)</span>}
                        {wi.gpa === 2.0 && <span className="text-xs text-slate-500">(All C's)</span>}
                        {isTarget && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300 text-xs font-bold rounded uppercase">Required</span>}
                      </td>
                      <td className={`py-4 px-6 font-mono font-bold ${isTarget ? 'text-indigo-600 dark:text-indigo-400 text-lg' : 'text-slate-900 dark:text-white'}`}>
                        {wi.result.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const isCumulative = mode === 'cumulative';
  const res = result as (SemesterResult | CumulativeResult);
  
  const unweightedGpa = res.unweightedGpa;
  const weightedGpa = res.weightedGpa;
  const hasWeighted = res.weightedCourseCount > 0;
  const maxScale = scale === '4.0' ? 4.0 : 4.3;
  const maxWeightedScale = scale === '4.0' ? 5.0 : 5.3;

  const standing = getAcademicStanding(unweightedGpa);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Academic Standing Badge */}
      <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 ${standing.color}`}>
        <Award className="w-6 h-6" />
        <span className="font-bold text-lg">{standing.label}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard GPA Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="p-6 text-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Unweighted GPA</p>
            <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {unweightedGpa.toFixed(2)} <span className="text-2xl text-slate-400 font-medium">/ {maxScale.toFixed(1)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700 flex-1">
            <div className="p-4 text-center flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Letter Equivalent</p>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{getPercentageEquivalent(unweightedGpa, scale) !== 'N/A' ? GRADE_REFERENCE.find(r => r.pct === getPercentageEquivalent(unweightedGpa, scale))?.letter || '-' : '-'}</p>
            </div>
            <div className="p-4 text-center flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Percentage</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{getPercentageEquivalent(unweightedGpa, scale)}</p>
            </div>
            <div className="p-4 text-center border-t border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Total Credits</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.totalCredits}</p>
            </div>
            <div className="p-4 text-center border-t border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Grade Points</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{res.totalUnweightedPoints.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Weighted GPA Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="p-6 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Weighted GPA</p>
            <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {weightedGpa.toFixed(2)} <span className="text-2xl text-slate-400 font-medium">/ {maxWeightedScale.toFixed(1)}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-700 flex-1">
            <div className="p-6 text-center flex flex-col justify-center items-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Honors/AP Courses</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {res.weightedCourseCount} <span className="text-sm font-medium text-slate-500">courses with weight bonuses</span>
              </p>
            </div>
            <div className="p-6 text-center flex flex-col justify-center items-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Boost from Weighting</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                +{(weightedGpa - unweightedGpa).toFixed(2)} <span className="text-sm font-medium text-slate-500">points</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Breakdown (Semester Mode) */}
      {!isCumulative && (res as SemesterResult).courses.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-6 font-bold">Course</th>
                  <th className="py-3 px-6 font-bold">Credits</th>
                  <th className="py-3 px-6 font-bold">Grade</th>
                  <th className="py-3 px-6 font-bold">Grade Points</th>
                  <th className="py-3 px-6 font-bold">Weighted Points</th>
                  <th className="py-3 px-6 font-bold text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(res as SemesterResult).courses.map((course, i) => (
                  <tr key={course.id} className="bg-white dark:bg-slate-800">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                      {course.name || `Course ${i + 1}`}
                      {course.weight !== 'Regular' && (
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {course.weight}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{course.credits}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{course.grade}</td>
                    <td className="py-4 px-6 font-mono text-slate-600 dark:text-slate-400">{course.unweightedPoints.toFixed(2)}</td>
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{course.weightedPoints.toFixed(2)}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white text-right">{course.contribution.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white">
                <tr>
                  <td className="py-4 px-6 text-right">Totals:</td>
                  <td className="py-4 px-6">{res.totalCredits}</td>
                  <td colSpan={3}></td>
                  <td className="py-4 px-6 text-right">{res.totalWeightedPoints.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Cumulative Breakdown (Cumulative Mode) */}
      {isCumulative && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Cumulative Semester Breakdown
            </h3>
          </div>
          
          {/* CSS Chart */}
          <div className="p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="relative h-48 w-full flex items-end justify-between pt-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-slate-400 font-mono">
                <span>{maxWeightedScale.toFixed(1)}</span>
                <span>{(maxWeightedScale * 0.75).toFixed(1)}</span>
                <span>{(maxWeightedScale * 0.5).toFixed(1)}</span>
                <span>{(maxWeightedScale * 0.25).toFixed(1)}</span>
                <span>0.0</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-100 dark:border-slate-700/50" />
                ))}
              </div>

              {/* Cumulative Reference Line */}
              <div 
                className="absolute left-8 right-0 border-t-2 border-dashed border-indigo-500/50 z-0"
                style={{ bottom: `${(weightedGpa / maxWeightedScale) * 100}%` }}
              >
                <span className="absolute -top-6 right-0 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-1">
                  Overall: {weightedGpa.toFixed(2)}
                </span>
              </div>

              {/* Bars */}
              <div className="absolute left-8 right-0 top-0 bottom-0 flex items-end justify-around z-10 px-4">
                {(res as CumulativeResult).semesters.map((sem, i) => {
                  const heightPct = (sem.weightedGpa / maxWeightedScale) * 100;
                  return (
                    <div key={i} className="relative flex flex-col items-center group w-full max-w-[40px]">
                      <div 
                        className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all rounded-t-sm"
                        style={{ height: `${heightPct}%` }}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded whitespace-nowrap pointer-events-none transition-opacity z-20">
                          {sem.weightedGpa.toFixed(2)}
                        </div>
                      </div>
                      <div className="absolute -bottom-6 text-[10px] text-slate-500 font-medium truncate w-16 text-center">
                        {sem.name || `Sem ${i+1}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-8 text-center text-xs text-slate-500">Semester Progression</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3 px-6 font-bold">Semester</th>
                  <th className="py-3 px-6 font-bold">Credits</th>
                  <th className="py-3 px-6 font-bold">Semester GPA</th>
                  <th className="py-3 px-6 font-bold">Cumulative GPA After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(res as CumulativeResult).semesters.map((sem, i) => (
                  <tr key={sem.id} className="bg-white dark:bg-slate-800">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                      {sem.name || `Semester ${i + 1}`}
                      {sem.courses.length === 0 && <span className="ml-2 text-[10px] text-slate-400 uppercase">(Quick Entry)</span>}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{sem.totalCredits}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">{sem.weightedGpa.toFixed(2)}</td>
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">{sem.cumulativeGpaAfter?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-900/50 font-bold text-slate-900 dark:text-white">
                <tr>
                  <td className="py-4 px-6 text-right">Overall:</td>
                  <td className="py-4 px-6">{res.totalCredits}</td>
                  <td className="py-4 px-6"></td>
                  <td className="py-4 px-6 font-mono text-indigo-600 dark:text-indigo-400 text-lg">{weightedGpa.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}


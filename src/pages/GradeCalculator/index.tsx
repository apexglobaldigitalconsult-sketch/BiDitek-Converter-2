import React, { useState } from 'react';
import { DEFAULT_SCALE, GradeScale } from './utils';
import { WeightedMode, GPAMode, FinalExamMode, AverageMode } from './modes';
import { GraduationCap, Settings } from 'lucide-react';

export default function GradeCalculator() {
  const [activeTab, setActiveTab] = useState('weighted');
  const [scale, setScale] = useState<GradeScale[]>(DEFAULT_SCALE);
  const [showScale, setShowScale] = useState(false);

  const tabs = [
    { id: 'weighted', label: 'Weighted Grade' },
    { id: 'gpa', label: 'GPA Calculator' },
    { id: 'final', label: 'Final Exam' },
    { id: 'average', label: 'Average Calculator' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
          <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          Grade Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate your weighted grades, GPA, final exam requirements, or assignment averages.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scale Editor Toggle */}
        {activeTab !== 'gpa' && (
          <div className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setShowScale(!showScale)}
              className="w-full px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {showScale ? 'Hide Grading Scale' : 'Customize Grading Scale'}
            </button>
            
            {showScale && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {scale.map((item, i) => (
                    <div key={item.letter} className="flex items-center gap-2">
                      <span className="font-bold w-8 text-slate-700 dark:text-slate-300">{item.letter}</span>
                      <input
                        type="number"
                        value={item.min}
                        onChange={(e) => {
                          const newScale = [...scale];
                          newScale[i].min = Number(e.target.value);
                          setScale(newScale);
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-500">%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => setScale(DEFAULT_SCALE)} 
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6 md:p-8">
          {activeTab === 'weighted' && <WeightedMode scale={scale} />}
          {activeTab === 'gpa' && <GPAMode />}
          {activeTab === 'final' && <FinalExamMode scale={scale} />}
          {activeTab === 'average' && <AverageMode scale={scale} />}
        </div>
      </div>
    </div>
  );
}

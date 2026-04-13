import React from 'react';
import { TriangleData, DerivedProperties, TriangleClassification, formatVal } from './utils';

interface ResultDisplayProps {
  key?: React.Key;
  solutionNum?: number;
  triangle: TriangleData;
  derived: DerivedProperties;
  classification: TriangleClassification;
  isDeg: boolean;
  steps: React.ReactNode;
  diagram: React.ReactNode;
}

export default function ResultDisplay({ solutionNum, triangle, derived, classification, isDeg, steps, diagram }: ResultDisplayProps) {
  const [showSteps, setShowSteps] = React.useState(true);

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
      {solutionNum && (
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-secondary border-b border-outline-variant/50 dark:border-slate-700 pb-4">
          Solution {solutionNum}
        </h2>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties Table */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Triangle Properties</h3>
          
          <div className="flex gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
              classification.byAngle === 'Equiangular' ? 'bg-purple-500' :
              classification.byAngle === 'Right' ? 'bg-blue-500' :
              classification.byAngle === 'Obtuse' ? 'bg-orange-500' : 'bg-green-500'
            }`}>
              {classification.byAngle}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
              classification.bySide === 'Equilateral' ? 'bg-purple-500' :
              classification.bySide === 'Isosceles' ? 'bg-teal-500' : 'bg-slate-500'
            }`}>
              {classification.bySide}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Side a</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.a)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Side b</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.b)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Side c</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.c)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Angle A</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.A, true, isDeg)}{isDeg ? '°' : ' rad'}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Angle B</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.B, true, isDeg)}{isDeg ? '°' : ' rad'}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Angle C</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(triangle.C, true, isDeg)}{isDeg ? '°' : ' rad'}</td>
                </tr>
                <tr className="bg-indigo-50 dark:bg-secondary/20">
                  <td className="py-2 px-2 font-bold text-indigo-900 dark:text-indigo-100 rounded-l-lg">Perimeter</td>
                  <td className="py-2 px-2 font-bold text-indigo-700 dark:text-indigo-300 rounded-r-lg">{formatVal(derived.perimeter)}</td>
                </tr>
                <tr className="bg-indigo-50 dark:bg-secondary/20">
                  <td className="py-2 px-2 font-bold text-indigo-900 dark:text-indigo-100 rounded-l-lg">Area</td>
                  <td className="py-2 px-2 font-bold text-indigo-700 dark:text-indigo-300 rounded-r-lg">{formatVal(derived.area)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Altitude h_a</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.h_a)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Altitude h_b</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.h_b)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Altitude h_c</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.h_c)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Inradius (r)</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.r)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Circumradius (R)</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.R)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Median m_a</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.m_a)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Median m_b</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.m_b)}</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-2 font-medium text-slate-700 dark:text-slate-300">Median m_c</td>
                  <td className="py-2 text-slate-900 dark:text-white">{formatVal(derived.m_c)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagram & Steps */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Visual Diagram</h3>
            {diagram}
          </div>

          <div className="border border-outline-variant/50 dark:border-slate-700 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowSteps(!showSteps)} 
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="font-semibold text-slate-900 dark:text-white">Step-by-Step Solution</span>
              <span className="text-slate-500">{showSteps ? 'Hide' : 'Show'}</span>
            </button>
            {showSteps && (
              <div className="p-6 bg-white dark:bg-slate-900">
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  {steps}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

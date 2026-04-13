import React from 'react';
import { Image as ImageIcon, FileText, File as FileIcon, HeartPulse, Wallet, Cake, Repeat, Ruler, DollarSign, Divide, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import ScientificCalculator from '../components/ScientificCalculator';

const popularTools = [
  {
    team: '',
    title: 'Image Converter',
    salary: '',
    desc: 'Convert between JPG, PNG, WebP and more',
    icon: ImageIcon,
    iconColor: 'bg-blue-600',
    tag: 'POPULAR',
    location: ''
  },
  {
    team: '',
    title: 'File Converter',
    salary: '',
    desc: 'Transform any file format instantly',
    icon: FileIcon,
    iconColor: 'bg-orange-500',
    tag: 'POPULAR',
    location: ''
  },
  {
    team: '',
    title: 'PDF Converter',
    salary: '',
    desc: 'PDF to Word, Excel, and more',
    icon: FileText,
    iconColor: 'bg-pink-500',
    tag: '',
    location: ''
  },
  {
    team: '',
    title: 'BMI Calculator',
    salary: '',
    desc: 'Check your body mass index',
    icon: HeartPulse,
    iconColor: 'bg-green-500',
    tag: 'POPULAR',
    location: ''
  },
  {
    team: '',
    title: 'Loan Calculator',
    salary: '',
    desc: 'Calculate monthly payments and interest',
    icon: Wallet,
    iconColor: 'bg-teal-400',
    tag: '',
    location: ''
  },
  {
    team: '',
    title: 'Age Calculator',
    salary: '',
    desc: 'Find out your exact age in years, months, days',
    icon: Cake,
    iconColor: 'bg-green-500',
    tag: '',
    location: ''
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-24 max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-[5%] pt-4 pb-8">
        <div className="w-full lg:w-[30%] space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#ef6c02] font-['Jost',sans-serif]">
            All-in-One Converter & Calculator
          </h1>
          <p className="text-lg text-primary/70 leading-relaxed">
            Fast, simple tools that work directly in your browser. No ads, no tracking, just pure utility.
          </p>
        </div>
        <div className="w-full lg:w-[65%]">
          <ScientificCalculator />
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="pt-2">
        <h2 className="text-2xl font-bold text-primary mb-6">Popular Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool, idx) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-surface-container-low p-6 rounded-[1px] shadow-sm dark:shadow-md border border-outline-variant/30 dark:border-outline-variant hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                {tool.team && <p className="text-xs font-medium text-primary/40 mb-1">{tool.team}</p>}
                <h3 className="text-lg font-bold text-primary">{tool.title}</h3>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm dark:bg-surface-container-high dark:text-gray-300 dark:shadow-none", tool.iconColor)}>
                <tool.icon className="w-6 h-6" />
              </div>
            </div>
            
            {tool.salary && <p className="text-sm font-medium text-secondary mb-4">{tool.salary}</p>}
            
            <p className="text-sm text-primary/50 leading-relaxed mb-8 flex-1">
              {tool.desc}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              {tool.tag ? (
                <span className="px-4 py-1.5 bg-secondary text-white text-xs font-bold rounded-full">
                  {tool.tag}
                </span>
              ) : <div />}
              {tool.location && (
                <span className="text-sm font-medium text-primary/60">
                  {tool.location}
                </span>
              )}
            </div>
          </motion.div>
        ))}
        </div>
      </section>
    </div>
  );
}

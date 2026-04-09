import React from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal, Image as ImageIcon, FileText, File as FileIcon, HeartPulse, Wallet, Cake, List, Grid, Repeat, Ruler, DollarSign, Divide, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const popularTools = [
  {
    team: 'Media Tools',
    title: 'Image Converter',
    salary: 'Free • No Limits',
    desc: 'Convert between JPG, PNG, WebP and more formats instantly without losing quality.',
    icon: ImageIcon,
    iconColor: 'bg-blue-600',
    tag: 'POPULAR',
    location: 'Browser, Online'
  },
  {
    team: 'Document Tools',
    title: 'File Converter',
    salary: 'Free • Fast',
    desc: 'Transform any file format instantly right in your browser. Secure and private.',
    icon: FileIcon,
    iconColor: 'bg-orange-500',
    tag: 'NEW',
    location: 'Browser, Online'
  },
  {
    team: 'Document Tools',
    title: 'PDF Converter',
    salary: 'Free • Secure',
    desc: 'Convert PDF to Word, Excel, and more. Merge, split, and compress PDF files easily.',
    icon: FileText,
    iconColor: 'bg-pink-500',
    tag: 'TOOL',
    location: 'Browser, Online'
  },
  {
    team: 'Health & Fitness',
    title: 'BMI Calculator',
    salary: 'Free • Instant',
    desc: 'Check your body mass index and get personalized health recommendations.',
    icon: HeartPulse,
    iconColor: 'bg-green-500',
    tag: 'HEALTH',
    location: 'Browser, Online'
  },
  {
    team: 'Financial Tools',
    title: 'Loan Calculator',
    salary: 'Free • Accurate',
    desc: 'Calculate monthly payments, interest rates, and amortization schedules easily.',
    icon: Wallet,
    iconColor: 'bg-teal-400',
    tag: 'FINANCE',
    location: 'Browser, Online'
  },
  {
    team: 'Utility Tools',
    title: 'Age Calculator',
    salary: 'Free • Precise',
    desc: 'Find out your exact age in years, months, days, hours, and even seconds.',
    icon: Cake,
    iconColor: 'bg-green-500',
    tag: 'UTILITY',
    location: 'Browser, Online'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8 pb-24 max-w-[1400px] mx-auto">
      {/* Search Section */}
      <section className="w-full">
        <div className="bg-surface-container-low rounded-full p-2 flex items-center shadow-sm border border-outline-variant/50">
          <button className="flex items-center gap-2 px-6 py-3 text-primary/70 hover:text-primary transition-colors border-r border-outline-variant/50">
            <MapPin className="w-5 h-5 text-secondary" />
            <span className="font-medium text-sm">All Categories</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          
          <div className="flex-1 flex items-center px-6">
            <input 
              type="text" 
              placeholder="Search by Title, Category or any tool keyword..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-body placeholder:text-primary/40 text-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pr-2">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-background text-primary/70 font-medium text-sm hover:bg-outline-variant/50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              FILTER
            </button>
            <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-secondary text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md">
              <Search className="w-4 h-4" />
              FIND
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex items-center gap-4 mt-6 px-2">
          <span className="text-sm text-primary/40 font-medium">Suggestions</span>
          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium hover:bg-secondary hover:text-white transition-colors">
              Your Favorites
            </button>
            <button className="px-5 py-2 rounded-full bg-secondary text-white text-sm font-medium shadow-md">
              Converters
            </button>
            <button className="px-5 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium hover:bg-secondary hover:text-white transition-colors">
              Calculators
            </button>
            <button className="px-5 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium hover:bg-secondary hover:text-white transition-colors">
              Financial
            </button>
            <button className="px-5 py-2 rounded-full bg-secondary-container text-secondary text-sm font-medium hover:bg-secondary hover:text-white transition-colors">
              Health
            </button>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className="flex items-center justify-between pt-4">
        <div>
          <h2 className="text-lg font-bold text-primary">Showing 246 Tools Results</h2>
          <p className="text-sm text-primary/40">Based your preferences</p>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
              </div>
              <span className="text-sm font-medium text-primary/70">Free</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              </div>
              <span className="text-sm font-medium text-primary">Pro</span>
            </label>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary/70">Details</span>
              <div className="w-10 h-5 bg-outline-variant rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary/70">Advanced</span>
              <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/50 text-sm font-medium text-primary/70">
              <List className="w-4 h-4" />
              Newest
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            <div className="flex bg-surface-container-low rounded-full p-1 border border-outline-variant/50">
              <button className="p-2 rounded-full text-primary/40 hover:text-primary">
                <List className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full bg-secondary text-white shadow-sm">
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {popularTools.map((tool, idx) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-surface-container-low p-6 rounded-3xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-medium text-primary/40 mb-1">{tool.team}</p>
                <h3 className="text-lg font-bold text-primary">{tool.title}</h3>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm", tool.iconColor)}>
                <tool.icon className="w-6 h-6" />
              </div>
            </div>
            
            <p className="text-sm font-medium text-secondary mb-4">{tool.salary}</p>
            
            <p className="text-sm text-primary/50 leading-relaxed mb-8 flex-1">
              {tool.desc}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="px-4 py-1.5 bg-secondary-container text-secondary text-xs font-bold rounded-full">
                {tool.tag}
              </span>
              <span className="text-sm font-medium text-primary/60">
                {tool.location}
              </span>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

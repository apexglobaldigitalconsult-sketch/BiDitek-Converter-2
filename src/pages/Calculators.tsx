import React from 'react';
import { ArrowRight, Calculator, Percent, Dice5, Home, TrendingUp, Banknote, Scale, Flame, Globe, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const calculatorGroups = [
  {
    title: 'Financial Calculators',
    subtitle: 'Capital & Investment',
    color: 'border-secondary',
    items: [
      { title: 'Mortgage Calculator', desc: 'Plan your home purchase with detailed amortization schedules.', emoji: '🏠' },
      { title: 'Loan Calculator', desc: 'Calculate monthly payments and interest for any loan.', emoji: '💸' },
      { title: 'Auto Loan Calculator', desc: 'Estimate monthly car payments and total interest.', emoji: '🚗' },
      { title: 'Interest Calculator', desc: 'Calculate simple or compound interest on savings.', emoji: '💰' },
      { title: 'Compound Interest', desc: 'Visualize long-term wealth growth and investment forecasting.', emoji: '📈', path: '/calculators/compound-interest' },
      { title: 'Salary Calculator', desc: 'Calculate take-home pay based on regional tax regulations.', emoji: '💼' },
    ]
  },
  {
    title: 'Fitness & Health Calculators',
    subtitle: 'Biometric Analysis',
    color: 'border-orange-600',
    items: [
      { title: 'BMI Calculator', desc: 'Determine Body Mass Index and healthy weight ranges.', emoji: '⚖️', path: '/calculators/bmi' },
      { title: 'Calorie Calculator', desc: 'Estimate daily energy expenditure for weight management.', emoji: '🔥' },
      { title: 'Body Fat Calculator', desc: 'Calculate body fat percentage based on measurements.', emoji: '📏' },
      { title: 'BMR Calculator', desc: 'Find your Basal Metabolic Rate for calorie planning.', emoji: '⚡' },
      { title: 'Ideal Weight', desc: 'Find your recommended weight based on height and frame.', emoji: '🌟' },
    ]
  },
  {
    title: 'Math Calculators',
    subtitle: 'Foundational Computation',
    color: 'border-blue-600',
    items: [
      { title: 'Scientific Calculator', desc: 'Advanced functions for complex mathematical operations.', emoji: '🧮' },
      { title: 'Fraction Calculator', desc: 'Perform operations with fractions and mixed numbers.', emoji: '➗' },
      { title: 'Percentage Calculator', desc: 'Instantly calculate increases, decreases, and differences.', emoji: '📉' },
      { title: 'Random Number', desc: 'Generate random numbers within a specified range.', emoji: '🎲' },
    ]
  },
  {
    title: 'Other Calculators',
    subtitle: 'General Utility',
    color: 'border-primary',
    items: [
      { title: 'Age Calculator', desc: 'Find out your exact age in years, months, and days.', emoji: '🎂' },
      { title: 'Date Calculator', desc: 'Calculate the duration between two specific dates.', emoji: '📅' },
      { title: 'GPA Calculator', desc: 'Calculate your Grade Point Average for school or college.', emoji: '🎓' },
      { title: 'Subnet Calculator', desc: 'IPv4/IPv6 subnetting and mask generation tool.', emoji: '🌐' },
    ]
  }
];

export default function Calculators() {
  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      <header className="mb-24 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl lg:text-5xl font-headline font-semibold text-primary mb-8 tracking-tighter leading-[1.1]"
        >
          Precision <br /><span className="text-secondary">Calculators.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-primary/50 font-body max-w-2xl leading-relaxed"
        >
          A curated collection of professional-grade tools for financial modeling, health metrics, and technical engineering. Engineered for clarity.
        </motion.p>
      </header>

      <div className="space-y-32">
        {calculatorGroups.map((group, gIdx) => (
          <section key={group.title}>
            <div className={cn("border-l-4 pl-8 mb-12", group.color)}>
              <h2 className="text-3xl lg:text-4xl font-headline font-bold text-primary tracking-tight">{group.title}</h2>
              <p className="font-label text-xs text-primary/40 uppercase tracking-[0.3em] font-black mt-2">{group.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {group.items.map((item, iIdx) => {
                const CardWrapper = item.path ? Link : 'div';
                return (
                  <CardWrapper
                    key={item.title}
                    to={item.path || '#'}
                    className="group bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 hover:border-secondary/40 transition-all duration-500 hover:-translate-y-2 shadow-sm cursor-pointer block"
                  >
                    <div className="text-5xl mb-8 group-hover:scale-110 transition-transform origin-left">{item.emoji}</div>
                    <h3 className="text-2xl font-headline font-bold mb-4 text-primary tracking-tight">{item.title}</h3>
                    <p className="text-primary/50 mb-10 font-body text-base leading-relaxed">{item.desc}</p>
                    <div className="font-label font-black text-secondary uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all">
                      Open Tool <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

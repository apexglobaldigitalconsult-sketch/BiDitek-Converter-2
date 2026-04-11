import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Sitemap() {
  const sitemapData = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Dashboard', path: '/' },
        { name: 'Converters', path: '/converters' },
        { name: 'Calculators', path: '/calculators' },
      ]
    },
    {
      title: 'Financial Calculators',
      links: [
        { name: 'Mortgage Calculator', path: '/calculators/mortgage' },
        { name: 'Loan Calculator', path: '/calculators/loan' },
        { name: 'Auto Loan Calculator', path: '/calculators/auto-loan' },
        { name: 'Interest Calculator', path: '/calculators/interest' },
        { name: 'Payment Calculator', path: '/calculators/payment' },
        { name: 'Retirement Calculator', path: '/calculators/retirement' },
        { name: 'Amortization Calculator', path: '/calculators/amortization' },
        { name: 'Investment Calculator', path: '/calculators/investment' },
        { name: 'Inflation Calculator', path: '/calculators/inflation' },
        { name: 'Finance Calculator', path: '/calculators/finance' },
        { name: 'Income Tax Calculator', path: '/calculators/income-tax' },
        { name: 'Compound Interest Calculator', path: '/calculators/compound-interest' },
        { name: 'Salary Calculator', path: '/calculators/salary' },
        { name: 'Interest Rate Calculator', path: '/calculators/interest-rate' },
        { name: 'Sales Tax Calculator', path: '/calculators/sales-tax' },
      ]
    },
    {
      title: 'Fitness & Health Calculators',
      links: [
        { name: 'BMI Calculator', path: '/calculators/bmi' },
        { name: 'Calorie Calculator', path: '/calculators/calorie' },
        { name: 'Body Fat Calculator', path: '/calculators/body-fat' },
        { name: 'BMR Calculator', path: '/calculators/bmr' },
        { name: 'Ideal Weight Calculator', path: '/calculators/ideal-weight' },
        { name: 'Pace Calculator', path: '/calculators/pace' },
        { name: 'Pregnancy Calculator', path: '/calculators/pregnancy' },
        { name: 'Pregnancy Conception', path: '/calculators/conception' },
        { name: 'Due Date Calculator', path: '/calculators/due-date' },
      ]
    },
    {
      title: 'Math Calculators',
      links: [
        { name: 'Scientific Calculator', path: '/calculators/scientific' },
        { name: 'Fraction Calculator', path: '/calculators/fraction' },
        { name: 'Percentage Calculator', path: '/calculators/percentage' },
        { name: 'Random Number Generator', path: '/calculators/random' },
        { name: 'Triangle Calculator', path: '/calculators/triangle' },
        { name: 'Standard Deviation', path: '/calculators/std-dev' },
      ]
    },
    {
      title: 'Other Calculators',
      links: [
        { name: 'Age Calculator', path: '/calculators/age' },
        { name: 'Date Calculator', path: '/calculators/date' },
        { name: 'Time Calculator', path: '/calculators/time' },
        { name: 'GPA Calculator', path: '/calculators/gpa' },
        { name: 'Grade Calculator', path: '/calculators/grade' },
        { name: 'Concrete Calculator', path: '/calculators/concrete' },
        { name: 'Subnet Calculator', path: '/calculators/subnet' },
        { name: 'Password Generator', path: '/calculators/password' },
        { name: 'Conversion Calculator', path: '/calculators/conversion' },
      ]
    }
  ];

  return (
    <div className="p-8 lg:p-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-headline font-black text-primary mb-6 tracking-tight">
          Sitemap
        </h1>
        <p className="text-lg text-primary/60 max-w-2xl font-body">
          A complete overview of all pages and tools available on BiDitek Converter.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {sitemapData.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-container-low p-8 rounded-[1px] border border-outline-variant/30 shadow-sm"
          >
            <h2 className="text-xl font-headline font-bold text-primary mb-6 pb-4 border-b border-outline-variant/30">
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary/70 hover:text-secondary font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/30 group-hover:bg-secondary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

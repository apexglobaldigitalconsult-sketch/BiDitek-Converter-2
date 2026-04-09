import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface GenericCalculatorProps {
  title: string;
  category: string;
}

export default function GenericCalculator({ title, category }: GenericCalculatorProps) {
  const location = useLocation();
  
  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">{title}</span>
      </nav>

      <div className="mb-16">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">{title}</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          This is the {title}. Enter your values below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Input Card */}
        <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-16 border border-outline-variant/30">
          <div className="space-y-6">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Input Value 1</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-8 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-transparent border-none py-5 text-2xl font-headline font-bold focus:ring-0 text-primary"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Input Value 2</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-8 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <input 
                type="number" 
                placeholder="0"
                className="w-full bg-transparent border-none py-5 text-2xl font-headline font-bold focus:ring-0 text-primary"
              />
            </div>
          </div>

          <button className="w-full bg-secondary text-white py-8 rounded-[1px] font-headline font-bold text-2xl hover:opacity-90 transition-all shadow-xl shadow-secondary/10">
            CALCULATE
          </button>
        </div>

        {/* Result Card */}
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-surface-container-low rounded-[1px] p-12 lg:p-16 border border-outline-variant/30 shadow-sm text-center">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-12">Result</p>
            <div className="mb-16">
              <h2 className="font-headline text-7xl lg:text-8xl font-extrabold text-primary tracking-tighter">
                0.00
              </h2>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-6">
              <div className="bg-surface-container p-8 rounded-[1px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2">Detail 1</p>
                <p className="font-headline font-bold text-xl">-</p>
              </div>
              <div className="bg-surface-container p-8 rounded-[1px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2">Detail 2</p>
                <p className="font-headline font-bold text-xl">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Upload, X, FileText, ChevronRight, Ruler, Scale, Thermometer, Gauge, Copy, Star, ArrowLeftRight, Repeat, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Converters() {
  const [activeTab, setActiveTab] = React.useState<'file' | 'unit'>('file');
  const [unitCategory, setUnitCategory] = React.useState('Length');

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      <div className="mb-16">
        <span className="font-label text-xs tracking-[0.2em] uppercase text-secondary font-bold">Utility Hub</span>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary mt-2">Converters</h1>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-12 border-b border-surface-container-highest/50 mb-16">
        {['file', 'unit'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "pb-6 text-2xl font-headline font-bold transition-all relative",
              activeTab === tab 
                ? "text-secondary after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-secondary" 
                : "text-primary/20 hover:text-primary"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Converter
          </button>
        ))}
      </div>

      {activeTab === 'file' ? (
        <div className="grid grid-cols-12 gap-12">
          {/* Main File Converter Zone */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Drag & Drop */}
            <div className="group relative rounded-[1px] bg-surface-container-low p-16 text-center border-2 border-dashed border-outline-variant/30 hover:border-secondary/40 transition-all cursor-pointer">
              <div className="flex flex-col items-center space-y-8">
                <div className="w-24 h-24 rounded-[1px] bg-surface-container flex items-center justify-center text-secondary shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-headline font-bold tracking-tight">Drag & drop your file here</h3>
                  <p className="text-primary/40 font-body text-lg">Supports PDF, DOCX, JPG, PNG and 100+ more</p>
                </div>
                <button className="bg-secondary text-white px-12 py-5 rounded-[1px] font-headline font-bold text-xl hover:opacity-90 transition-all">
                  Browse Files
                </button>
              </div>
            </div>

            {/* File Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container rounded-[1px] p-6 flex items-center justify-between border border-outline-variant/30 shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-surface-container-low rounded-[1px] flex items-center justify-center text-primary border border-outline-variant/10">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg">annual_report_2023.pdf</p>
                  <p className="text-sm text-primary/40 font-label">2.4 MB</p>
                </div>
              </div>
              <button className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-[1px] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Format Controls */}
            <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30">
              <div className="grid grid-cols-1 md:grid-cols-11 gap-8 items-center">
                <div className="md:col-span-4 space-y-3">
                  <label className="block text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 pl-4">From</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-surface-container border-none rounded-[1px] px-8 py-5 font-headline font-bold text-lg focus:ring-4 focus:ring-secondary/5 text-primary">
                      <option>PDF (Document)</option>
                      <option>DOCX (Word)</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-3 flex justify-center">
                  <button className="w-16 h-16 rounded-[1px] bg-primary text-background flex items-center justify-center hover:rotate-180 transition-transform duration-700 shadow-md">
                    <Repeat className="w-8 h-8" />
                  </button>
                </div>
                <div className="md:col-span-4 space-y-3">
                  <label className="block text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 pl-4">To</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-surface-container border-none rounded-[1px] px-8 py-5 font-headline font-bold text-lg focus:ring-4 focus:ring-secondary/5 text-primary">
                      <option>DOCX (Word)</option>
                      <option>PDF (Document)</option>
                      <option>JPEG (Image)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button className="bg-secondary text-white py-6 rounded-[1px] font-headline font-bold text-2xl hover:opacity-90 transition-all shadow-xl shadow-secondary/10">
                Convert File
              </button>
              <button className="border-2 border-primary text-primary py-6 rounded-[1px] font-headline font-bold text-2xl hover:bg-primary hover:text-background transition-all">
                Download File
              </button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            <div className="bg-surface-container-low rounded-[1px] p-12 border border-outline-variant/30 shadow-sm">
              <h4 className="font-headline font-bold text-3xl mb-10 tracking-tight">Quick Units</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Length', icon: Ruler },
                  { name: 'Weight', icon: Scale },
                  { name: 'Temp', icon: Thermometer },
                  { name: 'Speed', icon: Gauge },
                ].map((unit) => (
                  <button 
                    key={unit.name}
                    className="flex flex-col items-center p-6 rounded-[1px] bg-surface-container hover:bg-secondary/10 transition-all group"
                  >
                    <unit.icon className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
                    <span className="font-label text-[10px] font-black uppercase tracking-widest">{unit.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-[500px] rounded-[1px] overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" 
                alt="Pro Feature"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-12">
                <span className="text-background/60 font-label text-xs uppercase tracking-[0.2em] font-bold mb-4">Pro Feature</span>
                <h4 className="text-background text-4xl font-headline font-bold leading-[1.1] tracking-tight">
                  Batch conversion at the speed of light.
                </h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter">Precise Unit Alchemy</h2>
            <p className="text-primary/50 text-xl font-body">Shift between systems with surgical precision using our professional-grade unit engine.</p>
          </div>

          <div className="bg-surface-container-low rounded-[1px] p-12 lg:p-20 border border-outline-variant/30">
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              {['Length', 'Weight', 'Temp', 'Speed', 'Volume'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setUnitCategory(cat)}
                  className={cn(
                    "px-10 py-4 rounded-[1px] font-headline font-bold text-sm uppercase tracking-widest transition-all",
                    unitCategory === cat 
                      ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                      : "bg-surface-container text-primary/30 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Conversion Logic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                <div className="space-y-4">
                  <label className="font-label text-xs font-black uppercase tracking-[0.3em] text-secondary">Input Value</label>
                  <input 
                    type="number" 
                    defaultValue="1250"
                    className="w-full bg-transparent border-b-8 border-primary py-8 text-7xl lg:text-9xl font-headline font-bold focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex-1 relative">
                    <select className="w-full appearance-none bg-surface-container-highest rounded-[1px] px-8 py-6 font-headline font-bold text-xl focus:ring-4 focus:ring-secondary/5">
                      <option>Meters (m)</option>
                      <option>Kilometers (km)</option>
                    </select>
                  </div>
                  <button className="w-20 h-20 rounded-[1px] border-2 border-surface-container-highest flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all editorial-shadow">
                    <ArrowLeftRight className="w-8 h-8" />
                  </button>
                  <div className="flex-1 relative">
                    <select className="w-full appearance-none bg-surface-container-highest rounded-[1px] px-8 py-6 font-headline font-bold text-xl focus:ring-4 focus:ring-secondary/5">
                      <option>Feet (ft)</option>
                      <option>Yards (yd)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-primary text-background rounded-[1px] p-16 relative overflow-hidden editorial-shadow">
                <div className="absolute -right-24 -top-24 w-80 h-80 bg-secondary/20 rounded-[1px] blur-[100px]" />
                <div className="relative z-10 space-y-6">
                  <p className="font-label text-sm uppercase tracking-[0.3em] text-background/60 font-bold">Converted Result</p>
                  <div className="space-y-2">
                    <h3 className="font-headline text-7xl lg:text-9xl font-extrabold tracking-tighter">4,101.05</h3>
                    <p className="text-secondary text-3xl font-headline font-bold uppercase tracking-tight">FEET (FT)</p>
                  </div>
                  <div className="pt-12 flex gap-4">
                    <button className="flex-1 bg-background/10 hover:bg-background/20 py-5 rounded-[1px] font-headline font-bold text-lg flex items-center justify-center gap-3 backdrop-blur-xl transition-all">
                      <Copy className="w-6 h-6" />
                      Copy Result
                    </button>
                    <button className="w-20 h-20 bg-secondary text-white rounded-[1px] flex items-center justify-center hover:scale-105 transition-transform">
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Scale */}
            <div className="mt-24 pt-16 border-t border-outline-variant/30">
              <h5 className="font-headline font-bold text-2xl mb-10 tracking-tight">Reference Scale</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { from: '1 m', to: '3.28 ft' },
                  { from: '1 km', to: '0.62 mi' },
                  { from: '1 in', to: '2.54 cm' },
                ].map((ref, i) => (
                  <div key={i} className="p-8 bg-surface-container rounded-[1px] flex items-center justify-between border border-outline-variant/10 group hover:bg-secondary transition-all duration-500 shadow-sm">
                    <span className="text-primary/40 font-bold text-lg group-hover:text-white/60 transition-colors">{ref.from}</span>
                    <ArrowRight className="w-6 h-6 text-secondary group-hover:text-white transition-all" />
                    <span className="font-headline font-bold text-xl group-hover:text-white transition-colors">{ref.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

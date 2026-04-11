import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  UnitSystem, BagSize, PriceMode, RebarSize, 
  calculateConcreteBase, toFt, inToFt, BAG_YIELDS_CU_FT, REBAR_WEIGHTS_LB_PER_FT 
} from './concreteCalculatorUtils';

// Sub-components for each mode
import SlabMode from './SlabMode';
import FootingMode from './FootingMode';
import ColumnMode from './ColumnMode';
import StairsMode from './StairsMode';

export default function ConcreteCalculator() {
  const [activeTab, setActiveTab] = useState<'slab' | 'footing' | 'column' | 'stairs'>('slab');

  const tabs = [
    { id: 'slab', label: 'Slab & Floor' },
    { id: 'footing', label: 'Footing & Foundation' },
    { id: 'column', label: 'Column & Cylinder' },
    { id: 'stairs', label: 'Stairs' }
  ] as const;

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Concrete Calculator</span>
      </nav>

      <div className="mb-16">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Concrete Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate the volume, bags, and cost of concrete needed for your project. Choose a calculator mode below.
        </p>
      </div>

      <div className="bg-surface-container-low rounded-[1px] border border-outline-variant/30 overflow-hidden mb-12">
        <div className="flex overflow-x-auto border-b border-outline-variant/30 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[180px] py-6 px-6 text-[10px] font-label font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab.id
                  ? 'bg-secondary/5 text-secondary border-b-2 border-secondary'
                  : 'text-primary/50 hover:bg-surface-container hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'slab' && <SlabMode />}
      {activeTab === 'footing' && <FootingMode />}
      {activeTab === 'column' && <ColumnMode />}
      {activeTab === 'stairs' && <StairsMode />}
    </div>
  );
}

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import IPv4Mode from './IPv4Mode';
import VLSMMode from './VLSMMode';
import IPv6Mode from './IPv6Mode';
import RangeMode from './RangeMode';

export default function SubnetCalculator() {
  const [activeTab, setActiveTab] = useState<'ipv4' | 'vlsm' | 'ipv6' | 'range'>('ipv4');

  const tabs = [
    { id: 'ipv4', label: 'IPv4 Subnet' },
    { id: 'vlsm', label: 'VLSM / Divider' },
    { id: 'ipv6', label: 'IPv6 Subnet' },
    { id: 'range', label: 'Range & Wildcard' }
  ] as const;

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Subnet Calculator</span>
      </nav>

      <div className="mb-16">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Subnet Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate IPv4/IPv6 subnets, divide networks with VLSM, and convert IP ranges to CIDR blocks.
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

      {activeTab === 'ipv4' && <IPv4Mode />}
      {activeTab === 'vlsm' && <VLSMMode />}
      {activeTab === 'ipv6' && <IPv6Mode />}
      {activeTab === 'range' && <RangeMode />}
    </div>
  );
}

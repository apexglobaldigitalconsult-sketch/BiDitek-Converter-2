import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { calculateVLSM, VLSMSubnetReq, VLSMResult } from './subnetCalculatorUtils';
import { CopyButton } from './IPv4Mode';

export default function VLSMMode() {
  const [parentIp, setParentIp] = useState('192.168.1.0');
  const [parentCidr, setParentCidr] = useState('24');
  const [method, setMethod] = useState<'best' | 'first'>('best');
  const [subnets, setSubnets] = useState<VLSMSubnetReq[]>([
    { id: '1', name: 'Sales', hosts: 60 },
    { id: '2', name: 'Engineering', hosts: 25 },
    { id: '3', name: 'HR', hosts: 10 }
  ]);

  const addSubnet = () => {
    setSubnets([...subnets, { id: Math.random().toString(), name: `Subnet ${subnets.length + 1}`, hosts: 10 }]);
  };

  const removeSubnet = (id: string) => {
    setSubnets(subnets.filter(s => s.id !== id));
  };

  const updateSubnet = (id: string, field: keyof VLSMSubnetReq, value: string | number) => {
    setSubnets(subnets.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const clear = () => {
    setParentIp('');
    setParentCidr('24');
    setSubnets([{ id: '1', name: 'Subnet 1', hosts: 10 }]);
  };

  const { results, error, totalAllocated, totalWasted } = calculateVLSM(parentIp, parseInt(parentCidr, 10), subnets, method);
  const parentCapacity = Math.pow(2, 32 - parseInt(parentCidr, 10));
  const remaining = parentCapacity - totalAllocated;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        <div className="xl:col-span-4 bg-surface-container-low rounded-[1px] p-10 space-y-8 border border-outline-variant/30">
          <h3 className="font-headline text-xl font-bold text-primary">Parent Network</h3>
          
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Network IP</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <input 
                type="text" 
                value={parentIp} 
                onChange={e => setParentIp(e.target.value)} 
                placeholder="192.168.1.0" 
                className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">CIDR Prefix</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <span className="text-primary/50 font-headline font-bold text-xl mr-1">/</span>
              <input 
                type="number" 
                min="0" max="32" 
                value={parentCidr} 
                onChange={e => setParentCidr(e.target.value)} 
                placeholder="24" 
                className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Allocation Method</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setMethod('best')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${method === 'best' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Best Fit</button>
              <button onClick={() => setMethod('first')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${method === 'first' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>First Fit</button>
            </div>
          </div>

          <button onClick={clear} className="w-full bg-surface-container text-primary py-4 rounded-[1px] font-headline font-bold hover:bg-outline-variant/20 transition-all">
            CLEAR ALL
          </button>
        </div>

        <div className="xl:col-span-8 bg-surface-container-low rounded-[1px] p-10 space-y-8 border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-primary">Subnet Requirements</h3>
            <button onClick={addSubnet} className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-[1px] font-bold text-sm transition-all">
              <Plus className="w-4 h-4" /> Add Subnet
            </button>
          </div>

          <div className="space-y-4">
            {subnets.map((subnet, index) => (
              <div key={subnet.id} className="flex items-center gap-4 bg-surface-container p-4 rounded-[1px] border border-outline-variant/30">
                <span className="font-mono text-xs text-primary/30 w-6">{index + 1}.</span>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={subnet.name} 
                    onChange={e => updateSubnet(subnet.id, 'name', e.target.value)} 
                    placeholder="Subnet Name" 
                    className="w-full bg-transparent border-none p-0 font-bold focus:ring-0 text-primary" 
                  />
                </div>
                <div className="w-32">
                  <input 
                    type="number" 
                    min="1"
                    value={subnet.hosts} 
                    onChange={e => updateSubnet(subnet.id, 'hosts', parseInt(e.target.value, 10) || 0)} 
                    placeholder="Hosts" 
                    className="w-full bg-transparent border-none p-0 font-bold focus:ring-0 text-primary text-right" 
                  />
                </div>
                <span className="text-xs font-bold text-primary/30 uppercase tracking-wider w-16">Hosts</span>
                <button onClick={() => removeSubnet(subnet.id)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-[1px] transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {subnets.length === 0 && (
              <p className="text-center text-primary/30 py-8 font-bold">No subnets added.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm overflow-x-auto">
        <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-8">VLSM Allocation Results</p>
        
        {error ? (
          <div className="p-6 bg-red-500/10 text-red-600 rounded-[1px] font-bold border border-red-500/20 text-center">
            {error}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-8">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50">Name</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50">Network</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50">Usable Range</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50">Broadcast</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50 text-right">Hosts (Req/Total)</th>
                  <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-primary/50 text-right">Wasted</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-primary">{r.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="font-mono text-sm text-primary">{r.networkAddress}/{r.cidr}</span>
                        <CopyButton text={`${r.networkAddress}/${r.cidr}`} />
                      </div>
                      <div className="text-xs text-primary/40 font-mono mt-1">{r.mask}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="font-mono text-sm text-primary">{r.firstHost} - {r.lastHost}</span>
                        <CopyButton text={`${r.firstHost} - ${r.lastHost}`} />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="font-mono text-sm text-primary">{r.broadcast}</span>
                        <CopyButton text={r.broadcast} />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-primary">{r.neededSize}</span>
                      <span className="text-primary/30 mx-1">/</span>
                      <span className="font-bold text-secondary">{r.allocatedSize - 2}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-orange-500">{r.wasted}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/30">
              <div className="bg-surface-container p-6 rounded-[1px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Parent Capacity</p>
                <p className="font-headline font-bold text-2xl text-primary">{parentCapacity.toLocaleString()}</p>
              </div>
              <div className="bg-surface-container p-6 rounded-[1px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Total Allocated</p>
                <p className="font-headline font-bold text-2xl text-secondary">{totalAllocated.toLocaleString()}</p>
              </div>
              <div className="bg-surface-container p-6 rounded-[1px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Total Wasted</p>
                <p className="font-headline font-bold text-2xl text-orange-500">{totalWasted.toLocaleString()}</p>
              </div>
              <div className="bg-surface-container p-6 rounded-[1px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Remaining Space</p>
                <p className="font-headline font-bold text-2xl text-green-500">{remaining.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-primary/30 font-headline text-xl font-bold">Add subnets to see allocation</p>
          </div>
        )}
      </div>
    </div>
  );
}

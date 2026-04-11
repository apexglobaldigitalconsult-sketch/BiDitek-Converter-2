import React, { useState } from 'react';
import { 
  isValidIPv6, expandIPv6, compressIPv6, ipv6ToBigInt, bigIntToIPv6, 
  getIPv6Type, toBinaryIPv6 
} from './subnetCalculatorUtils';
import { ResultRow } from './IPv4Mode';

export default function IPv6Mode() {
  const [ip, setIp] = useState('2001:db8::1');
  const [prefix, setPrefix] = useState('64');
  const [format, setFormat] = useState<'compressed' | 'expanded'>('compressed');
  const [showBinary, setShowBinary] = useState(false);

  const clear = () => {
    setIp('');
    setPrefix('64');
    setFormat('compressed');
  };

  const calculate = () => {
    if (!isValidIPv6(ip)) {
      return { error: 'Invalid IPv6 address.' };
    }
    const p = parseInt(prefix, 10);
    if (isNaN(p) || p < 0 || p > 128) {
      return { error: 'Invalid prefix length (must be 0-128).' };
    }

    const ipBigInt = ipv6ToBigInt(ip);
    
    // Calculate mask
    const maskBigInt = p === 0 ? 0n : ((1n << 128n) - 1n) ^ ((1n << BigInt(128 - p)) - 1n);
    const networkBigInt = ipBigInt & maskBigInt;
    const broadcastBigInt = networkBigInt | ((1n << BigInt(128 - p)) - 1n);

    const expandedIp = expandIPv6(ip);
    const compressedIp = compressIPv6(ip);
    
    const networkExpanded = expandIPv6(bigIntToIPv6(networkBigInt));
    const networkCompressed = compressIPv6(bigIntToIPv6(networkBigInt));
    
    const firstExpanded = expandIPv6(bigIntToIPv6(networkBigInt));
    const firstCompressed = compressIPv6(bigIntToIPv6(networkBigInt));
    
    const lastExpanded = expandIPv6(bigIntToIPv6(broadcastBigInt));
    const lastCompressed = compressIPv6(bigIntToIPv6(broadcastBigInt));

    const totalHosts = p === 128 ? "1" : `2^${128 - p} (${(2 ** (128 - p)).toExponential(2)})`;

    return {
      expandedIp,
      compressedIp,
      network: format === 'compressed' ? networkCompressed : networkExpanded,
      first: format === 'compressed' ? firstCompressed : firstExpanded,
      last: format === 'compressed' ? lastCompressed : lastExpanded,
      totalHosts,
      type: getIPv6Type(ip),
      binIp: toBinaryIPv6(ip)
    };
  };

  const calcResult = calculate();
  const error = calcResult && 'error' in calcResult ? calcResult.error : null;
  const result = calcResult && !('error' in calcResult) ? calcResult : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-5 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-primary">IPv6 Settings</h3>
          
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">IPv6 Address</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <input 
                type="text" 
                value={ip} 
                onChange={e => setIp(e.target.value)} 
                placeholder="2001:db8::1" 
                className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Prefix Length</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <span className="text-primary/50 font-headline font-bold text-xl mr-1">/</span>
              <input 
                type="number" 
                min="0" max="128" 
                value={prefix} 
                onChange={e => setPrefix(e.target.value)} 
                placeholder="64" 
                className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Display Format</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setFormat('compressed')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${format === 'compressed' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Compressed</button>
              <button onClick={() => setFormat('expanded')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${format === 'expanded' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Expanded</button>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 text-red-600 rounded-[1px] font-bold border border-red-500/20">{error}</div>}

        <div className="flex gap-4">
          <button onClick={clear} className="w-full bg-surface-container text-primary py-6 rounded-[1px] font-headline font-bold text-xl hover:bg-outline-variant/20 transition-all">
            CLEAR
          </button>
        </div>
      </div>

      {/* Result Card */}
      <div className="xl:col-span-7 space-y-8">
        <div className="bg-surface-container-low rounded-[1px] p-10 lg:p-12 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Results</p>
            <button 
              onClick={() => setShowBinary(!showBinary)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] transition-all ${showBinary ? 'bg-secondary text-white' : 'bg-surface-container text-primary/50 hover:text-primary'}`}
            >
              {showBinary ? 'Hide Binary' : 'Show Binary'}
            </button>
          </div>
          
          {result ? (
            <div className="space-y-2">
              <ResultRow label="Expanded Address" value={result.expandedIp} binary={showBinary ? result.binIp : undefined} />
              <ResultRow label="Compressed Address" value={result.compressedIp} />
              <ResultRow label="Network Prefix" value={`${result.network}/${prefix}`} />
              <ResultRow label="First Address" value={result.first} />
              <ResultRow label="Last Address" value={result.last} />
              <ResultRow label="Total Addresses" value={result.totalHosts} />
              <ResultRow label="Address Type" value={result.type} />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-primary/30 font-headline text-xl font-bold">Enter a valid IPv6 and Prefix</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

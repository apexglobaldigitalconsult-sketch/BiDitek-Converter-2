import React, { useState } from 'react';
import { 
  isValidIPv4, ipToInt, intToIp, rangeToCidr, maskIntToCidr, toBinaryIPv4 
} from './subnetCalculatorUtils';
import { ResultRow, CopyButton } from './IPv4Mode';

export default function RangeMode() {
  const [method, setMethod] = useState<'range' | 'wildcard'>('range');
  
  // Range
  const [startIp, setStartIp] = useState('192.168.1.10');
  const [endIp, setEndIp] = useState('192.168.1.50');
  
  // Wildcard
  const [ip, setIp] = useState('192.168.1.0');
  const [wildcard, setWildcard] = useState('0.0.0.255');
  
  const [showBinary, setShowBinary] = useState(false);

  const clear = () => {
    setStartIp('');
    setEndIp('');
    setIp('');
    setWildcard('');
  };

  const calculateRange = () => {
    if (!isValidIPv4(startIp) || !isValidIPv4(endIp)) {
      return { error: 'Invalid start or end IP address.' };
    }
    const startInt = ipToInt(startIp);
    const endInt = ipToInt(endIp);
    if (startInt > endInt) {
      return { error: 'Start IP must be less than or equal to End IP.' };
    }

    const cidrs = rangeToCidr(startIp, endIp);
    const totalIps = endInt - startInt + 1;

    return {
      cidrs,
      totalIps
    };
  };

  const calculateWildcard = () => {
    if (!isValidIPv4(ip) || !isValidIPv4(wildcard)) {
      return { error: 'Invalid IP address or wildcard mask.' };
    }

    const ipInt = ipToInt(ip);
    const wildcardInt = ipToInt(wildcard);
    const maskInt = ~wildcardInt >>> 0;
    
    // Check if it's a valid contiguous wildcard mask (optional, but good for CIDR)
    // A valid subnet mask has all 1s followed by all 0s.
    // So ~maskInt + 1 should be a power of 2.
    const isContiguous = (wildcardInt & (wildcardInt + 1)) === 0;
    
    const cidr = isContiguous ? `/${maskIntToCidr(maskInt)}` : 'Non-contiguous';
    
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | wildcardInt;
    const totalIps = wildcardInt + 1;

    return {
      mask: intToIp(maskInt),
      cidr,
      first: intToIp(networkInt),
      last: intToIp(broadcastInt),
      totalIps,
      binIp: toBinaryIPv4(ipInt),
      binWildcard: toBinaryIPv4(wildcardInt)
    };
  };

  const rangeCalcResult = method === 'range' ? calculateRange() : null;
  const wildcardCalcResult = method === 'wildcard' ? calculateWildcard() : null;

  const error = (method === 'range' && rangeCalcResult && 'error' in rangeCalcResult ? rangeCalcResult.error : null) || 
                (method === 'wildcard' && wildcardCalcResult && 'error' in wildcardCalcResult ? wildcardCalcResult.error : null);

  const rangeResult = rangeCalcResult && !('error' in rangeCalcResult) ? rangeCalcResult : null;
  const wildcardResult = wildcardCalcResult && !('error' in wildcardCalcResult) ? wildcardCalcResult : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-5 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-primary">Mode</h3>
          </div>
          <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
            <button onClick={() => setMethod('range')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${method === 'range' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Range to CIDR</button>
            <button onClick={() => setMethod('wildcard')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${method === 'wildcard' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Wildcard / ACL</button>
          </div>
        </div>

        {method === 'range' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Start IP Address</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="text" 
                  value={startIp} 
                  onChange={e => setStartIp(e.target.value)} 
                  placeholder="192.168.1.10" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">End IP Address</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="text" 
                  value={endIp} 
                  onChange={e => setEndIp(e.target.value)} 
                  placeholder="192.168.1.50" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">IP Address</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="text" 
                  value={ip} 
                  onChange={e => setIp(e.target.value)} 
                  placeholder="192.168.1.0" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Wildcard Mask</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="text" 
                  value={wildcard} 
                  onChange={e => setWildcard(e.target.value)} 
                  placeholder="0.0.0.255" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            </div>
          </div>
        )}

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
            {method === 'wildcard' && (
              <button 
                onClick={() => setShowBinary(!showBinary)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] transition-all ${showBinary ? 'bg-secondary text-white' : 'bg-surface-container text-primary/50 hover:text-primary'}`}
              >
                {showBinary ? 'Hide Binary' : 'Show Binary'}
              </button>
            )}
          </div>
          
          {method === 'range' && rangeResult ? (
            <div className="space-y-6">
              <div className="bg-surface-container p-6 rounded-[1px] text-center mb-8 border border-outline-variant/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Total IPs in Range</p>
                <p className="font-headline font-bold text-4xl text-primary">{rangeResult.totalIps.toLocaleString()}</p>
              </div>
              
              <div className="space-y-4">
                <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">CIDR Blocks ({rangeResult.cidrs.length})</p>
                <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 max-h-[400px] overflow-y-auto space-y-2">
                  {rangeResult.cidrs.map((cidr, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                      <span className="font-mono text-primary font-bold">{cidr}</span>
                      <CopyButton text={cidr} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : method === 'wildcard' && wildcardResult ? (
            <div className="space-y-2">
              <ResultRow label="Equivalent Subnet Mask" value={wildcardResult.mask} />
              <ResultRow label="CIDR Notation" value={wildcardResult.cidr} />
              <ResultRow label="IP Range Covered" value={`${wildcardResult.first} - ${wildcardResult.last}`} />
              <ResultRow label="Total IPs Matched" value={wildcardResult.totalIps.toLocaleString()} />
              {showBinary && (
                <>
                  <ResultRow label="IP Binary" value={wildcardResult.binIp} />
                  <ResultRow label="Wildcard Binary" value={wildcardResult.binWildcard} />
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-primary/30 font-headline text-xl font-bold">Enter valid inputs to calculate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

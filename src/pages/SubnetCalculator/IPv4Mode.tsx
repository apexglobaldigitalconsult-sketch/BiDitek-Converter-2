import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { 
  isValidIPv4, isValidSubnetMask, ipToInt, intToIp, cidrToMaskInt, maskIntToCidr, 
  getIPv4Class, getIPv4Type, toBinaryIPv4 
} from './subnetCalculatorUtils';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="ml-2 p-1.5 text-primary/30 hover:text-secondary hover:bg-secondary/10 rounded-[1px] transition-all"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function ResultRow({ label, value, binary }: { label: string, value: string, binary?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-outline-variant/30 last:border-0 gap-2">
      <span className="text-sm font-bold text-primary/70">{label}</span>
      <div className="flex flex-col sm:items-end">
        <div className="flex items-center">
          <span className="font-headline font-bold text-primary">{value}</span>
          <CopyButton text={value} />
        </div>
        {binary && (
          <div className="flex items-center mt-1">
            <span className="font-mono text-xs text-primary/40 tracking-widest">{binary}</span>
            <CopyButton text={binary} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function IPv4Mode() {
  const [ip, setIp] = useState('192.168.1.1');
  const [inputType, setInputType] = useState<'cidr' | 'mask'>('cidr');
  const [cidr, setCidr] = useState('24');
  const [mask, setMask] = useState('255.255.255.0');
  const [showBinary, setShowBinary] = useState(false);

  const handleCidrChange = (val: string) => {
    setCidr(val);
    const c = parseInt(val, 10);
    if (!isNaN(c) && c >= 0 && c <= 32) {
      setMask(intToIp(cidrToMaskInt(c)));
    }
  };

  const handleMaskChange = (val: string) => {
    setMask(val);
    if (isValidSubnetMask(val)) {
      setCidr(maskIntToCidr(ipToInt(val)).toString());
    }
  };

  const clear = () => {
    setIp('');
    setCidr('24');
    setMask('255.255.255.0');
    setInputType('cidr');
  };

  const calculate = () => {
    if (!isValidIPv4(ip)) {
      return { error: 'Invalid IPv4 address.' };
    }
    const c = parseInt(cidr, 10);
    if (isNaN(c) || c < 0 || c > 32) {
      return { error: 'Invalid CIDR prefix (must be 0-32).' };
    }
    if (!isValidSubnetMask(mask)) {
      return { error: 'Invalid subnet mask.' };
    }

    const ipInt = ipToInt(ip);
    const maskInt = cidrToMaskInt(c);
    const wildcardInt = ~maskInt >>> 0;
    const networkInt = ipInt & maskInt;
    const broadcastInt = networkInt | wildcardInt;
    
    let firstHostInt = networkInt + 1;
    let lastHostInt = broadcastInt - 1;
    let usableHosts = Math.pow(2, 32 - c) - 2;

    // Special cases for /31 and /32
    if (c === 31) {
      firstHostInt = networkInt;
      lastHostInt = broadcastInt;
      usableHosts = 2;
    } else if (c === 32) {
      firstHostInt = networkInt;
      lastHostInt = broadcastInt;
      usableHosts = 1;
    }

    return {
      network: intToIp(networkInt),
      broadcast: intToIp(broadcastInt),
      firstHost: intToIp(firstHostInt),
      lastHost: intToIp(lastHostInt),
      totalHosts: Math.pow(2, 32 - c),
      usableHosts,
      mask: intToIp(maskInt),
      wildcard: intToIp(wildcardInt),
      cidr: `/${c}`,
      ipClass: getIPv4Class(ipInt),
      ipType: getIPv4Type(ipInt),
      binIp: toBinaryIPv4(ipInt),
      binMask: toBinaryIPv4(maskInt),
      binNetwork: toBinaryIPv4(networkInt),
      binBroadcast: toBinaryIPv4(broadcastInt)
    };
  };

  const calcResult = calculate();
  const error = calcResult && 'error' in calcResult ? calcResult.error : null;
  const result = calcResult && !('error' in calcResult) ? calcResult : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-5 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-primary">IPv4 Settings</h3>
          
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">IP Address</label>
            <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
              <input 
                type="text" 
                value={ip} 
                onChange={e => setIp(e.target.value)} 
                placeholder="192.168.1.1" 
                className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pl-4 mb-2">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Subnet</label>
              <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-primary/50">
                <button onClick={() => setInputType('cidr')} className={inputType === 'cidr' ? 'text-secondary' : 'hover:text-primary'}>CIDR</button>
                <span>|</span>
                <button onClick={() => setInputType('mask')} className={inputType === 'mask' ? 'text-secondary' : 'hover:text-primary'}>Mask</button>
              </div>
            </div>
            
            {inputType === 'cidr' ? (
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <span className="text-primary/50 font-headline font-bold text-xl mr-1">/</span>
                <input 
                  type="number" 
                  min="0" max="32" 
                  value={cidr} 
                  onChange={e => handleCidrChange(e.target.value)} 
                  placeholder="24" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            ) : (
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="text" 
                  value={mask} 
                  onChange={e => handleMaskChange(e.target.value)} 
                  placeholder="255.255.255.0" 
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" 
                />
              </div>
            )}
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
              <ResultRow label="IP Address" value={ip} binary={showBinary ? result.binIp : undefined} />
              <ResultRow label="Network Address" value={result.network} binary={showBinary ? result.binNetwork : undefined} />
              <ResultRow label="Usable Host Range" value={`${result.firstHost} - ${result.lastHost}`} />
              <ResultRow label="Broadcast Address" value={result.broadcast} binary={showBinary ? result.binBroadcast : undefined} />
              <ResultRow label="Subnet Mask" value={result.mask} binary={showBinary ? result.binMask : undefined} />
              <ResultRow label="Wildcard Mask" value={result.wildcard} />
              <ResultRow label="CIDR Notation" value={result.cidr} />
              <ResultRow label="Total Hosts" value={result.totalHosts.toLocaleString()} />
              <ResultRow label="Usable Hosts" value={result.usableHosts.toLocaleString()} />
              <ResultRow label="IP Class" value={result.ipClass} />
              <ResultRow label="IP Type" value={result.ipType} />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-primary/30 font-headline text-xl font-bold">Enter a valid IP and Subnet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

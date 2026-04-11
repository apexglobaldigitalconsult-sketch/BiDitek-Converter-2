export function ipToInt(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

export function cidrToMaskInt(cidr: number): number {
  return cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
}

export function maskIntToCidr(maskInt: number): number {
  let count = 0;
  let temp = maskInt;
  while ((temp & 0x80000000) !== 0) {
    count++;
    temp = (temp << 1) >>> 0;
  }
  return count;
}

export function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => {
    const num = parseInt(p, 10);
    return num >= 0 && num <= 255 && p === num.toString();
  });
}

export function isValidSubnetMask(mask: string): boolean {
  if (!isValidIPv4(mask)) return false;
  const int = ipToInt(mask);
  const cidr = maskIntToCidr(int);
  return cidrToMaskInt(cidr) === int;
}

export function getIPv4Class(ipInt: number): string {
  const firstOctet = (ipInt >>> 24) & 255;
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
  return 'Unknown';
}

export function getIPv4Type(ipInt: number): string {
  const firstOctet = (ipInt >>> 24) & 255;
  const secondOctet = (ipInt >>> 16) & 255;
  
  if (firstOctet === 10) return 'Private';
  if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private';
  if (firstOctet === 192 && secondOctet === 168) return 'Private';
  if (firstOctet === 127) return 'Loopback';
  if (firstOctet === 169 && secondOctet === 254) return 'Link-local';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Multicast';
  
  return 'Public';
}

export function toBinaryIPv4(ipInt: number): string {
  return [
    ((ipInt >>> 24) & 255).toString(2).padStart(8, '0'),
    ((ipInt >>> 16) & 255).toString(2).padStart(8, '0'),
    ((ipInt >>> 8) & 255).toString(2).padStart(8, '0'),
    (ipInt & 255).toString(2).padStart(8, '0')
  ].join('.');
}

// IPv6 Logic
export function isValidIPv6(ip: string): boolean {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
}

export function expandIPv6(ip: string): string {
  if (!isValidIPv6(ip)) return '';
  let full = ip;
  if (full.includes('::')) {
    const parts = full.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - (left.length + right.length);
    const zeros = Array(missing).fill('0000');
    full = [...left, ...zeros, ...right].join(':');
  }
  return full.split(':').map(part => part.padStart(4, '0')).join(':');
}

export function compressIPv6(ip: string): string {
  const expanded = expandIPv6(ip);
  if (!expanded) return '';
  let compressed = expanded.replace(/(^|:)0{1,3}/g, '$1');
  compressed = compressed.replace(/(:0)+:/, '::'); // Replace longest sequence of zeros, simplified here
  return compressed;
}

export function ipv6ToBigInt(ip: string): bigint {
  const expanded = expandIPv6(ip);
  if (!expanded) return 0n;
  const hex = expanded.replace(/:/g, '');
  return BigInt('0x' + hex);
}

export function bigIntToIPv6(int: bigint): string {
  let hex = int.toString(16).padStart(32, '0');
  const parts = [];
  for (let i = 0; i < 32; i += 4) {
    parts.push(hex.substring(i, i + 4));
  }
  return parts.join(':');
}

export function getIPv6Type(ip: string): string {
  const expanded = expandIPv6(ip);
  if (!expanded) return 'Unknown';
  if (expanded.startsWith('ff')) return 'Multicast';
  if (expanded.startsWith('fe8') || expanded.startsWith('fe9') || expanded.startsWith('fea') || expanded.startsWith('feb')) return 'Link-Local';
  if (expanded.startsWith('fc') || expanded.startsWith('fd')) return 'Unique Local';
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0001') return 'Loopback';
  if (expanded === '0000:0000:0000:0000:0000:0000:0000:0000') return 'Unspecified';
  return 'Global Unicast';
}

export function toBinaryIPv6(ip: string): string {
  const expanded = expandIPv6(ip);
  if (!expanded) return '';
  return expanded.split(':').map(part => parseInt(part, 16).toString(2).padStart(16, '0')).join(':');
}

// VLSM Logic
export interface VLSMSubnetReq {
  id: string;
  name: string;
  hosts: number;
}

export interface VLSMResult {
  name: string;
  neededSize: number;
  allocatedSize: number;
  networkAddress: string;
  cidr: number;
  mask: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  wasted: number;
}

export function calculateVLSM(parentIp: string, parentCidr: number, subnets: VLSMSubnetReq[], method: 'best' | 'first'): { results: VLSMResult[], error?: string, totalAllocated: number, totalWasted: number } {
  if (!isValidIPv4(parentIp)) return { results: [], error: 'Invalid parent IP', totalAllocated: 0, totalWasted: 0 };
  
  const parentMaskInt = cidrToMaskInt(parentCidr);
  const parentNetworkInt = ipToInt(parentIp) & parentMaskInt;
  const parentBroadcastInt = parentNetworkInt | (~parentMaskInt >>> 0);
  const parentCapacity = parentBroadcastInt - parentNetworkInt + 1;

  // Sort subnets
  const sortedSubnets = [...subnets];
  if (method === 'best') {
    sortedSubnets.sort((a, b) => b.hosts - a.hosts);
  }

  let currentIpInt = parentNetworkInt;
  const results: VLSMResult[] = [];
  let totalAllocated = 0;
  let totalWasted = 0;

  for (const req of sortedSubnets) {
    if (req.hosts <= 0) continue;
    
    // Find required CIDR
    const neededHosts = req.hosts + 2; // network + broadcast
    let cidr = 32;
    while (Math.pow(2, 32 - cidr) < neededHosts && cidr >= 0) {
      cidr--;
    }

    if (cidr < parentCidr) {
      return { results, error: `Subnet ${req.name} requires /${cidr} which is larger than parent /${parentCidr}`, totalAllocated, totalWasted };
    }

    const blockSize = Math.pow(2, 32 - cidr);
    
    // Align currentIpInt to block size
    if (currentIpInt % blockSize !== 0) {
      currentIpInt = currentIpInt + (blockSize - (currentIpInt % blockSize));
    }

    if (currentIpInt + blockSize - 1 > parentBroadcastInt) {
      return { results, error: `Not enough space in parent network for subnet ${req.name}`, totalAllocated, totalWasted };
    }

    const maskInt = cidrToMaskInt(cidr);
    const networkInt = currentIpInt;
    const broadcastInt = networkInt | (~maskInt >>> 0);
    
    const allocatedSize = blockSize;
    const wasted = allocatedSize - neededHosts;

    results.push({
      name: req.name,
      neededSize: req.hosts,
      allocatedSize,
      networkAddress: intToIp(networkInt),
      cidr,
      mask: intToIp(maskInt),
      firstHost: intToIp(networkInt + 1),
      lastHost: intToIp(broadcastInt - 1),
      broadcast: intToIp(broadcastInt),
      wasted
    });

    totalAllocated += allocatedSize;
    totalWasted += wasted;
    currentIpInt += blockSize;
  }

  return { results, totalAllocated, totalWasted };
}

// Range to CIDR Logic
export function rangeToCidr(startIp: string, endIp: string): string[] {
  if (!isValidIPv4(startIp) || !isValidIPv4(endIp)) return [];
  
  let startInt = ipToInt(startIp);
  const endInt = ipToInt(endIp);
  
  if (startInt > endInt) return [];

  const cidrs: string[] = [];

  while (startInt <= endInt) {
    let maxSize = 32;
    while (maxSize > 0) {
      const mask = cidrToMaskInt(maxSize - 1);
      const maskBase = startInt & mask;
      
      if (maskBase !== startInt) break; // Not aligned
      
      const broadcast = maskBase | (~mask >>> 0);
      if (broadcast > endInt) break; // Exceeds end IP
      
      maxSize--;
    }
    
    cidrs.push(`${intToIp(startInt)}/${maxSize}`);
    
    const blockSize = Math.pow(2, 32 - maxSize);
    if (startInt + blockSize < startInt) break; // Overflow protection
    startInt += blockSize;
  }

  return cidrs;
}

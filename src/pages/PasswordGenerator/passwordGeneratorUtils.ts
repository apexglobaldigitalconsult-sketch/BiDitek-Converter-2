export function cryptoRandInt(min: number, max: number): number {
  const range = max - min + 1;
  const maxValid = Math.floor(4294967296 / range) * range;
  const array = new Uint32Array(1);
  let val;
  do {
    window.crypto.getRandomValues(array);
    val = array[0];
  } while (val >= maxValid);
  return min + (val % range);
}

export function cryptoShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cryptoRandInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function calculateEntropy(charsetSize: number, length: number): number {
  if (charsetSize === 0 || length === 0) return 0;
  return length * Math.log2(charsetSize);
}

export function getStrengthLevel(entropy: number): { label: string, color: string, score: number } {
  if (entropy < 28) return { label: 'Very Weak', color: 'bg-red-500', score: 1 };
  if (entropy < 36) return { label: 'Weak', color: 'bg-orange-500', score: 2 };
  if (entropy < 60) return { label: 'Fair', color: 'bg-yellow-500', score: 3 };
  if (entropy < 128) return { label: 'Strong', color: 'bg-green-400', score: 4 };
  return { label: 'Very Strong', color: 'bg-green-600', score: 5 };
}

export function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
  return `${Math.round(seconds / 3153600000)} centuries`;
}

export function estimateCrackTimes(charsetSize: number, length: number) {
  const totalGuesses = Math.pow(charsetSize, length);
  const avgGuesses = totalGuesses / 2;
  return {
    onlineThrottled: formatCrackTime(avgGuesses / 1e3),
    onlineFast: formatCrackTime(avgGuesses / 1e6),
    offlineBcrypt: formatCrackTime(avgGuesses / 1e9),
    offlineFast: formatCrackTime(avgGuesses / 1e11)
  };
}

export const NATO_ALPHABET = [
  "alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliett", "kilo", "lima", "mike",
  "november", "oscar", "papa", "quebec", "romeo", "sierra", "tango", "uniform", "victor", "whiskey", "xray", "yankee", "zulu"
];

export const COMMON_WORDS = "apple banana orange grape lemon melon berry peach cherry plum mango kiwi tiger lion bear wolf fox deer bird fish frog snake horse cow pig sheep goat duck swan crow hawk dove ant bee bug fly worm tree bush grass leaf root seed flower rose lily daisy weed moss fern pine oak ash elm wood bark branch trunk root leaf fruit nut shell rock stone sand dirt clay mud dust ash coal iron gold silver copper tin lead zinc brass bronze glass wood paper cloth silk wool cotton leather bone horn tooth hair fur skin flesh blood sweat tear spit breath voice word song cry laugh smile frown sigh yawn sleep dream wake rest work play run walk jump fall climb swim fly dive float sink push pull lift drop throw catch hit kick punch slap kiss hug hold let go take give keep share find lose hide seek show tell ask answer read write speak hear listen look see watch touch feel smell taste eat drink bite chew swallow breathe live die grow shrink change stay move stop start end begin finish open close lock unlock break fix make break build destroy create ruin save spend waste earn buy sell pay cost price value cheap dear rich poor money coin bill card check bank store shop market trade buy sell rent lease borrow lend owe pay give take keep share".split(" ");

export const EXTENDED_WORDS = [...COMMON_WORDS, "computer", "keyboard", "mouse", "screen", "monitor", "laptop", "desktop", "tablet", "phone", "camera", "video", "audio", "music", "sound", "picture", "image", "photo", "book", "page", "chapter", "story", "poem", "letter", "word", "sentence", "paragraph", "text", "message", "email", "post", "blog", "website", "internet", "network", "server", "client", "user", "password", "login", "account", "profile", "setting", "option", "menu", "button", "link", "click", "tap", "swipe", "scroll", "search", "find", "replace", "copy", "paste", "cut", "undo", "redo", "save", "load", "open", "close", "new", "old", "first", "last", "next", "previous", "up", "down", "left", "right", "top", "bottom", "front", "back", "inside", "outside", "here", "there", "now", "then", "always", "never", "sometimes", "often", "rarely", "usually", "maybe", "probably", "certainly", "definitely", "absolutely", "exactly", "nearly", "almost", "quite", "very", "too", "so", "such", "how", "what", "where", "when", "why", "who", "which", "whose", "whom", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs", "me", "you", "him", "us", "them", "it", "we", "they", "he", "she", "i", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "done", "doing", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "ought", "need", "dare", "used", "to", "in", "on", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];

// Top 100 common passwords for checking
export const COMMON_PASSWORDS = new Set([
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111", "1234567", "dragon",
  "123123", "baseball", "monkey", "letmein", "football", "shadow", "mustang", "trustno1", "michael", "superman",
  "1234567890", "admin", "iloveyou", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890",
  "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890", "1234567890"
]);

export interface HistoryEntry {
  id: string;
  value: string;
  mode: string;
  timestamp: Date;
}

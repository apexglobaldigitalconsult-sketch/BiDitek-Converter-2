import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/50 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* About Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://i.ibb.co/6JwtYnkr/Bid-Itek-converter-light-mode-logo.png" 
                alt="Bi-Dtek Converter" 
                className="h-8 w-auto object-contain block dark:hidden" 
                referrerPolicy="no-referrer" 
              />
              <img 
                src="https://i.ibb.co/Vpj2fw6G/Bid-Itek-converter-dark-mode-logo.png" 
                alt="Bi-Dtek Converter" 
                className="h-8 w-auto object-contain hidden dark:block" 
                referrerPolicy="no-referrer" 
              />
            </Link>
            <p className="text-[14px] text-primary/70 font-body leading-relaxed mb-6 max-w-sm">
              Bi-Dtek Converter is your comprehensive platform for all essential tools, calculators, and converters. We provide accurate, fast, and easy-to-use utilities for everyday tasks.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-surface-container text-primary/60 hover:text-secondary hover:bg-secondary/10 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-surface-container text-primary/60 hover:text-secondary hover:bg-secondary/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-surface-container text-primary/60 hover:text-secondary hover:bg-secondary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-surface-container text-primary/60 hover:text-secondary hover:bg-secondary/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <h3 className="font-headline font-bold text-[14px] text-primary mb-6">Tools</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">All Tools</Link></li>
              <li><Link to="/popular" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Popular Tools</Link></li>
              <li><Link to="/calculators" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Calculators</Link></li>
              <li><Link to="/converters" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Converters</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-headline font-bold text-[14px] text-primary mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">About Us</Link></li>
              <li><Link to="/contact" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Contact Us</Link></li>
              <li><Link to="/blog" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Blog</Link></li>
              <li><Link to="/sitemap" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Sitemap</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-headline font-bold text-[14px] text-primary mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">FAQs</Link></li>
              <li><Link to="/help" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Help Center</Link></li>
              <li><Link to="/feedback" className="text-[14px] text-primary/70 hover:text-secondary transition-colors font-body">Report a Bug / Feedback</Link></li>
            </ul>
          </div>

        </div>

        {/* Legal & Bottom Bar */}
        <div className="pt-8 border-t border-outline-variant/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-primary/60 font-body">
            <Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-secondary transition-colors">Terms of Use</Link>
            <Link to="/cookie-policy" className="hover:text-secondary transition-colors">Cookie Policy</Link>
            <Link to="/disclaimer" className="hover:text-secondary transition-colors">Disclaimer</Link>
            <Link to="/accessibility" className="hover:text-secondary transition-colors">Accessibility Statement</Link>
          </div>
          <div className="text-[14px] text-primary/60 font-body whitespace-nowrap">
            &copy; {currentYear} Bi-Dtek Converter. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

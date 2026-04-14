import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface StaticPageProps {
  title: string;
  content: React.ReactNode;
}

export default function StaticPage({ title, content }: StaticPageProps) {
  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">{title}</span>
      </nav>

      <div className="mb-16">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">{title}</h1>
      </div>

      <div className="max-w-none font-body text-primary/80 leading-relaxed space-y-6 text-lg">
        {content}
      </div>
    </div>
  );
}

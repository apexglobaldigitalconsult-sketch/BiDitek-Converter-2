import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Search, 
  Repeat,
  Calculator,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Ruler,
  Wallet,
  Cake,
  FileText,
  DollarSign,
  Divide,
  Monitor
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../lib/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Converters', path: '/converters', icon: Repeat },
    { name: 'Calculators', path: '/calculators', icon: Calculator },
  ];

  const [isConvertersOpen, setIsConvertersOpen] = React.useState(true);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = React.useState(true);

  const convertersItems = [
    { name: 'File Converter', path: '/converters' },
    { name: 'Unit Converter', path: '/converters' },
  ];

  const calculatorsCategories = [
    {
      name: 'Financial',
      items: [
        { name: 'Mortgage Calculator', path: '/calculators/mortgage' },
        { name: 'Loan Calculator', path: '/calculators/loan' },
        { name: 'Auto Loan Calculator', path: '/calculators/auto-loan' },
        { name: 'Interest Calculator', path: '/calculators/interest' },
        { name: 'Payment Calculator', path: '/calculators/payment' },
        { name: 'Retirement Calculator', path: '/calculators/retirement' },
        { name: 'Amortization Calculator', path: '/calculators/amortization' },
        { name: 'Investment Calculator', path: '/calculators/investment' },
        { name: 'Inflation Calculator', path: '/calculators/inflation' },
        { name: 'Finance Calculator', path: '/calculators/finance' },
        { name: 'Income Tax Calculator', path: '/calculators/income-tax' },
        { name: 'Compound Interest Calculator', path: '/calculators/compound-interest' },
        { name: 'Salary Calculator', path: '/calculators/salary' },
        { name: 'Interest Rate Calculator', path: '/calculators/interest-rate' },
        { name: 'Sales Tax Calculator', path: '/calculators/sales-tax' },
      ]
    },
    {
      name: 'Fitness & Health',
      items: [
        { name: 'BMI Calculator', path: '/calculators/bmi' },
        { name: 'Calorie Calculator', path: '/calculators/calorie' },
        { name: 'Body Fat Calculator', path: '/calculators/body-fat' },
        { name: 'BMR Calculator', path: '/calculators/bmr' },
        { name: 'Ideal Weight Calculator', path: '/calculators/ideal-weight' },
        { name: 'Pace Calculator', path: '/calculators/pace' },
        { name: 'Pregnancy Calculator', path: '/calculators/pregnancy' },
        { name: 'Pregnancy Conception', path: '/calculators/conception' },
        { name: 'Due Date Calculator', path: '/calculators/due-date' },
      ]
    },
    {
      name: 'Math',
      items: [
        { name: 'Scientific Calculator', path: '/calculators/scientific' },
        { name: 'Fraction Calculator', path: '/calculators/fraction' },
        { name: 'Percentage Calculator', path: '/calculators/percentage' },
        { name: 'Random Number Generator', path: '/calculators/random' },
        { name: 'Triangle Calculator', path: '/calculators/triangle' },
        { name: 'Standard Deviation', path: '/calculators/std-dev' },
      ]
    },
    {
      name: 'Other',
      items: [
        { name: 'Age Calculator', path: '/calculators/age' },
        { name: 'Date Calculator', path: '/calculators/date' },
        { name: 'Time Calculator', path: '/calculators/time' },
        { name: 'GPA Calculator', path: '/calculators/gpa' },
        { name: 'Grade Calculator', path: '/calculators/grade' },
        { name: 'Concrete Calculator', path: '/calculators/concrete' },
        { name: 'Subnet Calculator', path: '/calculators/subnet' },
        { name: 'Password Generator', path: '/calculators/password' },
        { name: 'Conversion Calculator', path: '/calculators/conversion' },
      ]
    }
  ];

  const [openCategories, setOpenCategories] = React.useState<string[]>(['Financial', 'Fitness & Health', 'Math', 'Other']);

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-primary transition-colors duration-300 font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-[280px] fixed inset-y-0 left-0 bg-sidebar-bg text-sidebar-text z-50 overflow-y-auto no-scrollbar">
        <div className="px-8 py-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            J
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary dark:text-white">
            Jobie
          </span>
        </div>
        
        <nav className="flex-1 space-y-2 mt-4 pl-6">
          {/* Dashboard Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-6 py-4 text-base font-medium transition-all relative rounded-l-full",
                isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
              )
            }
          >
            <Calculator className="w-5 h-5" />
            Dashboard
          </NavLink>

          {/* Converters Section */}
          <div className="pt-2">
            <button 
              onClick={() => setIsConvertersOpen(!isConvertersOpen)}
              className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-sidebar-text-muted hover:text-primary dark:hover:text-secondary transition-colors group rounded-l-full"
            >
              <div className="flex items-center gap-4">
                <Repeat className="w-5 h-5" />
                <span>Converters</span>
              </div>
              {isConvertersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence initial={false}>
              {isConvertersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {convertersItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center pl-[3.25rem] pr-6 py-3 text-sm font-medium transition-all relative rounded-l-full",
                          isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calculators Section */}
          <div className="pt-2">
            <button 
              onClick={() => setIsCalculatorsOpen(!isCalculatorsOpen)}
              className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-sidebar-text-muted hover:text-primary dark:hover:text-secondary transition-colors group rounded-l-full"
            >
              <div className="flex items-center gap-4">
                <Calculator className="w-5 h-5" />
                <span>Calculators</span>
              </div>
              {isCalculatorsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence initial={false}>
              {isCalculatorsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {calculatorsCategories.map((category) => (
                    <div key={category.name} className="mb-2">
                      <button 
                        onClick={() => toggleCategory(category.name)}
                        className="w-full flex items-center justify-between pl-[3.25rem] pr-6 py-2 text-xs font-bold uppercase tracking-wider text-sidebar-text-muted/70 hover:text-primary dark:hover:text-secondary transition-colors"
                      >
                        {category.name}
                        {openCategories.includes(category.name) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      <AnimatePresence initial={false}>
                        {openCategories.includes(category.name) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {category.items.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                  cn(
                                    "flex items-center pl-16 pr-6 py-2.5 text-sm font-medium transition-all relative rounded-l-full",
                                    isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
                                  )
                                }
                              >
                                {item.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <div className="text-xs text-sidebar-text-muted/70 mb-2">
            BiDitek Converter Dashboard<br/>
            © 2024 All Rights Reserved
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px]">
        {/* Top Navigation Bar */}
        <header className="w-full sticky top-0 z-40 bg-background/80 backdrop-blur-md h-[100px] flex items-center justify-between px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary hidden md:block">Dashboard</h1>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="w-full flex items-center bg-surface-container-low shadow-sm px-6 py-3.5 rounded-full border border-outline-variant/50 focus-within:shadow-md focus-within:border-secondary/30 transition-all">
              <Search className="w-5 h-5 text-primary/40" />
              <input 
                type="text" 
                placeholder="Search something here..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-body placeholder:text-primary/40 ml-3 text-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-surface-container-low border border-outline-variant/50 text-primary/60 hover:text-secondary hover:shadow-sm transition-all relative"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button className="p-3 rounded-full bg-surface-container-low border border-outline-variant/50 text-primary/60 hover:text-secondary hover:shadow-sm transition-all relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface-container-low">18</span>
            </button>
            <button className="p-3 rounded-full bg-surface-container-low border border-outline-variant/50 text-primary/60 hover:text-secondary hover:shadow-sm transition-all relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface-container-low">52</span>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-primary">Oda Dink</div>
                <div className="text-[10px] text-primary/50">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oda" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 lg:p-10 pt-4">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar-bg text-sidebar-text shadow-2xl lg:hidden overflow-y-auto"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  J
                </div>
                <span className="text-xl font-bold text-primary dark:text-white">
                  Jobie
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-primary/70 hover:text-primary dark:text-white/70 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Repeat mobile nav items similar to desktop sidebar */}
            <nav className="flex-1 space-y-1 mt-4 pl-4">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-6 py-4 text-base font-medium transition-all relative rounded-l-full",
                    isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
                  )
                }
              >
                <Calculator className="w-5 h-5" />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/converters"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-6 py-4 text-base font-medium transition-all relative rounded-l-full",
                    isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
                  )
                }
              >
                <Repeat className="w-5 h-5" />
                Converters
              </NavLink>

              <NavLink
                to="/calculators"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-6 py-4 text-base font-medium transition-all relative rounded-l-full",
                    isActive ? "bg-surface-container-low text-secondary dark:bg-secondary/10" : "text-sidebar-text-muted hover:text-primary dark:hover:text-secondary"
                  )
                }
              >
                <Calculator className="w-5 h-5" />
                Calculators
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setMounted(true);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className={cn(
      'min-h-screen w-full flex flex-col transition-opacity duration-500',
      !mounted && 'opacity-0',
      mounted && 'opacity-100',
      className
    )}>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card bg-background/80 backdrop-blur-sm border-b border-border/40 mx-4 mt-4 sm:mx-8 rounded-xl">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-real-estate-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <span className="text-lg font-medium">REALinsight</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {isHomePage ? (
              <>
                <a href="#features" className="text-sm hover:text-real-estate-600 transition-colors">Features</a>
                <Link to="/analysis" className="text-sm hover:text-real-estate-600 transition-colors">Contract Analysis</Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm hover:text-real-estate-600 transition-colors">Home</Link>
                <Link to="/analysis" className="text-sm hover:text-real-estate-600 transition-colors">Contract Analysis</Link>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-2">
            <Link to="/analysis" className="text-xs sm:text-sm font-medium bg-real-estate-600 text-white px-3 py-1.5 rounded-md hover:bg-real-estate-700 transition-colors">
              Analyze Contract
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
      
      <footer className="border-t border-border/40 py-8 bg-secondary/50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-real-estate-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <span className="text-lg font-medium">REALinsight</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered real estate due diligence and underwriting assistant.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                {isHomePage ? (
                  <>
                    <li><a href="#features" className="text-muted-foreground hover:text-real-estate-600 transition-colors">Features</a></li>
                    <li><Link to="/analysis" className="text-muted-foreground hover:text-real-estate-600 transition-colors">Contract Analysis</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/" className="text-muted-foreground hover:text-real-estate-600 transition-colors">Home</Link></li>
                    <li><Link to="/analysis" className="text-muted-foreground hover:text-real-estate-600 transition-colors">Contract Analysis</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>123 Real Estate Avenue</p>
                <p>San Francisco, CA 94103</p>
                <p>contact@realinsight.ai</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-sm text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} REALinsight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

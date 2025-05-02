import React from 'react';
import { CustomButton } from './ui/CustomButton';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pb-16">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-real-estate-100/60 rounded-full blur-3xl" />
        <div className="absolute top-[30%] -left-[5%] w-[30%] h-[40%] bg-real-estate-100/60 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 pt-16 pb-8 flex flex-col items-center">
        {/* Pill Label */}
        <div className="animate-on-scroll animate-fade-in-up mb-6 backdrop-blur-sm py-1.5 px-4 rounded-full bg-white/70 border border-border shadow-sm text-xs font-medium text-foreground/80">
          AI-Powered Contract Analysis
        </div>
        
        {/* Main Heading */}
        <h1 className="animate-on-scroll animate-fade-in-up text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl">
          <span className="gradient-text">AI contract analysis</span> for Real Estate investors
        </h1>
        
        {/* Subheading */}
        <p className="animate-on-scroll animate-fade-in-up text-center text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Streamline your contract review with advanced AI that performs thorough analysis and identifies key terms in minutes, not days.
        </p>
        
        {/* CTA Button */}
        <div className="animate-on-scroll animate-fade-in-up flex flex-col sm:flex-row gap-4 mb-12">
          <Link to="/analysis">
            <CustomButton variant="accent" size="xl" className="rounded-lg">
              Analyze Contract
            </CustomButton>
          </Link>
        </div>
        
        {/* Stats */}
        <div className="animate-on-scroll animate-fade-in-up w-full glass-card p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center p-2">
            <p className="text-3xl md:text-4xl font-bold mb-1 text-real-estate-600">98%</p>
            <p className="text-sm text-muted-foreground">Accuracy Rate</p>
          </div>
          <div className="text-center p-2">
            <p className="text-3xl md:text-4xl font-bold mb-1 text-real-estate-600">10x</p>
            <p className="text-sm text-muted-foreground">Faster Analysis</p>
          </div>
          <div className="text-center p-2">
            <p className="text-3xl md:text-4xl font-bold mb-1 text-real-estate-600">500+</p>
            <p className="text-sm text-muted-foreground">Contract Terms</p>
          </div>
          <div className="text-center p-2">
            <p className="text-3xl md:text-4xl font-bold mb-1 text-real-estate-600">$2M+</p>
            <p className="text-sm text-muted-foreground">Saved for Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

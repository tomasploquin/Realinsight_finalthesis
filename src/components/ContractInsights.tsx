
import React from 'react';
import { FileText, Shield, Info, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContractInsights = () => {
  const insights = [
    {
      icon: <FileText className="w-12 h-12 text-real-estate-600" />,
      title: "Smart Document Processing",
      description: "Upload your real estate contracts and get instant analysis powered by advanced AI technology."
    },
    {
      icon: <Shield className="w-12 h-12 text-real-estate-600" />,
      title: "Risk Assessment",
      description: "Identify potential risks and obligations in your contracts with our comprehensive analysis system."
    },
    {
      icon: <Info className="w-12 h-12 text-real-estate-600" />,
      title: "Key Terms Extraction",
      description: "Automatically extract and summarize critical contract terms, conditions, and important dates."
    },
    {
      icon: <FileCheck className="w-12 h-12 text-real-estate-600" />,
      title: "Compliance Check",
      description: "Ensure your contracts comply with legal requirements and industry standards."
    }
  ];

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Instant Contract Insights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered analysis tool helps you understand complex real estate contracts in minutes, saving you time and reducing risks.
          </p>
          <div className="mt-6">
            <Link
              to="/risks"
              className="inline-flex items-center text-real-estate-600 hover:text-real-estate-700"
            >
              <Shield className="w-5 h-5 mr-2" />
              View Detailed Risk Analysis
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 hover:border-real-estate-600/50 transition-colors"
            >
              <div className="mb-4">
                {insight.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
              <p className="text-muted-foreground">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContractInsights;

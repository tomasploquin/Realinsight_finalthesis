
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ContractRisks from '@/components/ContractRisks';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Risks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we have analysis data, if not show a toast and redirect
  useEffect(() => {
    if (!location.state?.analysisData && !location.state?.risks) {
      toast({
        title: "No contract analysis data",
        description: "Please analyze a contract first to view risk details",
        variant: "destructive",
      });
      
      // Give the toast time to appear before redirecting
      const timer = setTimeout(() => {
        navigate('/analysis');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate]);

  return (
    <Layout>
      <ContractRisks />
    </Layout>
  );
};

export default Risks;

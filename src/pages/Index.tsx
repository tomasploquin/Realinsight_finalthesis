
import React from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ContractInsights from '@/components/ContractInsights';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ContractInsights />
      <Features />
    </Layout>
  );
};

export default Index;

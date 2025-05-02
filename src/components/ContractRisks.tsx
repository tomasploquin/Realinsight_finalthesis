
import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useLocation } from 'react-router-dom';

export interface RiskFactor {
  name: string;
  level: 'Low' | 'Medium' | 'High';
  description?: string;
  impact?: string;
  mitigation?: string;
  score?: number;
}

export interface ContractTermItem {
  name: string;
  exists: boolean;
  favorable: 'Favorable' | 'Neutral' | 'Unfavorable';
  details: string;
}

export interface ContractAnalysisData {
  propertyScore: number;
  contractTerms: {
    terminationClauses: ContractTermItem;
    contingencies: ContractTermItem;
    paymentStructure: ContractTermItem;
    liabilityProvisions: ContractTermItem;
  };
  riskFactors: RiskFactor[];
}

// Sample risks to use if no data is passed
const sampleRisks: RiskFactor[] = [
  {
    name: 'Payment Terms',
    level: 'High',
    description: 'Late payment penalties exceed industry standards',
    impact: 'Potential financial strain if payment deadlines are missed',
    mitigation: 'Negotiate more favorable payment terms and grace periods'
  },
  {
    name: 'Liability Clauses',
    level: 'Medium',
    description: 'Broad indemnification requirements',
    impact: 'Increased exposure to third-party claims',
    mitigation: 'Add specific exclusions and liability caps'
  },
  {
    name: 'Termination Rights',
    level: 'Low',
    description: 'Standard notice period requirements',
    impact: 'Sufficient time to plan for contract end',
    mitigation: 'Monitor renewal deadlines and maintain documentation'
  }
];

// Function to convert API data to risk factors
const convertAnalysisToRiskFactors = (analysisData: ContractAnalysisData): RiskFactor[] => {
  // Start with the risk factors directly from the analysis
  const apiRiskFactors = analysisData.riskFactors.map(risk => ({
    name: risk.name,
    level: risk.level,
    description: risk.name, // Use name as description if none provided
    impact: `Risk score: ${risk.score}/100`, // Show risk score as impact
    mitigation: 'Consult with legal advisor for specific mitigation strategies'
  }));
  
  // Add contract terms with unfavorable conditions as additional risk factors
  const contractTermRisks: RiskFactor[] = [];
  const terms = analysisData.contractTerms;
  
  if (terms.terminationClauses.favorable === 'Unfavorable') {
    contractTermRisks.push({
      name: 'Termination Clauses',
      level: 'High',
      description: terms.terminationClauses.details,
      impact: 'Difficulty terminating contract or high penalties for early termination',
      mitigation: 'Review and negotiate termination provisions before signing'
    });
  }
  
  if (terms.contingencies.favorable === 'Unfavorable') {
    contractTermRisks.push({
      name: 'Insufficient Contingencies',
      level: 'High',
      description: terms.contingencies.details,
      impact: 'Limited protection if conditions are not met',
      mitigation: 'Add necessary contingency clauses before proceeding'
    });
  }
  
  if (terms.paymentStructure.favorable === 'Unfavorable') {
    contractTermRisks.push({
      name: 'Payment Structure Issues',
      level: 'Medium',
      description: terms.paymentStructure.details,
      impact: 'Potential cash flow challenges or excessive upfront payments',
      mitigation: 'Negotiate payment terms to align with industry standards'
    });
  }
  
  if (terms.liabilityProvisions.favorable === 'Unfavorable') {
    contractTermRisks.push({
      name: 'Liability Concerns',
      level: 'High',
      description: terms.liabilityProvisions.details,
      impact: 'Increased exposure to financial or legal liabilities',
      mitigation: 'Seek liability caps and more balanced allocation of responsibility'
    });
  }
  
  // Combine API risk factors with contract term risks
  return [...apiRiskFactors, ...contractTermRisks];
};

const ContractRisks = () => {
  const location = useLocation();
  let risks: RiskFactor[] = sampleRisks;
  
  // Check if analysis data was passed through location state
  if (location.state?.analysisData) {
    const analysisData: ContractAnalysisData = location.state.analysisData;
    risks = convertAnalysisToRiskFactors(analysisData);
  } else if (location.state?.risks) {
    // Backward compatibility with old format
    risks = location.state.risks;
  }
  
  return (
    <section className="py-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-real-estate-600 mr-4" />
            <h1 className="text-4xl font-bold">Contract Risk Analysis</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Detailed breakdown of identified risks and recommended actions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Key Risk Indicators</h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Category</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Potential Impact</TableHead>
                  <TableHead>Recommended Mitigation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{risk.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        risk.level === 'High' ? 'bg-red-100 text-red-800' :
                        risk.level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {risk.level}
                      </span>
                    </TableCell>
                    <TableCell>{risk.description || risk.name}</TableCell>
                    <TableCell>{risk.impact || 'Not specified'}</TableCell>
                    <TableCell>{risk.mitigation || 'Consult legal advisor'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractRisks;

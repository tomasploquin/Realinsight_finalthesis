import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from './ui/CustomButton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileText, Shield, AlertCircle, ClipboardPaste } from 'lucide-react';
import { sendMessageToOpenAI } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ContractTerm {
  name: string;
  exists: boolean;
  favorable: 'Favorable' | 'Neutral' | 'Unfavorable';
  details: string;
}

interface RiskFactor {
  name: string;
  level: 'Low' | 'Medium' | 'High';
  score: number;
}

interface ContractAnalysis {
  propertyScore: number;
  contractTerms: {
    terminationClauses: ContractTerm;
    contingencies: ContractTerm;
    paymentStructure: ContractTerm;
    liabilityProvisions: ContractTerm;
  };
  riskFactors: RiskFactor[];
}

const MessageBubble: React.FC<{
  message: string;
  isUser: boolean;
  timestamp: string;
}> = ({ message, isUser, timestamp }) => {
  return (
    <div className={cn(
      "flex flex-col mb-4",
      isUser ? "items-end" : "items-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-real-estate-600 text-white rounded-tr-none" 
          : "bg-white shadow-sm border border-border rounded-tl-none"
      )}>
        {message}
      </div>
      <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
    </div>
  );
};

const initialConversation = [
  {
    message: "Hello! I'm your Contract Analyst powered by AI. Paste your contract text, and I'll analyze it for you or ask me specific questions about contract terms.",
    isUser: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const sampleAnalysisData: ContractAnalysis = {
  propertyScore: 78,
  contractTerms: {
    terminationClauses: {
      name: 'Termination Clauses',
      exists: true,
      favorable: "Neutral",
      details: "60-day notice required for early termination"
    },
    contingencies: {
      name: 'Contingencies',
      exists: true,
      favorable: "Favorable",
      details: "Financing and inspection contingencies included"
    },
    paymentStructure: {
      name: 'Payment Structure',
      exists: true,
      favorable: "Favorable",
      details: "30% deposit, 70% upon completion"
    },
    liabilityProvisions: {
      name: 'Liability Provisions',
      exists: true,
      favorable: "Unfavorable",
      details: "High liability exposure for buyer"
    }
  },
  riskFactors: [
    { name: 'Early Termination Risk', level: 'Low', score: 15 },
    { name: 'Legal Exposure', level: 'Medium', score: 45 },
    { name: 'Payment Security', level: 'Low', score: 18 },
    { name: 'Contingency Protection', level: 'High', score: 72 }
  ]
};

const AIAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(initialConversation);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [contractContent, setContractContent] = useState<string | null>(null);
  const [isPasting, setIsPasting] = useState(true);
  const [pastedContent, setPastedContent] = useState('');
  const [analysisData, setAnalysisData] = useState<ContractAnalysis | null>(null);
  const { toast } = useToast();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = {
      message: message.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      console.log('Starting chat interaction...');
      
      const messages: ChatMessage[] = conversation.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.message
      }));
      
      messages.push({
        role: 'user',
        content: userMessage.message
      });
      
      console.log('Prepared messages for API:', messages);
      
      const response = await sendMessageToOpenAI(messages, contractContent || undefined);
      console.log('Received API response:', response);
      
      setConversation(prev => [...prev, response]);
      
      if (response.message.toLowerCase().includes('analysis') || 
          response.message.toLowerCase().includes('report') || 
          response.message.toLowerCase().includes('assessment')) {
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const extractContractAnalysis = async (contract: string): Promise<ContractAnalysis> => {
    try {
      const prompt = `
        You are an experienced legal consultant specializing in real estate contracts. 
        Analyze the following contract and provide a detailed assessment in the exact JSON format specified below:
        
        1. Extract key contract terms including termination clauses, contingencies, payment structure, and liability provisions
        2. Evaluate each term as "Favorable", "Neutral", or "Unfavorable" from the buyer's perspective
        3. Provide a brief explanation for each term
        4. Identify key risk factors and assign risk levels (Low, Medium, High) and numerical risk scores (0-100)
        5. Calculate an overall contract score (0-100) where higher is better
        
        The contract to analyze:
        ${contract.substring(0, 3000)}
        
        Respond ONLY with a JSON object in this exact format:
        {
          "propertyScore": number,
          "contractTerms": {
            "terminationClauses": {
              "name": "Termination Clauses",
              "exists": boolean,
              "favorable": "Favorable" | "Neutral" | "Unfavorable",
              "details": "string explanation"
            },
            "contingencies": {
              "name": "Contingencies",
              "exists": boolean,
              "favorable": "Favorable" | "Neutral" | "Unfavorable",
              "details": "string explanation"
            },
            "paymentStructure": {
              "name": "Payment Structure",
              "exists": boolean,
              "favorable": "Favorable" | "Neutral" | "Unfavorable",
              "details": "string explanation"
            },
            "liabilityProvisions": {
              "name": "Liability Provisions",
              "exists": boolean,
              "favorable": "Favorable" | "Neutral" | "Unfavorable",
              "details": "string explanation"
            }
          },
          "riskFactors": [
            {
              "name": "string",
              "level": "Low" | "Medium" | "High",
              "score": number
            }
            // Multiple risk factors
          ]
        }
      `;
      
      const response = await sendMessageToOpenAI([{
        role: 'user',
        content: prompt
      }]);
      
      try {
        const jsonMatch = response.message.match(/```json\s*([\s\S]*?)\s*```/) || 
                          response.message.match(/{[\s\S]*?}/);
                          
        const jsonString = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : response.message;
        const analysisData = JSON.parse(jsonString);
        
        // Add name properties if they're missing (for backward compatibility)
        if (!analysisData.contractTerms.terminationClauses.name) {
          analysisData.contractTerms.terminationClauses.name = "Termination Clauses";
        }
        if (!analysisData.contractTerms.contingencies.name) {
          analysisData.contractTerms.contingencies.name = "Contingencies";
        } 
        if (!analysisData.contractTerms.paymentStructure.name) {
          analysisData.contractTerms.paymentStructure.name = "Payment Structure";
        }
        if (!analysisData.contractTerms.liabilityProvisions.name) {
          analysisData.contractTerms.liabilityProvisions.name = "Liability Provisions";
        }
        
        return analysisData;
      } catch (error) {
        console.error('Error parsing analysis data:', error);
        return sampleAnalysisData;
      }
    } catch (error) {
      console.error('Error generating contract analysis:', error);
      return sampleAnalysisData;
    }
  };

  const handleContractPaste = async () => {
    if (!pastedContent.trim()) {
      toast({
        title: "Error",
        description: "Please paste some contract text first.",
        variant: "destructive",
      });
      return;
    }

    setContractContent(pastedContent);
    setIsPasting(false);
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const systemMessage = {
      message: "Contract text received. I'll analyze it now.",
      isUser: false,
      timestamp
    };
    
    setConversation(prev => [...prev, systemMessage]);
    
    setIsTyping(true);
    try {
      const contractAnalysis = await extractContractAnalysis(pastedContent);
      setAnalysisData(contractAnalysis);
      
      const response = await sendMessageToOpenAI([{
        role: 'system',
        content: `You are a legal expert specializing in real estate contracts. Analyze this contract and provide a brief, professional summary of the key points, focusing on important terms and potential risks. Be concise but highlight critical issues a client should know about:`
      }, {
        role: 'user',
        content: `Please analyze this contract and provide a brief summary: ${pastedContent.substring(0, 1000)}...`
      }]);
      
      setConversation(prev => [...prev, response]);
      setShowAnalysis(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the contract. Please try again.",
        variant: "destructive",
      });
      console.error('Error analyzing pasted contract:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="analysis" className="py-20 bg-gradient-to-b from-background to-real-estate-50/30">
      <div className="container px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll animate-fade-in-up">
            AI-Powered Contract Analysis
          </h2>
          <p className="text-muted-foreground animate-on-scroll animate-fade-in-up">
            Paste your real estate contracts and interact with our GPT-4 powered assistant for insights and risk analysis.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 animate-on-scroll animate-fade-in-up">
            <div className="glass-card overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-border bg-white/80">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-real-estate-600 flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Contract Analyzer</h3>
                    <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-white/80 border-b border-border">
                <div className="flex items-center gap-2">
                  {isPasting && (
                    <div className="w-full space-y-2">
                      <Textarea
                        placeholder="Paste your contract text here..."
                        className="min-h-[100px] bg-white"
                        value={pastedContent}
                        onChange={(e) => setPastedContent(e.target.value)}
                      />
                      <CustomButton
                        onClick={handleContractPaste}
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        Analyze Contract
                      </CustomButton>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Paste your contract text and click 'Analyze' to get instant insights
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-real-estate-50/50">
                {conversation.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    message={msg.message}
                    isUser={msg.isUser}
                    timestamp={msg.timestamp}
                  />
                ))}
                
                {isTyping && (
                  <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-real-estate-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-real-estate-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-real-estate-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <span>GPT-4 is processing...</span>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white/80">
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about specific contract terms, potential risks, or request a summary..."
                      className="resize-none bg-white h-12 py-3"
                    />
                    <CustomButton 
                      type="submit" 
                      variant="primary"
                      className="shrink-0"
                      disabled={isTyping || !message.trim()}
                    >
                      Send
                    </CustomButton>
                  </div>
                  {showAnalysis && (
                    <CustomButton
                      onClick={() => navigate('/risks', { state: { analysisData } })}
                      variant="accent"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      View Detailed Risk Analysis
                    </CustomButton>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try asking: "What are the termination clauses?" or "Explain the liability provisions"
                </p>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 animate-on-scroll animate-fade-in-up">
            <div className={cn(
              "glass-card p-6 h-[600px] overflow-y-auto scrollbar-thin transition-all duration-500",
              showAnalysis ? "opacity-100" : "opacity-50"
            )}>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">Contract Analysis</h3>
                <p className="text-sm text-muted-foreground">Legal Assessment</p>
              </div>
              
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={
                        (analysisData?.propertyScore || sampleAnalysisData.propertyScore) > 70 ? "#22c55e" : 
                        (analysisData?.propertyScore || sampleAnalysisData.propertyScore) > 40 ? "#f59e0b" : "#ef4444"
                      }
                      strokeWidth="10"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * (analysisData?.propertyScore || sampleAnalysisData.propertyScore)) / 100}
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{analysisData?.propertyScore || sampleAnalysisData.propertyScore}</span>
                </div>
                <p className="text-sm font-medium mt-2">Contract Score</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 mb-4 border border-border">
                <h4 className="text-md font-semibold mb-3">Key Contract Terms</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Termination Clauses</span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        (analysisData?.contractTerms.terminationClauses.favorable || sampleAnalysisData.contractTerms.terminationClauses.favorable) === "Favorable" && "bg-green-100 text-green-800",
                        (analysisData?.contractTerms.terminationClauses.favorable || sampleAnalysisData.contractTerms.terminationClauses.favorable) === "Neutral" && "bg-amber-100 text-amber-800",
                        (analysisData?.contractTerms.terminationClauses.favorable || sampleAnalysisData.contractTerms.terminationClauses.favorable) === "Unfavorable" && "bg-red-100 text-red-800"
                      )}>
                        {analysisData?.contractTerms.terminationClauses.favorable || sampleAnalysisData.contractTerms.terminationClauses.favorable}
                      </span>
                    </div>
                    <p className="text-xs">{analysisData?.contractTerms.terminationClauses.details || sampleAnalysisData.contractTerms.terminationClauses.details}</p>
                  </div>
                  
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Contingencies</span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        (analysisData?.contractTerms.contingencies.favorable || sampleAnalysisData.contractTerms.contingencies.favorable) === "Favorable" && "bg-green-100 text-green-800",
                        (analysisData?.contractTerms.contingencies.favorable || sampleAnalysisData.contractTerms.contingencies.favorable) === "Neutral" && "bg-amber-100 text-amber-800",
                        (analysisData?.contractTerms.contingencies.favorable || sampleAnalysisData.contractTerms.contingencies.favorable) === "Unfavorable" && "bg-red-100 text-red-800"
                      )}>
                        {analysisData?.contractTerms.contingencies.favorable || sampleAnalysisData.contractTerms.contingencies.favorable}
                      </span>
                    </div>
                    <p className="text-xs">{analysisData?.contractTerms.contingencies.details || sampleAnalysisData.contractTerms.contingencies.details}</p>
                  </div>
                  
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Payment Structure</span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        (analysisData?.contractTerms.paymentStructure.favorable || sampleAnalysisData.contractTerms.paymentStructure.favorable) === "Favorable" && "bg-green-100 text-green-800",
                        (analysisData?.contractTerms.paymentStructure.favorable || sampleAnalysisData.contractTerms.paymentStructure.favorable) === "Neutral" && "bg-amber-100 text-amber-800",
                        (analysisData?.contractTerms.paymentStructure.favorable || sampleAnalysisData.contractTerms.paymentStructure.favorable) === "Unfavorable" && "bg-red-100 text-red-800"
                      )}>
                        {analysisData?.contractTerms.paymentStructure.favorable || sampleAnalysisData.contractTerms.paymentStructure.favorable}
                      </span>
                    </div>
                    <p className="text-xs">{analysisData?.contractTerms.paymentStructure.details || sampleAnalysisData.contractTerms.paymentStructure.details}</p>
                  </div>
                  
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Liability Provisions</span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        (analysisData?.contractTerms.liabilityProvisions.favorable || sampleAnalysisData.contractTerms.liabilityProvisions.favorable) === "Favorable" && "bg-green-100 text-green-800",
                        (analysisData?.contractTerms.liabilityProvisions.favorable || sampleAnalysisData.contractTerms.liabilityProvisions.favorable) === "Neutral" && "bg-amber-100 text-amber-800",
                        (analysisData?.contractTerms.liabilityProvisions.favorable || sampleAnalysisData.contractTerms.liabilityProvisions.favorable) === "Unfavorable" && "bg-red-100 text-red-800"
                      )}>
                        {analysisData?.contractTerms.liabilityProvisions.favorable || sampleAnalysisData.contractTerms.liabilityProvisions.favorable}
                      </span>
                    </div>
                    <p className="text-xs">{analysisData?.contractTerms.liabilityProvisions.details || sampleAnalysisData.contractTerms.liabilityProvisions.details}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 border border-border">
                <h4 className="text-md font-semibold mb-3">Risk Assessment</h4>
                <div className="space-y-3">
                  {(analysisData?.riskFactors || sampleAnalysisData.riskFactors).map((risk, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{risk.name}</span>
                        <span className={cn(
                          "font-medium",
                          risk.level === 'Low' && "text-green-600",
                          risk.level === 'Medium' && "text-amber-500",
                          risk.level === 'High' && "text-red-500"
                        )}>
                          {risk.level}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            risk.level === 'Low' && "bg-green-500",
                            risk.level === 'Medium' && "bg-amber-500",
                            risk.level === 'High' && "bg-red-500"
                          )}
                          style={{ width: `${risk.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-6">
                <CustomButton variant="primary" size="sm">
                  Download Analysis Report
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAnalysis;

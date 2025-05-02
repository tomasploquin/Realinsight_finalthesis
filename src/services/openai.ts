
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: string;
  timestamp: string;
  isUser: boolean;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function sendMessageToOpenAI(
  messages: ChatMessage[],
  contractContext?: string
): Promise<ChatResponse> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('Checking API configuration...');
  console.log('API Key length:', apiKey?.length);
  console.log('API Key first 4 chars:', apiKey?.substring(0, 4));
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please check your .env file.');
  }

  // Modify system message to act as a legal consultant
  const legalConsultantContext = `
    You are an AI-powered legal consultant specializing in real estate contracts and agreements.
    You have expertise in identifying risks, liabilities, and important contract terms.
    Analyze contracts professionally as a legal expert would, highlighting key concerns, favorable terms,
    and potential issues a client should be aware of. Be precise and detail-oriented.
  `;

  // Add enhanced legal context if available
  const conversationMessages = contractContext
    ? [
        {
          role: 'system',
          content: `${legalConsultantContext} Use the following contract context to answer questions: ${contractContext}`,
        },
        ...messages,
      ]
    : [
        {
          role: 'system',
          content: legalConsultantContext,
        },
        ...messages,
      ];

  const requestBody = {
    model: 'gpt-3.5-turbo',  // Using GPT-3.5-Turbo instead of GPT-4
    messages: conversationMessages,
    temperature: 0.7,
    max_tokens: 800, // Increased token limit for more detailed analysis
  };

  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    console.log('Sending request to OpenAI...');
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`, // Added trim() to remove any whitespace
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.text();
    console.log('Raw response:', responseData);
    
    if (!response.ok) {
      let errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(responseData);
        errorMessage = errorJson.error?.message || errorMessage;
        console.error('API Error details:', errorJson);
      } catch (e) {
        console.error('Could not parse error response:', responseData);
        errorMessage += `\n${responseData}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(responseData);
      console.log('Parsed response data:', data);
      const assistantMessage = data.choices[0].message.content;

      return {
        message: assistantMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
      };
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your API key configuration.');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message.includes('500')) {
        throw new Error('OpenAI service is currently experiencing issues. Please try again later.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while calling the OpenAI API');
  }
} 

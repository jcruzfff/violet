import { useCallback, useState } from "react";

interface CopilotResponse {
  success: boolean;
  data?: {
    conversationId: string;
    parts: Array<{
      type: string;
      text: string;
    }>;
  };
  message?: string;
  error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const useCopilot = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const generateCopilotResponse = async ({
    message,
    messages,
    searchEnabled,
  }: {
    message?: any;
    messages?: any;
    searchEnabled?: any;
  }) => {
    console.log("useCopilot: generateCopilotResponse: start", messages);
    const url = `${BASE_URL}/api/copilot/chat`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      const texts = jsonData?.data?.parts
        ?.filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("\n");

      console.log(jsonData?.data);
      return texts || "Sorry, I couldn't process your request.";
    } catch (error) {
      console.error("Copilot API error:", error);
      // Fallback to existing OpenAI logic for now
      return "I'm having trouble connecting to my enhanced knowledge base. Let me try to help you with basic financial advice.";
    }
  };

  const resetConversation = useCallback(() => {
    setConversationId(null);
  }, []);

  return {
    generateCopilotResponse,
    conversationId,
    resetConversation,
  };
}; 
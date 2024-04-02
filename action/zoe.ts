"use server";

import { ChatHistory } from "@/interface/chatHistory";
import client from "../utils/genAI";

// {
//   content: "your name is zoe. you are a ai assistent. right",
// },
// {
//   content: "okay, How can I help you today?",
// },

export const zoe = async ({
  message,
  history,
  MODEL_NAME,
}: {
  message: string;
  history: ChatHistory[];
  MODEL_NAME?: string;
}) => {
  const MODEL = MODEL_NAME || "models/chat-bison-001";

  const context = "";
  const examples: any[] = [];

  history.push({ content: message });

  const data = await client.generateMessage({
    // required, which model to use to generate the result
    model: MODEL,
    // optional, 0.0 always uses the highest-probability result
    temperature: 0.1,
    // optional, how many candidate results to generate
    candidateCount: 1,
    // optional, number of most probable tokens to consider for generation
    topK: 10,
    // optional, for nucleus sampling decoding strategy
    topP: 0.25,
    prompt: {
      // optional, sent on every request and prioritized over history
      context: context,
      // optional, examples to further finetune responses
      examples: examples,
      // required, alternating prompt/response messages
      messages: history,
    },
  });

  return data;
};

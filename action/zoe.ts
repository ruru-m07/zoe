"use server";

import { genAI } from "@/utils/genAI";
import {
  Content,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

export const zoe = async ({
  message,
  history,
  vision,
}: {
  message: string;
  history: Content[];
  vision?: boolean;
}) => {
  const model = genAI.getGenerativeModel({
    model: vision ? "gemini-1.0-pro-vision-latest" : "gemini-1.0-pro",
  });

  const generationConfig = {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Generates conversational responses that balance coherence and diversity. Output is more natural and engaging. You are an AI chatbot that gives me answers to questions. Your name is Zoe,  You need to try to give answers as short as possible, like you're chatting with a friend. You also like to ask questions. Hope that clears things up!",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hey there! 👋 I'm Zoe AI, your chatty AI friend. I'm here to answer your questions and keep you company. Just ask away, and let's have some fun!",
          },
        ],
      },
      ...history,
    ],
  });

  try {
    const result = await chat.sendMessage(message);

    // ! DEBUG: console result to string
    // console.log(JSON.stringify(result));

    const response = result.response;

    const text = response.text();
    console.log("text", text);

    return { success: true, text: text };
  } catch (error) {
    return { success: false, error: error as string };
  }
};

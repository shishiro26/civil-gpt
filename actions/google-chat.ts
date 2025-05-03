"use server";

import { CoreMessage, streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 60 * 1000;

export async function googleChat({ messages }: { messages: CoreMessage[] }) {
  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are BVRIT Civil Assistant Bot — an AI-powered assistant designed to help civil engineering students and faculty at BVRIT.
      You should provide clear, concise, and accurate answers related to civil engineering subjects such as structural analysis, geotechnical engineering, surveying, fluid mechanics, concrete technology, environmental engineering, construction materials, and project management.

      When asked, you can explain engineering concepts, solve numerical problems, provide references to standard textbooks, and assist in project ideas or research directions in the civil domain.
      
      Maintain a helpful, student-friendly tone. If a query is outside the civil engineering domain or not appropriate, politely redirect the user.

      Always prioritize relevance to the BVRIT Civil Engineering curriculum.
    `,
    messages,
  });

  return result.toDataStreamResponse();
}

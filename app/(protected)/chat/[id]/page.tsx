import { getChatById } from "@/actions/chat";
import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Chat as PreviewChat } from "@/components/shared/chat/chat";
import { Message } from "ai";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const chatFromDb = await getChatById(id);

  if (!chatFromDb) {
    return notFound();
  }

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  const messages: Message[] =
    chatFromDb.messages
      ?.filter(
        (messageStr: unknown): messageStr is string =>
          typeof messageStr === "string"
      )
      .map((messageStr: string) => {
        try {
          const messageObj = JSON.parse(messageStr);
          return messageObj;
        } catch {
          console.error("Failed to parse message:", messageStr);
          return null;
        }
      })
      .filter(
        (messageObj: unknown): messageObj is Message => messageObj !== null
      ) ?? [];

  return (
    <>
      {messages && messages.length > 0 ? (
        <PreviewChat key={id} id={id} initialMessages={messages} />
      ) : (
        <div>No valid messages available</div>
      )}
    </>
  );
};

export default Page;

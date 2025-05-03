"use client";
import { Message } from "ai";
import { useChat } from "@ai-sdk/react";

import { Overview } from "./overview";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { MultimodalInput } from "./multimodal-input";
import { Message as PreviewMessage } from "./message";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { saveChat } from "@/actions/chat";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const user = useCurrentUser();
  const router = useRouter();

  const { messages, handleSubmit, input, setInput, append, stop, isLoading } =
    useChat({
      api: "/api/chat",
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        saveChat({
          userId: user?.id || "",
          id: id,
          title: messages[0].content,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        })
          .then(() => {
            router.replace(`/chat/${id}`);
          })
          .catch((error) => {
            console.error("Error saving chat:", error);
            toast.error("Error while saving the chat");
          });
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-full bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-[100%] items-center overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}
          {messages.map((message, index) => (
            <PreviewMessage
              key={index}
              chatId={id}
              role={message.role}
              content={message.content}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0 ">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            append={append}
          />
        </form>
      </div>
    </div>
  );
}

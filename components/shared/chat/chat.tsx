"use client";

import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

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
  const hasSavedRef = useRef(false);
  const lastSavedLengthRef = useRef(0);
  const isNewChat = initialMessages.length === 0;

  const { messages, handleSubmit, input, setInput, append, stop, isLoading } =
    useChat({
      api: "/api/chat",
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
    });

  useEffect(() => {
    if (!isNewChat) {
      lastSavedLengthRef.current = initialMessages.length;
    }
  }, [isNewChat, initialMessages.length]);

  const debouncedSave = useCallback(
    debounce(
      async (messagesToSave: Message[], chatId: string, userId: string) => {
        console.log(`Attempting to save ${messagesToSave.length} messages`);

        const firstUserMessage = messagesToSave.find(
          (msg) => msg.role === "user"
        );
        const title = firstUserMessage?.content
          ? firstUserMessage.content.length > 50
            ? firstUserMessage.content.substring(0, 50) + "..."
            : firstUserMessage.content
          : "New Chat";

        try {
          await saveChat({
            userId,
            id: chatId,
            title,
            messages: messagesToSave.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          });

          lastSavedLengthRef.current = messagesToSave.length;

          if (isNewChat && !hasSavedRef.current) {
            hasSavedRef.current = true;
            router.replace(`/chat/${chatId}`, { scroll: false });
          }
        } catch (error) {
          console.error("Error saving chat:", error);
          toast.error("Failed to save chat");
        }
      },
      1000
    ),
    [isNewChat, router]
  );

  useEffect(() => {
    const shouldSave =
      messages.length > 0 &&
      user?.id &&
      !isLoading &&
      messages.length !== lastSavedLengthRef.current;

    if (shouldSave) {
      debouncedSave(messages, id, user.id || "");
    }
  }, [messages, user?.id, isLoading, id, debouncedSave]);

  useEffect(() => {
    if (
      !isLoading &&
      messages.length > 0 &&
      messages.length !== lastSavedLengthRef.current &&
      user?.id
    ) {
      debouncedSave.cancel();

      const saveNow = async () => {
        const firstUserMessage = messages.find((msg) => msg.role === "user");
        const title = firstUserMessage?.content
          ? firstUserMessage.content.length > 50
            ? firstUserMessage.content.substring(0, 50) + "..."
            : firstUserMessage.content
          : "New Chat";

        try {
          await saveChat({
            userId: user.id || "",
            id: id,
            title,
            messages: messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          });

          lastSavedLengthRef.current = messages.length;

          if (isNewChat && !hasSavedRef.current) {
            hasSavedRef.current = true;
            router.replace(`/chat/${id}`, { scroll: false });
          }
        } catch (error) {
          console.error("Error saving chat immediately:", error);
          toast.error("Failed to save chat");
        }
      };

      saveNow();
    }
  }, [isLoading, messages, user?.id, id, isNewChat, router, debouncedSave]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

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
              role={message.role}
              content={message.content}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px)] px-4 md:px-0">
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

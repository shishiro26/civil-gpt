"use server";

import prisma from "@/prisma/db";
import { createNewChatSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type Chat = {
  id: string;
  title: string;
};

export const saveChat = async (values: z.infer<typeof createNewChatSchema>) => {
  const validatedData = createNewChatSchema.safeParse(values);

  if (!validatedData.success) {
    return { error: "Invalid fields" };
  }

  const { id, title, messages, userId } = validatedData.data;

  console.log("Validated Data:", id);

  const existingChat = await prisma.chat.findUnique({
    where: { id: id },
  });

  console.log("Existing Chat:", existingChat);
  if (
    existingChat?.messages !== undefined &&
    existingChat?.messages.length > 0
  ) {
    console.log("messages", messages);
    await prisma.chat.update({
      where: { id },
      data: {
        messages: {
          set: messages.map((m) => JSON.stringify(m)),
        },
      },
    });

    return { success: "Chat updated!", id };
  }

  try {
    await prisma.chat.create({
      data: {
        id,
        title,
        messages: messages.map((m) => JSON.stringify(m)),
        userId,
      },
    });
    revalidatePath(`/chat/${id}`);
    revalidatePath("/");
    return { success: "Chat created!" };
  } catch (error) {
    console.error("Create Chat Error:", error);
    return { error: "Error creating chat" };
  }
};

export const getAllChats = async (
  userId: string
): Promise<{ chats: Chat[] } | { error: string }> => {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      select: { id: true, title: true },
    });
    return { chats };
  } catch {
    return { error: "Error getting chats" };
  }
};

export const getChatById = async (id: string) => {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: id,
      },
    });

    if (!chat) {
      return { error: "Chat not found" };
    }

    return {
      title: chat.title,
      messages: chat.messages,
    };
  } catch (error) {
    console.error("Get Chat Error:", error);
    return { error: "Error getting chat" };
  }
};

export const updateChat = async ({
  chatId,
  messagesArray,
}: {
  chatId: string;
  messagesArray: string[];
}) => {
  try {
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        messages: messagesArray,
      },
    });
    return { success: "Chat updated!" };
  } catch (error) {
    console.error("Update Chat Error:", error);
    return { error: "Error updating chat" };
  }
};

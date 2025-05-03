import { Chat } from "@/components/shared/chat/chat";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}

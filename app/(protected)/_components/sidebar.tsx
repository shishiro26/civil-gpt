import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavUser } from "./NavUser";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getAllChats } from "@/actions/chat";

export default async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return notFound();
  }

  const result = await getAllChats(session.user.id);

  const chats = "chats" in result ? result.chats : [];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Button size={"sm"} variant={"secondary"} asChild>
          <Link href={"/chat"}>New Chat</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={"/chat"}>No recent chats</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                chats.map((chat: { id: string; title: string }) => (
                  <SidebarMenuItem key={chat.id} className="min-w-0">
                    <SidebarMenuButton className="w-full min-w-0">
                      <Link
                        href={`/chat/${chat.id}`}
                        className="block w-full truncate text-ellipsis overflow-hidden whitespace-nowrap"
                        title={chat.title}
                      >
                        {chat.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.name || "User",
            email: session?.user?.email || "john.doe@example.com",
            avatar: session?.user?.image || "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

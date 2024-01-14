"use client";

import { SocketProvider } from "@/lib/hooks/useSocket";

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SocketProvider>{children}</SocketProvider>
    </main>
  );
}

"use client";

import Footer from "@/components/room/Footer";
import Content from "@/components/room/Content";
import { useSocket } from "@/lib/hooks/useSocket";
import { getLocalPreviewAndRoomConnection } from "@/lib/rtc-handler";
import useRoomStore from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const meetingStore = useRoomStore((state) => state);
  const socketContext = useSocket();
  const router = useRouter();

  useEffect(() => {
    const initiateRoom = async () => {
      if (!meetingStore.socketId) {
        router.replace("/");
      } else {
        meetingStore.setIsInitiateRoom(true);

        if (socketContext && socketContext.socket) {
          await getLocalPreviewAndRoomConnection(
            {
              isConnectOnlyAudio: meetingStore.isConnectOnlyAudio,
              meetingId: meetingStore.roomId,
              meetingName: meetingStore.meetingName,
              isHostMeeting: meetingStore.isHostMeeting,
            },
            meetingStore.socketId,
            socketContext.socket
          );

          meetingStore.setIsInitiateRoom(false);
          meetingStore.setMicrophone();
          meetingStore.setVideo(!meetingStore.isConnectOnlyAudio);
        }
      }
    };

    initiateRoom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);

  return (
    <section className="min-h-screen flex flex-col overflow-hidden">
      <Content />
      <Footer />
    </section>
  );
}

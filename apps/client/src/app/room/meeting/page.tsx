"use client";

import Footer from "@/components/room/Footer";
import Content from "@/components/room/Content";
import { useSocket } from "@/lib/hooks/useSocket";
import { getLocalPreviewAndRoomConnection } from "@/lib/rtc-handler";
import useRoomStore from "@/store";
import { useEffect } from "react";

export default function JoinRoom() {
  const meetingStore = useRoomStore((state) => state);
  const socketContext = useSocket();

  useEffect(() => {
    const initiateRoom = async () => {
      meetingStore.setIsInitiateRoom(true);

      console.log("initiateRoom socket", {
        socketContext,
      });

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
        if (!meetingStore.isConnectOnlyAudio) meetingStore.setVideo();
      }
    };

    initiateRoom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext]);



  return (
    <section className="h-screen flex flex-col">
      <Content />
      <Footer />
    </section>
  );
}

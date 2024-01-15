"use client";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "@/lib/hooks/useSocket";
import { getLocalPreviewAndRoomConnection } from "@/lib/rtc-handler";
import useRoomStore from "@/store";
import { useEffect } from "react";

export default function JoinRoom() {
  const { toast } = useToast();
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

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(meetingStore.roomId);
    toast({
      description: "Room Id has been sent coppied!",
    });
  };

  return (
    <div className="flex flex-1 text-white">
      <section className="flex flex-col flex-1">
        <Badge
          variant={"secondary"}
          className="self-center mt-2 cursor-pointer"
          onClick={handleCopyRoomId}
        >
          Room ID: {meetingStore.roomId}
        </Badge>

        <section id="videos_container" />
      </section>
      <section className="flex flex-col"></section>
    </div>
  );
}

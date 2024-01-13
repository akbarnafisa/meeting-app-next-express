"use client";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import useSocket from "@/lib/hooks/useSocket";
import { getLocalPreviewAndRoomConnection } from "@/lib/rtc-handler";
import { connectSocketIoServer } from "@/lib/socket";
import useRoomStore from "@/store";
import { useEffect } from "react";

export default function JoinRoom() {
  const { toast } = useToast();
  const meetingStore = useRoomStore((state) => state);
  const socket = useSocket("http://localhost:4000");

  useEffect(() => {
    const initiateRoom = async () => {
      meetingStore.setIsInitiateRoom(true);

      if (socket) {
        connectSocketIoServer(socket, meetingStore);

        await getLocalPreviewAndRoomConnection(
          {
            isConnectOnlyAudio: meetingStore.isConnectOnlyAudio,
            meetingId: meetingStore.roomId,
            meetingName: meetingStore.meetingName,
            isHostMeeting: meetingStore.isHostMeeting,
          },
          meetingStore.socketId,
          socket
        );

        meetingStore.setIsInitiateRoom(false);
        meetingStore.setMicrophone();
        if (!meetingStore.isConnectOnlyAudio) meetingStore.setVideo();
      }
    };

    initiateRoom();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
          Room ID: 12345
        </Badge>

        <section id="videos_container" />
      </section>
      <section className="flex flex-col"></section>
    </div>
  );
}

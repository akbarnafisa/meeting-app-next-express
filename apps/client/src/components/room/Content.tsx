import { Badge } from "@/components/ui/badge";
import useRoomStore from "@/store";
import { useToast } from "../ui/use-toast";
import Participants from "./Participants";
import { useMemo } from "react";
import Chat from "./Chat";

const Content = () => {
  const meetingStore = useRoomStore((state) => state);
  const { toast } = useToast();

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(meetingStore.roomId);
    toast({
      description: "Room Id has been coppied!",
    });
  };

  const isOpenContentChatParticipants = useMemo(() => {
    return meetingStore.isShowParticipants && meetingStore.isShowChatRoom;
  }, [meetingStore]);

  return (
    <div className="flex flex-1 text-white ">
      <section className="flex flex-col flex-1">
        <Badge
          variant={"secondary"}
          className="self-center mt-2 cursor-pointer"
          onClick={handleCopyRoomId}
        >
          Meeting ID: {meetingStore.roomId}
        </Badge>

        <section id="videos_container" />
      </section>
      <section className="flex flex-col h-[calc(100vh-73px)] z-10">
        {meetingStore.isShowParticipants && (
          <Participants
            className={
              isOpenContentChatParticipants ? "max-h-[50%]" : "max-h-full"
            }
          />
        )}

        {meetingStore.isShowChatRoom && (
          <Chat
            className={
              isOpenContentChatParticipants ? "max-h-[50%]" : "max-h-full"
            }
          />
        )}
      </section>
    </div>
  );
};

export default Content;

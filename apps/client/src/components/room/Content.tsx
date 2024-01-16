import { Badge } from "@/components/ui/badge";
import useRoomStore from "@/store";
import { useToast } from "../ui/use-toast";


const Content = () => {
  const meetingStore = useRoomStore((state) => state);
  const { toast } = useToast();


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
};

export default Content;

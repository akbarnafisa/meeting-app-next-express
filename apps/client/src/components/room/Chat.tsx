import useRoomStore from "@/store";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Chat = (props: { className: string }) => {
  const meetingStore = useRoomStore((state) => state);

  const messages = Array(2)
    .fill("")
    .map((_, i) => ({
      socketId: i + 'a',
      name: i + " uasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdser asdasdasdasdasdasdasd",
      content: i + "conteasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdas asdasdas asdasdasdasdasdasdddasnt",
    }));

  return (
    <div
      className={props.className + " border-t  flex-1 border-l sm:w-52 md:w-80"}
    >
      <section className="flex items-center py-2 px-4">
        <p className="flex-1 text-gray-100 text-sm text-center">Chats</p>
        <Button
          variant={"destructive"}
          onClick={() => meetingStore.setIsShowChatRoom()}
        >
          Close
        </Button>
      </section>
      <Separator />

      <ChatMessages
        messages={messages}
        authorSocketId={meetingStore.socketId}
      />

      <ChatInput />
    </div>
  );
};

export default Chat;

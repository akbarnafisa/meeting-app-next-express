import { FormEvent, useState } from "react";
import IconSend from "../icon/IconSend";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { IChatMessage } from "@/interface/room";
import useRoomStore from "@/store";
import { sendMessageUsingDataChannel } from "@/lib/rtc-handler";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const meetingStore = useRoomStore((state) => state);

  const onPressInputHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSendMessageHandler();
  };

  const onSendMessageHandler = () => {
    if (message.length === 0) return;

    const messageData: IChatMessage = {
      socketId: meetingStore.socketId,
      name: meetingStore.meetingName,
      content: message,
    };

    sendMessageUsingDataChannel(messageData);
    setMessage("");
  };

  return (
    <section className="flex items-center gap-1  p-2 bg-black border-l border-solid">
      <form
        className="flex w-full max-w-sm items-center space-x-2"
        onSubmit={onPressInputHandler}
      >
        <Input
          placeholder="Type message here..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
}

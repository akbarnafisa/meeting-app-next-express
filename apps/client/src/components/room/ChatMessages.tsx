import { IChatMessage } from "@/interface/room";

type ChatMessagesProps = {
  messages: IChatMessage[];
  authorSocketId: string;
};

export default function ChatMessages(props: ChatMessagesProps) {
  const isAuthorSocketId = (message: any): boolean => {
    return message.socketId === props.authorSocketId;
  };

  const getAuthorMessage = (message: any) => {
    return isAuthorSocketId(message) ? "You" : message.name;
  };

  return (
    <section className="flex-1 h-[calc(100%-56px)] overflow-y-scroll flex flex-col px-2 pb-2 gap-2 overflow-hidden">
      {props.messages.map((message, i) => (
        <div
          key={i}
          className={
            (isAuthorSocketId(message)
              ? "items-end text-right"
              : "items-start text-left") + " flex flex-col gap-1"
          }
        >
          {(i === 0 ||
            (i > 0 &&
              !(message.socketId === props.messages[i - 1].socketId))) && (
            <p className="text-xs truncate">{getAuthorMessage(message)}</p>
          )}

          <div
            className={
              (isAuthorSocketId(message) ? "bg-blue-500" : "bg-blue-400") +
              " p-2 rounded-md max-w-[60%]"
            }
          >
            <p className="text-sm text-gray-100 break-all">{message.content}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

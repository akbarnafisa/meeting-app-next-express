import useRoomStore from "@/store";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const Participants = (props: { className: string }) => {
  const meetingStore = useRoomStore((state) => state);

  const data = Array(50)
    .fill("")
    .map((_, i) => ({ name: i }));

  return (
    <div
      className={props.className + " border-t  flex-1 border-l sm:w-52 md:w-80"}
    >
      <section className="flex items-center py-2 px-4">
        <p className="flex-1 text-gray-100 text-sm text-center">
          Participants {meetingStore.meetingUsers.length}
        </p>

        <Button variant={"destructive"} onClick={() => meetingStore.setIsShowParticipants()}>Close</Button>
      </section>
      <Separator />
      <section className="flex-1 p-2 h-[calc(100%-56px)] overflow-y-scroll">
        {data.map((user, index) => (
          <div key={index} className="px-2 py-2 ">
            <p className="text-sm truncate">{user.name}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Participants;

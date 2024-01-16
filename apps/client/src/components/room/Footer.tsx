import useRoomStore from "@/store";
import IconCamera from "../icon/IconCamera";
import IconCameraOff from "../icon/IconCameraOff";
import IconChat from "../icon/IconChat";
import IconMicrophone from "../icon/IconMicrophone";
import IconMicrophoneOff from "../icon/IconMicrophoneOff";
import IconPeople from "../icon/IconPeople";
import IconShare from "../icon/IconShare";
import { Button } from "../ui/button";
import FooterButton from "./FooterButton";

const Footer = () => {
  const roomStore = useRoomStore((state) => state);
  console.log({
    roomStore,
  });

  return (
    <footer className="flex justify-around sm:justify-between items-center p-2 border-t border-solid">
      <section className="flex gap-1 sm:gap-2">
        <FooterButton
          isActive={roomStore.isMicrophoneActive}
          iconActive={<IconMicrophone />}
          iconNotActive={<IconMicrophoneOff />}
          textActive="Mute"
          textNotActive="Unmute"
          onClick={() => roomStore.setMicrophone()}
        />
        {!roomStore.isConnectOnlyAudio && (
          <FooterButton
            isActive={roomStore.isVideoActive}
            iconActive={<IconCamera />}
            iconNotActive={<IconCameraOff />}
            textActive="Stop Video"
            textNotActive="Start Video"
            onClick={() => roomStore.setVideo()}
          />
        )}
      </section>

      <section className="flex">
        <FooterButton
          isActive={true}
          iconActive={<IconPeople />}
          textActive="Participants"
          onClick={() => roomStore.setIsShowParticipants()}
        />

        <FooterButton
          isActive={true}
          iconActive={<IconShare />}
          textActive="Share"
          onClick={() => roomStore.setShareScreen()}

        />

        <FooterButton
          isActive={true}
          iconActive={<IconChat />}
          textActive="Chat"
          onClick={() => roomStore.setIsShowChatRoom()}

        />
      </section>

      <section className="px-2">
        <Button variant={"destructive"}>Leave Meeting</Button>
      </section>
    </footer>
  );
};

export default Footer;

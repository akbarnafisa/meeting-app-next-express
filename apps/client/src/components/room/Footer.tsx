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
  return (
    <footer className="flex justify-around sm:justify-between items-center p-2 border-t border-solid">
      <section className="flex gap-1 sm:gap-2">
        <FooterButton
          isActive={true}
          iconActive={<IconMicrophone />}
          iconNotActive={<IconMicrophoneOff />}
          textActive="Mute"
          textNotActive="Unmute"
        />
        <FooterButton
          isActive={true}
          iconActive={<IconCamera />}
          iconNotActive={<IconCameraOff />}
          textActive="Stop Video"
          textNotActive="Start Video"
        />
      </section>

      <section className="flex">
        <FooterButton
          isActive={true}
          iconActive={<IconPeople />}
          textActive="Participants"
        />

        <FooterButton
          isActive={true}
          iconActive={<IconShare />}
          textActive="Share"
        />

        <FooterButton
          isActive={true}
          iconActive={<IconChat />}
          textActive="Chat"
        />
      </section>

      <section className="px-2">
        <Button variant={"destructive"}>Leave Meeting</Button>
      </section>
    </footer>
  );
};

export default Footer;

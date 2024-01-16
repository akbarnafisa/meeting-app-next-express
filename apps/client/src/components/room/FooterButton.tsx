import IconMicrophone from "../icon/IconMicrophone";
import { Button } from "../ui/button";

type FotoerButtonProps = {
  isActive: boolean;
  textActive: string;
  textNotActive?: string;
  iconActive: React.ReactNode;
  iconNotActive?: React.ReactNode;
};

const FooterButton = (props: FotoerButtonProps) => {
  return (
    <Button className="w-28 h-14 py-2" variant={"ghost"}>
      <div className="flex flex-col items-center gap-1">
        {props.isActive ? props.iconActive : props.iconNotActive}
        {props.isActive ? props.textActive : props.textNotActive}
      </div>
    </Button>
  );
};

export default FooterButton;

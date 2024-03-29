import React from "react";
import { Button } from "../ui/button";

export interface FooterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  textActive: string;
  textNotActive?: string;
  iconActive: React.ReactNode;
  iconNotActive?: React.ReactNode;
}

const FooterButton = React.forwardRef<HTMLButtonElement, FooterButtonProps>(
  (
    {
      isActive,
      textActive,
      textNotActive,
      iconActive,
      iconNotActive,
      ...props
    },
    ref
  ) => {
    return (
      <Button className="w-28 h-14 py-2" variant={"ghost"} ref={ref} {...props}>
        <div className="flex flex-col items-center gap-1">
          {isActive ? iconActive : iconNotActive}
          {isActive ? textActive : textNotActive}
        </div>
      </Button>
    );
  }
);

FooterButton.displayName = "FooterButton";

export default FooterButton;

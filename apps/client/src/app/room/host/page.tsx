"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRoomStore from "@/store";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

export default function HostRoom() {
  const setMeetingConfig = useRoomStore((state) => state.setMeetingConfig);
  const [roomName, setRoomName] = useState("");
  const [useAudio, setUseAudio] = useState<boolean>(false);

  const onInputRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const onSubmitRoomHost = () => {
    setMeetingConfig({
      isConnectOnlyAudio: useAudio,
      isHostMeeting: true,
      meetingName: roomName,
    });
  };

  const isButtonDisabled = useMemo(() => {
    return roomName === "";
  }, [roomName]);

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Host a Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-2.5 mb-6">
            <Label htmlFor="email">Room Name</Label>
            <Input
              type="text"
              id="email"
              placeholder="Enter the meeting room name"
              onChange={onInputRoomName}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" onCheckedChange={(e) => setUseAudio(!!e)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Connect only audio
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex">
          <Button
            className="flex-1 mr-2"
            disabled={isButtonDisabled}
            onClick={onSubmitRoomHost}
          >
            Create Room
          </Button>

          <Button className="flex-1" variant={"outline"} asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

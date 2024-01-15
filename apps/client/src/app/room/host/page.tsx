"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRoomStore from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

export default function HostRoom() {
  const setMeetingConfig = useRoomStore((state) => state.setMeetingConfig);
  const router = useRouter();

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

    router.replace("/room/meeting");
  };

  const isButtonDisabled = useMemo(() => {
    return roomName === "";
  }, [roomName]);

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Host a Meeting</CardTitle>
          <CardDescription>
            Create your new meeting in one-click
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-4">
          <div className="grid w-full max-w-sm items-center gap-2.5 mb-6">
            <Label htmlFor="email">Name</Label>
            <Input
              type="text"
              id="email"
              placeholder="Enter the your name"
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
        <CardFooter className="flex justify-between">
          <Button disabled={isButtonDisabled} onClick={onSubmitRoomHost}>
            Create Meeting
          </Button>
          <Button variant={"outline"} asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

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
import { useToast } from "@/components/ui/use-toast";
import useRoomStore from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";

export default function HostRoom() {
  const setMeetingConfig = useRoomStore((state) => state.setMeetingConfig);
  const router = useRouter();
  const { toast } = useToast();

  const [userName, setRoomName] = useState("");
  const [meetingId, setMeetingId] = useState("");

  const [useAudio, setUseAudio] = useState<boolean>(false);

  const onInputRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const onInputMeetingId = (e: ChangeEvent<HTMLInputElement>) => {
    setMeetingId(e.target.value);
  };

  const onSubmitRoomHost = async () => {
    const data = await fetch(`http://localhost:4000/rtc/room/${meetingId}`);
    const result = await data.json() as any;


    console.log({
      result
    })

    if (!result.success) {
      toast({
        description: result.error.errorMsg,
      });
      return;
    }

    setMeetingConfig({
      isConnectOnlyAudio: useAudio,
      isHostMeeting: false,
      meetingName: userName,
      meetingId,
    });

    router.replace("/room/meeting");
  };

  const isButtonDisabled = useMemo(() => {
    return userName === "";
  }, [userName]);

  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Join a Meeting</CardTitle>
          <CardDescription>Join an existing meeting</CardDescription>
        </CardHeader>
        <CardContent className="mb-4">
          <div className="grid w-full max-w-sm items-center gap-2.5 mb-6">
            <Label htmlFor="email">Meeting ID</Label>
            <Input
              type="text"
              id="email"
              placeholder="Enter the meeting ID"
              onChange={onInputMeetingId}
            />
          </div>

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
            Join Meeting
          </Button>
          <Button variant={"outline"} asChild>
            <Link href="/">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

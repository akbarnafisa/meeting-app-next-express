import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle>Meeting App</CardTitle>
        </CardHeader>
        <CardContent>Join or create your meeting</CardContent>
        <CardFooter className="flex">
          <Button className="flex-1 mr-2">
            <Link href="/room/join">Join a Meeting</Link>
          </Button>
          <Button className="flex-1" variant={"outline"} asChild>
            <Link href="/room/host">Host a Meeting</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

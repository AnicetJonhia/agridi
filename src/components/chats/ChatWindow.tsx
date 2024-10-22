import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {MoveLeft} from "lucide-react";

// @ts-ignore
export function ChatWindow({ sender , onBack}) {


  return (
    <div className="flex flex-col  h-full">
      <header className="flex items-center justify-start space-x-6 px-4 py-2 border-b">
          <div className={"lg:hidden"}>
              <MoveLeft className="cursor-pointer" onClick={onBack} />
          </div>
          <div className={"flex items-center justify-items-center space-x-1"}>
              <Avatar className="w-10 h-10">
                  <AvatarImage src={sender.avatar} alt={sender.name} />
                  <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-lg font-semibold">{sender.name}</h1>
              </div>
      </header>
      <main className="flex-1 overflow-y-srool p-4 space-y-4">
        {/* Add chat messages here */}
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage src={sender.avatar} alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm">{sender.lastMessage}</p>
          </div>
        </div>
        {/* Add more messages as needed */}
      </main>
      <footer className="flex items-center space-x-2 p-2 border-b border-t">
        <Input className="flex-1" placeholder="Type a message" />
        <Button variant="outline" size="sm">
          Send
        </Button>
      </footer>
    </div>
  );
}
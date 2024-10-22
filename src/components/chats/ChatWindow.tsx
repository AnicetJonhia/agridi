import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// @ts-ignore
export  function ChatWindow({ sender }) {
  if (!sender) {
    return <div className="flex-1 p-4">Select a sender to start chatting</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-lg font-semibold">{sender.name}</h1>
        <Button variant="outline" size="sm">
          Leave Chat
        </Button>
      </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Add chat messages here */}
            <div className="flex items-end space-x-2">
                <Avatar>
                    <AvatarImage src={sender.avatar} alt="User Avatar"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm">{sender.lastMessage}</p>
                </div>
            </div>
            <div className="flex items-end justify-end space-x-2">
                <div className="p-2 rounded-lg bg-primary text-white">
                    <p className="text-sm">What about you?</p>
                </div>
                <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex items-end justify-end space-x-2">
                <div className="p-2 rounded-lg bg-primary text-white">
                    <p className="text-sm">What's news?</p>
                </div>
                <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>

        </main>
        <footer className="flex items-center space-x-2 p-2 border-t">
            <Input className="flex-1" placeholder="Type a message"/>
            <Button variant="outline" size="sm">
                Send
            </Button>
        </footer>
    </div>
  );
}
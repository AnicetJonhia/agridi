import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const senders = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Hey, how are you?",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Let's catch up soon!",
    timestamp: "9:30 AM",
  },
  {
    id: 3,
    name: "Alice Johnson",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Meeting at 3 PM.",
    timestamp: "8:45 AM",
  },
  {
    id: 4,
    name: "Bob Brown",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Call me when you’re free.",
    timestamp: "7:20 AM",
  },
  {
    id: 5,
    name: "Charlie Green",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Happy Birthday!",
    timestamp: "6:10 AM",
  },
  {
    id: 6,
    name: "David Lee",
    avatar: "/placeholder-user.jpg",
    lastMessage: "I’ve sent the documents.",
    timestamp: "5:55 AM",
  },
  {
    id: 7,
    name: "Emma Wilson",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Looking forward to it.",
    timestamp: "4:30 AM",
  },
  {
    id: 8,
    name: "Frank Martin",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Good morning!",
    timestamp: "3:15 AM",
  },
  {
    id: 9,
    name: "Grace King",
    avatar: "/placeholder-user.jpg",
    lastMessage: "I'll be there in 10 mins.",
    timestamp: "2:00 AM",
  },
  {
    id: 10,
    name: "Henry Scott",
    avatar: "/placeholder-user.jpg",
    lastMessage: "See you tomorrow!",
    timestamp: "1:45 AM",
  },
];



export {senders};

export function SenderList({ onSelectSender }) {
  return (
    <div className="w-full lg:w-1/3 border-r p-2 overflow-y-scroll h-full">
      {senders.map((sender) => (
        <Card
          key={sender.id}
          className="flex flex-col p-4 cursor-pointer hover:bg-muted mb-2"
          onClick={() => onSelectSender(sender)}
        >
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={sender.avatar} alt={sender.name} />
              <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1">
              <div className="font-semibold">{sender.name}</div>
              <div className="text-sm text-muted-foreground">{sender.lastMessage}</div>
            </div>
            <div className="text-xs text-muted-foreground">{sender.timestamp}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

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
  // Add more senders as needed
];

// @ts-ignore
export function SenderList({ onSelectSender }) {
  return (
    <div className="w-full md:w-1/4 border-r p-2  ">
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
              {/* Affichage du dernier message */}
              <div className="text-sm text-muted-foreground">{sender.lastMessage}</div>
            </div>
            {/* Affichage de l'heure d'envoi */}
            <div className="text-xs text-muted-foreground">{sender.timestamp}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function SenderList({ senders, onSelectSender }) {
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
              <div className="text-sm text-muted-foreground">{sender.content}</div>
            </div>
            <div className="text-xs text-muted-foreground">{sender.timestamp}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

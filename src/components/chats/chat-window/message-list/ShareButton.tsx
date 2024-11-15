import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onClick }) => {
  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClick}>
      <Share2 className="h-3 w-3 text-muted-foreground" />
    </Button>
  );
};

export default ShareButton;
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

interface DropdownMenuProps {
  onShare: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onOpenChange: () => void;
}

const CustomDropdownMenu: React.FC<DropdownMenuProps> = ({ onShare, onDelete, isOpen, onOpenChange }) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <EllipsisVertical className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-slide-down">
        <DropdownMenuItem asChild onClick={onShare}>
          <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
            Share
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={onDelete}>
          <Button variant="outline" className="cursor-pointer w-full mt-2 p-3">
            Delete
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdownMenu;
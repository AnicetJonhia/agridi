import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {  Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import logo from "../assets/images/logo.png";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { LayoutDashboard, Edit3 } from "lucide-react"; // Importez les icônes nécessaires

import HeaderNavItem from "./header/HeaderNavItem.tsx";
import { Link } from "react-router-dom";

export default function AuthHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false); // État pour gérer l'ouverture du Sheet

  const closeSheet = () => {
    setIsSheetOpen(false); // Fonction pour fermer le Sheet
  };

  return (
    <header className="   flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}> {/* Gérer l'ouverture du Sheet */}
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>

        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link to={"/"} className="flex items-center gap-2 text-lg font-semibold">
              <img alt={""} src={logo} className="h-6 w-6" />
              <span>AgriD</span>
            </Link>
             <HeaderNavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSheet} />
            <HeaderNavItem to="/blogs" icon={Edit3} label="Blogs" onClick={closeSheet} />


          </nav>
        </SheetContent>
      </Sheet>
      <ToggleDarkMode />


    </header>
  );
}

import React, {useEffect, useRef, useState} from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {Search, Menu, CircleUser} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import logo from "../assets/images/logo.png";
import { ToggleDarkMode } from "./ToggleDarkMode";
import { LayoutDashboard, Edit3, ShoppingCart, Package, Blinds, CalendarArrowUp, MessageCircle, LineChart } from "lucide-react";

import HeaderNavItem from "./header/HeaderNavItem.tsx";
import { Link } from "react-router-dom";
import LanguageSwitcher  from "@/components/LanguageSwitcher.tsx";
import Logout from "@/components/Logout.tsx";

import userStore from "@/stores/userStore.ts";


export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutButtonRef = useRef(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const {user} = userStore();


  useEffect(() => {
      if (user?.profile_picture) {
      setUserProfilePicture(user.profile_picture);
      }
  }, [user]);





  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };



  return (
    <header className=" flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}> {/* Gérer l'ouverture du Sheet */}
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setIsSheetOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>

        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link to={"/dashboard"} className="flex items-center gap-2 text-lg font-semibold">
              <img alt={""} src={logo} className="h-6 w-6" />
              <span>AgriD</span>
            </Link>
             <HeaderNavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeSheet} />
            <HeaderNavItem to="/blogs" icon={Edit3} label="Blogs" onClick={closeSheet} />
            <HeaderNavItem to="/orders" icon={ShoppingCart} label="Orders" badgeCount={6} onClick={closeSheet} />
            <HeaderNavItem to="/products" icon={Package} label="Products" onClick={closeSheet} />
            <HeaderNavItem to="/needs" icon={Blinds} label="Needs" onClick={closeSheet} />
            <HeaderNavItem to="/seasons" icon={CalendarArrowUp} label="Seasons" onClick={closeSheet} />
            <HeaderNavItem to="/chats" icon={MessageCircle} label="Chats" onClick={closeSheet} />
            <HeaderNavItem to="/analytics" icon={LineChart} label="Analytics" onClick={closeSheet} />

          </nav>
        </SheetContent>
      </Sheet>
      <Link to={"/dashboard"} className=" items-center gap-2 md:hidden">
        <img alt={""} src={logo} className="h-6 w-6" />

      </Link>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
          </div>
        </form>
      </div>


      <LanguageSwitcher/>
      <ToggleDarkMode />

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">

            {userProfilePicture ? (
                <img
                    src={userProfilePicture instanceof File ? URL.createObjectURL(userProfilePicture) : userProfilePicture}
                    alt="you"
                    className="w-9 h-auto border rounded-full object-cover cursor-pointer"
                />
            ) : <CircleUser className="h-5 w-5"/>}

            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"cursor-pointer"} onClick={closeDropdown}>
            <Link to={"/profile"} >Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={closeDropdown}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
                <Logout ref={logoutButtonRef}/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

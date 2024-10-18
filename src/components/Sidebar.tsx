import { Link } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, LineChart, Edit3, CalendarArrowUp, MessageCircle ,Bell,Blinds} from "lucide-react";

import { Button } from "@/components/ui/button";
import logo from "../assets/images/logo.png";
import SidebarNavItem from "./sidebar/SidebarNavItem";

export default function Sidebar() {
  return (
    <div className=" hidden border-r w-64 bg-muted/40 md:block ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to={"/dashboard"} className="flex items-center gap-2 font-semibold">
            <img alt={""} src={logo} className="h-6 w-6" />
            <span className="">AgriD</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <SidebarNavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarNavItem to="/blogs" icon={Edit3} label="Blogs" />
            <SidebarNavItem to="/orders" icon={ShoppingCart} label="Orders" badgeCount={6} />
            <SidebarNavItem to="/products" icon={Package} label="Products" />

            <SidebarNavItem to="/needs" icon={Blinds} label="Needs" />
            <SidebarNavItem to="/seasons" icon={CalendarArrowUp} label="Seasons" />
            <SidebarNavItem to="/chats" icon={MessageCircle} label="Chats" />
            <SidebarNavItem to="/analytics" icon={LineChart} label="Analytics" />
          </nav>
        </div>
      </div>
    </div>
  );
}

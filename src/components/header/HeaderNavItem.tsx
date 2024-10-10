import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// @ts-ignore
function HeaderNavItem({ to, icon: Icon, label, badgeCount, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick} // Appeler la fonction onClick lors du clic
      className={({ isActive }) =>
        `mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
          isActive ? "bg-[#149911] text-white" : "text-muted-foreground hover:text-primary"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {label}
      {badgeCount && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badgeCount}
        </Badge>
      )}
    </NavLink>
  );
}



export default HeaderNavItem;

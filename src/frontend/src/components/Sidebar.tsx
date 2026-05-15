// @ts-nocheck
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  ReceiptText,
  Users,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "sidebar.dashboard_link",
  },
  {
    to: "/customers",
    label: "Customer Master",
    icon: Users,
    ocid: "sidebar.customers_link",
  },
  {
    to: "/sales",
    label: "Sales Entry",
    icon: ClipboardList,
    ocid: "sidebar.sales_link",
  },
  {
    to: "/receipts",
    label: "Receipt Entry",
    icon: ReceiptText,
    ocid: "sidebar.receipts_link",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-smooth",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border gap-3 flex-shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-primary font-display font-bold text-sm">
            EL
          </span>
        </div>
        {!collapsed && (
          <span className="font-display font-semibold text-sidebar-foreground text-sm tracking-tight truncate">
            ERP Ledger
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, ocid }) => (
          <Link
            key={to}
            to={to}
            data-ocid={ocid}
            activeProps={{
              className: "bg-primary/15 text-primary border-primary/30",
            }}
            inactiveProps={{
              className:
                "text-sidebar-foreground/70 hover:bg-muted/40 hover:text-sidebar-foreground",
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth border border-transparent",
              collapsed && "justify-center px-0",
            )}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4 border-t border-sidebar-border pt-3">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          data-ocid="sidebar.collapse_toggle"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-muted/40 transition-smooth",
            collapsed && "justify-center px-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={16}
            className={cn("transition-smooth", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

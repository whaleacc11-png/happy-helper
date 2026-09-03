import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Activity,
  Boxes,
  ClipboardCheck,
  Gauge,
  Layers,
  Map,
  Menu,
  Printer,
  Search,
  Send,
  Truck,
  X,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dot } from "./primitives";

const nav = [
  { to: "/", label: "Today", icon: Gauge },
  { to: "/districts", label: "Districts", icon: Map },
  { to: "/states", label: "States", icon: Layers },
  { to: "/printing", label: "Printing", icon: Printer },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/dispatch", label: "Dispatch", icon: Send },
  { to: "/transit", label: "In Transit", icon: Truck },
  { to: "/receipts", label: "Receipts", icon: ClipboardCheck },
  { to: "/intake", label: "Intake", icon: Inbox },
  { to: "/events", label: "Events", icon: Activity },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-surface transition-transform duration-300 lg:w-[13.5rem] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <span className="flex size-6 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
            H
          </span>
          <span className="text-sm font-semibold tracking-tight">HumbEE</span>
          <span className="label-xs ml-auto">OPS</span>
          <button
            className="ml-1 text-muted-foreground lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {nav.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1.5 bottom-1.5 -left-2 w-0.5 rounded-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <n.icon className="size-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Dot health="ok" pulse />
            <span className="text-[11px] text-muted-foreground">Sync live · 3s ago</span>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-[13.5rem]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
          <button
            className="text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground md:flex">
              <Search className="size-3.5" />
              <span>Search consignment, lot, district</span>
              <kbd className="num rounded border border-border px-1 text-[10px]">⌘K</kbd>
            </div>
            {actions}
            <span className="flex size-7 items-center justify-center rounded-full border border-border-strong bg-surface-raised text-[11px] font-semibold">
              AK
            </span>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

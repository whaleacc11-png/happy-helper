import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { activity, destinations, destState } from "@/lib/data";

const groups: { label: string; items: { to: string; label: string; badge?: number }[] }[] = [
  {
    label: "Operate",
    items: [
      { to: "/", label: "Attention" },
      { to: "/events", label: "Events" },
      { to: "/dispatch", label: "Dispatch" },
      { to: "/transit", label: "Transit" },
      { to: "/receipts", label: "Confirmations" },
    ],
  },
  {
    label: "Supply",
    items: [
      { to: "/printing", label: "Printing" },
      { to: "/inventory", label: "Inventory" },
      { to: "/intake", label: "Intake" },
    ],
  },
  {
    label: "Geography",
    items: [
      { to: "/districts", label: "Districts" },
      { to: "/states", label: "States" },
    ],
  },
];

export function Shell({
  question,
  title,
  actions,
  children,
  toolbar,
}: {
  /** the single operational question this screen answers */
  question: string;
  title: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const exceptions = destinations.filter((d) => destState(d) === "exception").length;

  return (
    <div className="min-h-screen">
      <aside
        className={cn(
          "border-border bg-surface fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r transition-transform duration-200 ease-out lg:w-52 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-border flex h-12 items-center gap-2 border-b px-3">
          <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-[3px] text-[10px] font-bold">
            H
          </span>
          <span className="text-[13px] font-semibold tracking-tight">HumbEE</span>
          <button
            className="text-muted-foreground ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {groups.map((g) => (
            <div key={g.label} className="mb-1 px-2">
              <div className="eyebrow px-2 py-1.5">{g.label}</div>
              {g.items.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                const badge = n.to === "/" ? exceptions : undefined;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded px-2 py-1.5 text-[12.5px] transition-colors duration-150",
                      active
                        ? "bg-surface-sunken text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "bg-primary h-3 w-[2px] rounded-full transition-opacity duration-150",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {n.label}
                    {!!badge && (
                      <span className="num text-bad ml-auto text-[11px]">{badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-border border-t px-3 py-2 text-[11px] text-subtle">
          Last sync {activity[0]?.at} · today
        </div>
      </aside>

      {open && (
        <div
          className="anim-fade bg-foreground/10 fixed inset-0 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-52">
        <header className="border-border bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
          <div className="flex h-12 items-center gap-3 px-4">
            <button
              className="text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-[14px] font-semibold tracking-tight">{title}</h1>
            </div>
            <p className="hidden truncate text-[12px] text-subtle md:block">{question}</p>
            <div className="ml-auto flex items-center gap-2">
              <button className="border-border text-muted-foreground hover:border-line-strong hidden h-7 items-center gap-2 rounded border px-2 text-[11px] transition-colors md:flex">
                <Search className="size-3" />
                Event, destination, AWB
                <kbd className="num border-border rounded border px-1 text-[10px]">⌘K</kbd>
              </button>
              {actions}
            </div>
          </div>
          {toolbar && (
            <div className="border-border flex h-10 items-center gap-2 border-t px-4">{toolbar}</div>
          )}
        </header>

        <main className="anim-in p-4">{children}</main>
      </div>
    </div>
  );
}

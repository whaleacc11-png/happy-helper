import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dot } from "@/components/humbee/primitives";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — HumbEE Operations" },
      { name: "description", content: "Sign in to the HumbEE operations console." },
      { property: "og:title", content: "Sign in — HumbEE Operations" },
      { property: "og:description", content: "Sign in to the HumbEE operations console." },
    ],
  }),
  component: Login,
});

const field =
  "h-10 w-full rounded-md border border-border bg-surface-raised px-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-ring";

function Login() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            setTimeout(() => navigate({ to: "/" }), 600);
          }}
          className="rise w-full max-w-sm space-y-5"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
              H
            </span>
            <span className="text-sm font-semibold tracking-tight">HumbEE</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Operations console</h1>
            <p className="mt-1 text-[12px] text-muted-foreground">Restricted access · activity is logged.</p>
          </div>
          <div className="space-y-3">
            <label className="block space-y-1.5">
              <span className="label-xs">Operator ID</span>
              <input className={field} placeholder="ops@humbee.in" autoComplete="username" />
            </label>
            <label className="block space-y-1.5">
              <span className="label-xs">Passcode</span>
              <input className={field} type="password" placeholder="••••••••" autoComplete="current-password" />
            </label>
          </div>
          <button
            disabled={busy}
            className="h-10 w-full rounded-md bg-primary text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Sign in"}
          </button>
          <p className="text-[11px] text-muted-foreground">
            Trouble signing in? Contact the district control room.
          </p>
        </form>
      </div>

      <div className="relative hidden border-l border-border bg-surface lg:block">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative flex h-full flex-col justify-end gap-4 p-10">
          <div className="space-y-2">
            {["Printing", "Office", "Allocation", "Dispatch", "In Transit", "Delivery", "Receipt"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <Dot health={i < 4 ? "ok" : i === 4 ? "warn" : "idle"} pulse={i === 4} />
                <span className="text-[12px] text-muted-foreground">{s}</span>
                <span className="h-px flex-1 bg-border" />
                <span className="num text-[11px] text-muted-foreground">{i < 4 ? "clear" : i === 4 ? "active" : "—"}</span>
              </div>
            ))}
          </div>
          <p className="max-w-xs text-[12px] text-muted-foreground">
            One chain of custody, from press to receipt.
          </p>
        </div>
      </div>
    </div>
  );
}

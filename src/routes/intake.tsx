import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/humbee/app-shell";
import { Panel, StatusPill } from "@/components/humbee/primitives";
import { districts } from "@/lib/humbee-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Intake — HumbEE Operations" },
      { name: "description", content: "Record an inbound lot into office stock with counts, seals and variance." },
      { property: "og:title", content: "Intake — HumbEE Operations" },
      { property: "og:description", content: "Record inbound lots into office stock with counts and seals." },
    ],
  }),
  component: Intake,
});

const field =
  "h-9 w-full rounded-md border border-border bg-surface-raised px-2.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-1 focus:ring-ring";

function Intake() {
  const [expected, setExpected] = useState(84000);
  const [counted, setCounted] = useState(84000);
  const [district, setDistrict] = useState(districts[0]!.name);
  const [saving, setSaving] = useState(false);
  const variance = counted - expected;

  return (
    <AppShell title="Intake" subtitle="Receive inbound lot into office stock">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
        <Panel title="Inbound lot" bodyClassName="p-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="label-xs">Lot ID</span>
              <input className={field} defaultValue="LP-3391" />
            </label>
            <label className="space-y-1.5">
              <span className="label-xs">Seal number</span>
              <input className={field} placeholder="TS-000000" />
            </label>
          </div>
          <label className="space-y-1.5 block">
            <span className="label-xs">District</span>
            <select className={field} value={district} onChange={(e) => setDistrict(e.target.value)}>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="label-xs">Expected</span>
              <input
                type="number"
                className={cn(field, "num")}
                value={expected}
                onChange={(e) => setExpected(Number(e.target.value))}
              />
            </label>
            <label className="space-y-1.5">
              <span className="label-xs">Counted</span>
              <input
                type="number"
                className={cn(field, "num")}
                value={counted}
                onChange={(e) => setCounted(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            disabled={saving}
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                toast.success(`Lot received into ${district}`, {
                  description: variance === 0 ? "Variance 0 — moved to Office stock" : `Variance ${variance} flagged`,
                });
              }, 700);
            }}
            className="h-9 w-full rounded-md bg-primary text-[13px] font-medium text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? "Recording…" : "Record intake"}
          </button>
        </Panel>

        <Panel title="Verification" bodyClassName="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <StatusPill health={variance === 0 ? "ok" : Math.abs(variance) < 500 ? "warn" : "crit"}>
              {variance === 0 ? "Balanced" : `Variance ${variance > 0 ? "+" : ""}${variance}`}
            </StatusPill>
            <span className="text-[11px] text-muted-foreground">
              Counts reconcile against the press dispatch note before stock is released.
            </span>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
            {[
              ["Expected", expected],
              ["Counted", counted],
              ["Delta", variance],
            ].map(([k, v]) => (
              <div key={String(k)} className="bg-surface-raised p-3">
                <div className="label-xs">{k}</div>
                <div className="num mt-1 text-lg font-semibold">{Number(v).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
          <ol className="space-y-2 text-[12px] text-muted-foreground">
            {["Seal integrity verified at gate", "Box count matched against manifest", "Sample weight check passed"].map(
              (s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="num flex size-5 items-center justify-center rounded-full border border-border text-[10px]">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ),
            )}
          </ol>
        </Panel>
      </div>
    </AppShell>
  );
}

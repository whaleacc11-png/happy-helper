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
  component: Intake;
});

function Intake() {
  return null;
}

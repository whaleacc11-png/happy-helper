import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Chain, Field, Marker, SidePanel, Tag, Button, Qty, Fill } from "./ui";
import {
  DEST_STATE,
  SHIPMENT_STATUS,
  destShipments,
  destState,
  destTotals,
  eventById,
  fmt,
  type Destination,
} from "@/lib/data";

export function DestinationPanel({
  destination,
  onClose,
}: {
  destination: Destination | null;
  onClose: () => void;
}) {
  if (!destination) return null;
  const d = destination;
  const ev = eventById(d.eventId);
  const t = destTotals(d);
  const st = destState(d);
  const ships = destShipments(d.id).filter((s) => s.status !== "queued");
  const latest = ships[ships.length - 1];

  return (
    <SidePanel
      open
      onClose={onClose}
      title={d.name}
      subtitle={`${d.city}, ${d.state} · ${ev?.code} ${ev?.name}`}
      footer={
        <>
          <Button variant="solid">Create dispatch</Button>
          <Button variant="outline">Chase confirmation</Button>
          <Link
            to="/events/$eventId"
            params={{ eventId: d.eventId }}
            className="text-primary ml-auto text-[12px] hover:underline"
          >
            Open event
          </Link>
        </>
      }
    >
      <div className="border-border grid grid-cols-2 gap-3 border-b p-4">
        <Field label="State">
          <Tag tone={DEST_STATE[st].tone}>{DEST_STATE[st].label}</Tag>
        </Field>
        <Field label="Need by">{d.needBy}</Field>
        <Field label="Organiser">{d.organiser}</Field>
        <Field label="Contact">
          <span className="num inline-flex items-center gap-1.5 text-[12px]">
            <Phone className="size-3 text-subtle" />
            {d.phone}
          </span>
        </Field>
      </div>

      {d.flags?.length ? (
        <div className="border-border bg-bad/5 border-b px-4 py-2.5">
          {d.flags.map((f) => (
            <div key={f} className="text-bad flex items-center gap-2 text-[12px]">
              <Marker tone="bad" />
              {f}
            </div>
          ))}
        </div>
      ) : null}

      <div className="border-border border-b p-4">
        <div className="eyebrow mb-2">Required / sent / remaining</div>
        <table className="w-full">
          <tbody className="divide-border divide-y">
            {d.items.map((i) => (
              <tr key={i.sku} className="align-middle">
                <td className="py-2 pr-3 text-[12.5px]">
                  {i.name}
                  <span className="num ml-2 text-[11px] text-subtle">{i.sku}</span>
                </td>
                <td className="w-28 py-2">
                  <Fill sent={i.sent} required={i.required} tone={i.sent >= i.required ? "good" : "warn"} />
                </td>
                <td className="py-2 pl-3 text-right">
                  <Qty required={i.required} sent={i.sent} remaining={Math.max(0, i.required - i.sent)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-border mt-2 flex items-center justify-between border-t pt-2 text-[12px]">
          <span className="eyebrow">Total</span>
          <Qty required={t.required} sent={t.sent} remaining={t.remaining} />
        </div>
      </div>

      <div className="border-border border-b p-4">
        <div className="eyebrow mb-3">Custody chain</div>
        <Chain
          steps={[
            { label: "Dispatch", value: latest?.dispatchedAt, done: !!latest },
            { label: "Courier", value: latest ? `${latest.courier}` : undefined, done: !!latest },
            { label: "Delivery", value: latest?.deliveredAt, done: !!latest?.deliveredAt },
            {
              label: "Confirmed",
              value: latest?.confirmedAt,
              done: !!latest?.confirmedAt,
            },
          ]}
        />
      </div>

      <div className="p-4">
        <div className="eyebrow mb-2">Shipment history</div>
        {ships.length === 0 ? (
          <p className="text-[12px] text-muted-foreground">Nothing dispatched yet.</p>
        ) : (
          <ol className="divide-border divide-y">
            {ships.map((s) => (
              <li key={s.id} className="py-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="num text-[12px] font-medium">{s.awb}</span>
                  <span className="ml-auto">
                    <Tag tone={SHIPMENT_STATUS[s.status].tone}>{SHIPMENT_STATUS[s.status].label}</Tag>
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
                  <span>{s.courier}</span>
                  <span className="num">{fmt(s.qty)} units</span>
                  <span className="num">out {s.dispatchedAt}</span>
                  <span className="num">eta {s.etaAt}</span>
                  {s.confirmedBy && <span>confirmed by {s.confirmedBy}</span>}
                </div>
                {s.note && <div className="text-bad mt-1 text-[11.5px]">{s.note}</div>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </SidePanel>
  );
}

/**
 * HumbEE operational model
 * EVENT → DESTINATION → REQUIRED → SENT → REMAINING → DISPATCH → COURIER/AWB
 * → DELIVERY → ORGANISER CONFIRMATION
 */

export type ShipmentStatus =
  | "queued"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "confirmed"
  | "exception";

export const SHIPMENT_STATUS: Record<ShipmentStatus, { label: string; tone: Tone }> = {
  queued: { label: "Queued", tone: "neutral" },
  dispatched: { label: "Dispatched", tone: "info" },
  in_transit: { label: "In transit", tone: "info" },
  delivered: { label: "Delivered", tone: "good" },
  confirmed: { label: "Confirmed", tone: "good" },
  exception: { label: "Exception", tone: "bad" },
};

export type Tone = "neutral" | "info" | "good" | "warn" | "bad";

/** Operational state of a destination — the single question: is it settled? */
export type DestState =
  | "unshipped" // nothing sent yet
  | "partial" // some sent, remaining > 0
  | "moving" // fully sent, in courier network
  | "delivered" // delivered, organiser has not confirmed
  | "confirmed" // organiser confirmed
  | "exception"; // something is wrong

export const DEST_STATE: Record<DestState, { label: string; tone: Tone }> = {
  unshipped: { label: "Not sent", tone: "warn" },
  partial: { label: "Partial", tone: "warn" },
  moving: { label: "Moving", tone: "info" },
  delivered: { label: "Delivered", tone: "info" },
  confirmed: { label: "Confirmed", tone: "good" },
  exception: { label: "Exception", tone: "bad" },
};

export interface LineItem {
  sku: string;
  name: string;
  required: number;
  sent: number;
}

export interface Shipment {
  id: string;
  destinationId: string;
  awb: string;
  courier: string;
  qty: number;
  dispatchedAt: string;
  etaAt: string;
  deliveredAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  status: ShipmentStatus;
  note?: string;
}

export interface Destination {
  id: string;
  eventId: string;
  name: string;
  city: string;
  district: string;
  state: string;
  organiser: string;
  phone: string;
  needBy: string;
  items: LineItem[];
  flags?: string[];
}

export interface HEvent {
  id: string;
  code: string;
  name: string;
  owner: string;
  city: string;
  state: string;
  startsOn: string;
  daysOut: number;
  participants: number;
}

export const events: HEvent[] = [
  { id: "e-nsc26", code: "NSC-26", name: "National Skills Convention", owner: "R. Kulkarni", city: "Nagpur", state: "Maharashtra", startsOn: "Sep 08", daysOut: 5, participants: 4200 },
  { id: "e-wsm26", code: "WSM-26", name: "Western Sales Meet", owner: "S. Deshpande", city: "Pune", state: "Maharashtra", startsOn: "Sep 05", daysOut: 2, participants: 1850 },
  { id: "e-tsx26", code: "TSX-26", name: "Tech Summit Expo", owner: "A. Rao", city: "Bengaluru", state: "Karnataka", startsOn: "Sep 04", daysOut: 1, participants: 6100 },
  { id: "e-hrc26", code: "HRC-26", name: "Heritage Round Conclave", owner: "M. Sharma", city: "Jaipur", state: "Rajasthan", startsOn: "Sep 12", daysOut: 9, participants: 900 },
  { id: "e-elw26", code: "ELW-26", name: "Eastern Leadership Week", owner: "V. Singh", city: "Lucknow", state: "Uttar Pradesh", startsOn: "Sep 15", daysOut: 12, participants: 2400 },
];

const li = (sku: string, name: string, required: number, sent: number): LineItem => ({ sku, name, required, sent });

export const destinations: Destination[] = [
  // NSC-26 — Nagpur
  { id: "d-1", eventId: "e-nsc26", name: "Chitnavis Centre", city: "Nagpur", district: "Nagpur", state: "Maharashtra", organiser: "D. Meshram", phone: "+91 98220 41187", needBy: "Sep 06", flags: ["Seal mismatch at gate"], items: [li("KIT-D", "Delegate kit", 2400, 1600), li("BAN-3M", "Backdrop banner 3m", 6, 6), li("CRT-A4", "Certificate A4", 2400, 0)] },
  { id: "d-2", eventId: "e-nsc26", name: "Deekshabhoomi Hall", city: "Nagpur", district: "Nagpur", state: "Maharashtra", organiser: "S. Bhoyar", phone: "+91 98220 33210", needBy: "Sep 06", items: [li("KIT-D", "Delegate kit", 1200, 1200), li("SIG-STD", "Signage standee", 10, 10)] },
  { id: "d-3", eventId: "e-nsc26", name: "Kamptee Satellite Venue", city: "Kamptee", district: "Nagpur", state: "Maharashtra", organiser: "P. Tembhurne", phone: "+91 98220 77410", needBy: "Sep 07", items: [li("KIT-D", "Delegate kit", 600, 0), li("CRT-A4", "Certificate A4", 600, 0)] },
  // WSM-26 — Pune
  { id: "d-4", eventId: "e-wsm26", name: "Baramati Convention Hall", city: "Baramati", district: "Pune", state: "Maharashtra", organiser: "N. Pawar", phone: "+91 98500 44110", needBy: "Sep 04", flags: ["Courier delayed 40m"], items: [li("KIT-S", "Sales kit", 850, 850), li("BAN-3M", "Backdrop banner 3m", 4, 4)] },
  { id: "d-5", eventId: "e-wsm26", name: "Koregaon Park Annexe", city: "Pune", district: "Pune", state: "Maharashtra", organiser: "R. Jadhav", phone: "+91 98500 21008", needBy: "Sep 04", items: [li("KIT-S", "Sales kit", 1000, 1000), li("CRT-A4", "Certificate A4", 1000, 700)] },
  // TSX-26 — Bengaluru
  { id: "d-6", eventId: "e-tsx26", name: "Yelahanka Expo Centre", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", organiser: "T. Iyer", phone: "+91 98450 99210", needBy: "Sep 03", items: [li("KIT-D", "Delegate kit", 3200, 3200), li("BAN-3M", "Backdrop banner 3m", 12, 12), li("SIG-STD", "Signage standee", 24, 24)] },
  { id: "d-7", eventId: "e-tsx26", name: "Whitefield Hall B", city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", organiser: "K. Nair", phone: "+91 98450 11740", needBy: "Sep 03", items: [li("KIT-D", "Delegate kit", 2900, 2900), li("CRT-A4", "Certificate A4", 2900, 2900)] },
  // HRC-26 — Jaipur
  { id: "d-8", eventId: "e-hrc26", name: "Amber Heritage Lawn", city: "Amber", district: "Jaipur", state: "Rajasthan", organiser: "P. Meena", phone: "+91 94140 55120", needBy: "Sep 10", flags: ["Venue list revision v4 pending"], items: [li("KIT-D", "Delegate kit", 500, 0), li("BAN-3M", "Backdrop banner 3m", 3, 0)] },
  { id: "d-9", eventId: "e-hrc26", name: "City Palace Annexe", city: "Jaipur", district: "Jaipur", state: "Rajasthan", organiser: "M. Sharma", phone: "+91 94140 21990", needBy: "Sep 10", items: [li("KIT-D", "Delegate kit", 400, 180), li("CRT-A4", "Certificate A4", 400, 0)] },
  // ELW-26 — Lucknow
  { id: "d-10", eventId: "e-elw26", name: "Gomti Nagar Auditorium", city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh", organiser: "A. Yadav", phone: "+91 94150 88221", needBy: "Sep 13", items: [li("KIT-L", "Leadership kit", 1400, 900), li("SIG-STD", "Signage standee", 8, 8)] },
  { id: "d-11", eventId: "e-elw26", name: "Mohanlalganj Centre", city: "Mohanlalganj", district: "Lucknow", state: "Uttar Pradesh", organiser: "V. Singh", phone: "+91 94150 40012", needBy: "Sep 13", items: [li("KIT-L", "Leadership kit", 1000, 0), li("CRT-A4", "Certificate A4", 1000, 0)] },
];

export const shipments: Shipment[] = [
  { id: "s-1", destinationId: "d-1", awb: "BD 4471 9920 IN", courier: "BlueDart", qty: 1600, dispatchedAt: "Sep 02 · 09:10", etaAt: "Sep 04 · 18:00", deliveredAt: "Sep 03 · 11:20", status: "delivered" },
  { id: "s-2", destinationId: "d-1", awb: "BD 4471 9944 IN", courier: "BlueDart", qty: 6, dispatchedAt: "Sep 02 · 09:10", etaAt: "Sep 04 · 18:00", deliveredAt: "Sep 03 · 11:20", confirmedAt: "Sep 03 · 12:02", confirmedBy: "D. Meshram", status: "confirmed" },
  { id: "s-3", destinationId: "d-2", awb: "DTDC 8830 1122", courier: "DTDC", qty: 1210, dispatchedAt: "Sep 01 · 14:40", etaAt: "Sep 03 · 12:00", deliveredAt: "Sep 02 · 17:05", confirmedAt: "Sep 02 · 18:30", confirmedBy: "S. Bhoyar", status: "confirmed" },
  { id: "s-4", destinationId: "d-4", awb: "DL 5590 7781", courier: "Delhivery", qty: 854, dispatchedAt: "Sep 02 · 21:30", etaAt: "Sep 03 · 09:30", status: "in_transit", note: "Held 40m at Katraj ghat" },
  { id: "s-5", destinationId: "d-5", awb: "DL 5590 7742", courier: "Delhivery", qty: 1700, dispatchedAt: "Sep 01 · 08:00", etaAt: "Sep 02 · 16:00", deliveredAt: "Sep 02 · 15:10", status: "delivered" },
  { id: "s-6", destinationId: "d-6", awb: "BD 4472 3310 IN", courier: "BlueDart", qty: 3236, dispatchedAt: "Aug 31 · 07:20", etaAt: "Sep 01 · 21:00", deliveredAt: "Sep 01 · 18:42", confirmedAt: "Sep 01 · 19:15", confirmedBy: "T. Iyer", status: "confirmed" },
  { id: "s-7", destinationId: "d-7", awb: "BD 4472 3355 IN", courier: "BlueDart", qty: 5800, dispatchedAt: "Aug 31 · 07:20", etaAt: "Sep 01 · 21:00", deliveredAt: "Sep 01 · 18:42", status: "delivered" },
  { id: "s-8", destinationId: "d-9", awb: "XB 2210 4415", courier: "XpressBees", qty: 180, dispatchedAt: "Sep 02 · 16:00", etaAt: "Sep 04 · 12:00", status: "exception", note: "Address unreachable — organiser not responding" },
  { id: "s-9", destinationId: "d-10", awb: "DTDC 8831 5540", courier: "DTDC", qty: 908, dispatchedAt: "Sep 02 · 11:15", etaAt: "Sep 05 · 16:00", status: "in_transit" },
  { id: "s-10", destinationId: "d-3", awb: "—", courier: "—", qty: 0, dispatchedAt: "—", etaAt: "Sep 07", status: "queued" },
];

/* ---------- derivations ---------- */

export const destShipments = (destId: string) => shipments.filter((s) => s.destinationId === destId);

export function destTotals(d: Destination) {
  const required = d.items.reduce((a, i) => a + i.required, 0);
  const sent = d.items.reduce((a, i) => a + i.sent, 0);
  return { required, sent, remaining: Math.max(0, required - sent) };
}

export function destState(d: Destination): DestState {
  const ss = destShipments(d.id);
  const { required, sent } = destTotals(d);
  if (ss.some((s) => s.status === "exception") || (d.flags?.length ?? 0) > 0) return "exception";
  if (sent === 0) return "unshipped";
  if (sent < required) return "partial";
  if (ss.length > 0 && ss.every((s) => s.status === "confirmed")) return "confirmed";
  if (ss.some((s) => s.status === "delivered")) return "delivered";
  return "moving";
}

export const eventDestinations = (eventId: string) => destinations.filter((d) => d.eventId === eventId);

export function eventTotals(eventId: string) {
  const ds = eventDestinations(eventId);
  const t = ds.reduce(
    (a, d) => {
      const x = destTotals(d);
      a.required += x.required;
      a.sent += x.sent;
      a.remaining += x.remaining;
      return a;
    },
    { required: 0, sent: 0, remaining: 0 },
  );
  const confirmed = ds.filter((d) => destState(d) === "confirmed").length;
  const exceptions = ds.filter((d) => destState(d) === "exception").length;
  return { ...t, destinations: ds.length, confirmed, exceptions };
}

export const eventById = (id: string) => events.find((e) => e.id === id);
export const destById = (id: string) => destinations.find((d) => d.id === id);

/* ---------- secondary ---------- */

export interface PrintJob {
  id: string;
  item: string;
  eventId: string;
  press: string;
  ordered: number;
  printed: number;
  reconciled: boolean;
  due: string;
}

export const printJobs: PrintJob[] = [
  { id: "PJ-3391", item: "Delegate kit folder", eventId: "e-elw26", press: "Orion Press", ordered: 2400, printed: 2400, reconciled: true, due: "Sep 09" },
  { id: "PJ-3392", item: "Certificate A4", eventId: "e-hrc26", press: "Orion Press", ordered: 1400, printed: 620, reconciled: false, due: "Sep 06" },
  { id: "PJ-3401", item: "Delegate kit folder", eventId: "e-nsc26", press: "Deccan Print", ordered: 4200, printed: 3900, reconciled: false, due: "Sep 05" },
  { id: "PJ-3407", item: "Backdrop banner 3m", eventId: "e-wsm26", press: "Deccan Print", ordered: 10, printed: 4, reconciled: false, due: "Sep 03" },
  { id: "PJ-3412", item: "Signage standee", eventId: "e-tsx26", press: "Coastal Litho", ordered: 24, printed: 24, reconciled: true, due: "Aug 30" },
];

export interface StockRow {
  sku: string;
  item: string;
  location: string;
  onHand: number;
  committed: number;
}

export const stock: StockRow[] = [
  { sku: "KIT-D", item: "Delegate kit", location: "Nagpur store", onHand: 2100, committed: 3000 },
  { sku: "KIT-S", item: "Sales kit", location: "Pune store", onHand: 640, committed: 0 },
  { sku: "KIT-L", item: "Leadership kit", location: "Lucknow store", onHand: 2600, committed: 1500 },
  { sku: "CRT-A4", item: "Certificate A4", location: "Nagpur store", onHand: 5400, committed: 4900 },
  { sku: "BAN-3M", item: "Backdrop banner 3m", location: "Central store", onHand: 14, committed: 9 },
  { sku: "SIG-STD", item: "Signage standee", location: "Central store", onHand: 6, committed: 8 },
];

export interface IntakeRow {
  id: string;
  at: string;
  source: string;
  item: string;
  expected: number;
  counted: number;
  by: string;
}

export const intakeRows: IntakeRow[] = [
  { id: "IN-2210", at: "Sep 03 · 14:58", source: "Orion Press", item: "Delegate kit folder", expected: 2400, counted: 2400, by: "V. Singh" },
  { id: "IN-2209", at: "Sep 03 · 11:20", source: "Deccan Print", item: "Delegate kit folder", expected: 3900, counted: 3884, by: "R. Kulkarni" },
  { id: "IN-2207", at: "Sep 02 · 18:05", source: "Coastal Litho", item: "Signage standee", expected: 24, counted: 24, by: "A. Rao" },
  { id: "IN-2204", at: "Sep 02 · 09:40", source: "Vendor · PaperCo", item: "Certificate A4 stock", expected: 6000, counted: 6000, by: "M. Sharma" },
];

export interface Activity {
  id: string;
  at: string;
  tone: Tone;
  eventId: string;
  destinationId?: string;
  text: string;
  actor: string;
}

export const activity: Activity[] = [
  { id: "a1", at: "16:48", tone: "bad", eventId: "e-hrc26", destinationId: "d-9", text: "XB 2210 4415 marked undeliverable — address unreachable", actor: "XpressBees" },
  { id: "a2", at: "16:31", tone: "good", eventId: "e-tsx26", destinationId: "d-6", text: "Organiser confirmed receipt of 3,236 units", actor: "T. Iyer" },
  { id: "a3", at: "16:14", tone: "warn", eventId: "e-wsm26", destinationId: "d-4", text: "DL 5590 7781 delayed 40m at Katraj ghat", actor: "Delhivery" },
  { id: "a4", at: "15:52", tone: "warn", eventId: "e-hrc26", destinationId: "d-8", text: "Dispatch held — venue list revision v4 pending", actor: "M. Sharma" },
  { id: "a5", at: "15:20", tone: "neutral", eventId: "e-elw26", text: "PJ-3391 printed and reconciled — 2,400 units", actor: "Orion Press" },
  { id: "a6", at: "14:58", tone: "neutral", eventId: "e-elw26", text: "Intake IN-2210 counted, no variance", actor: "V. Singh" },
];

export const fmt = (n: number) => n.toLocaleString("en-IN");
export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

/* geography rollup — where problems concentrate */
export function districtRollup() {
  const map = new Map<string, { district: string; state: string; dests: Destination[] }>();
  for (const d of destinations) {
    const k = `${d.state}/${d.district}`;
    if (!map.has(k)) map.set(k, { district: d.district, state: d.state, dests: [] });
    map.get(k)!.dests.push(d);
  }
  return [...map.entries()].map(([key, v]) => {
    const t = v.dests.reduce(
      (a, d) => {
        const x = destTotals(d);
        a.required += x.required;
        a.sent += x.sent;
        a.remaining += x.remaining;
        return a;
      },
      { required: 0, sent: 0, remaining: 0 },
    );
    const open = v.dests.filter((d) => !["confirmed"].includes(destState(d))).length;
    const exceptions = v.dests.filter((d) => destState(d) === "exception").length;
    return { key: key.replace("/", "-").toLowerCase().replace(/\s+/g, "-"), ...v, ...t, open, exceptions };
  });
}

export function stateRollup() {
  const map = new Map<string, { state: string; districts: Set<string>; dests: Destination[] }>();
  for (const d of destinations) {
    if (!map.has(d.state)) map.set(d.state, { state: d.state, districts: new Set(), dests: [] });
    const r = map.get(d.state)!;
    r.districts.add(d.district);
    r.dests.push(d);
  }
  return [...map.values()].map((v) => {
    const t = v.dests.reduce(
      (a, d) => {
        const x = destTotals(d);
        a.required += x.required;
        a.sent += x.sent;
        a.remaining += x.remaining;
        return a;
      },
      { required: 0, sent: 0, remaining: 0 },
    );
    return {
      state: v.state,
      districts: v.districts.size,
      destinations: v.dests.length,
      exceptions: v.dests.filter((d) => destState(d) === "exception").length,
      confirmed: v.dests.filter((d) => destState(d) === "confirmed").length,
      ...t,
    };
  });
}

export const districtKey = (state: string, district: string) =>
  `${state}-${district}`.toLowerCase().replace(/\s+/g, "-");

export type Stage =
  | "printing"
  | "office"
  | "allocation"
  | "dispatch"
  | "transit"
  | "delivery"
  | "receipt";

export const STAGES: { key: Stage; label: string; short: string }[] = [
  { key: "printing", label: "Printing", short: "PRN" },
  { key: "office", label: "Office", short: "OFF" },
  { key: "allocation", label: "Allocation", short: "ALC" },
  { key: "dispatch", label: "Dispatch", short: "DSP" },
  { key: "transit", label: "In Transit", short: "TRN" },
  { key: "delivery", label: "Delivery", short: "DLV" },
  { key: "receipt", label: "Receipt", short: "RCP" },
];

export type Health = "ok" | "warn" | "crit" | "idle";

export interface District {
  id: string;
  name: string;
  state: string;
  health: Health;
  stage: Stage;
  planned: number;
  done: number;
  blocked: number;
  eta: string;
  owner: string;
  lastEvent: string;
  lastEventAt: string;
  flow: number[];
}

export const districts: District[] = [
  {
    id: "d-ngp",
    name: "Nagpur",
    state: "Maharashtra",
    health: "crit",
    stage: "dispatch",
    planned: 184000,
    done: 121400,
    blocked: 9800,
    eta: "Sep 05 · 18:00",
    owner: "R. Kulkarni",
    lastEvent: "Vehicle seal mismatch at gate 3",
    lastEventAt: "12m",
    flow: [12, 28, 34, 41, 39, 52, 47, 61, 44, 38],
  },
  {
    id: "d-pun",
    name: "Pune",
    state: "Maharashtra",
    health: "warn",
    stage: "transit",
    planned: 226000,
    done: 198300,
    blocked: 2100,
    eta: "Sep 04 · 09:30",
    owner: "S. Deshpande",
    lastEvent: "Courier delayed 40m — Katraj ghat",
    lastEventAt: "34m",
    flow: [22, 31, 40, 44, 52, 58, 61, 66, 71, 74],
  },
  {
    id: "d-blr",
    name: "Bengaluru Urban",
    state: "Karnataka",
    health: "ok",
    stage: "delivery",
    planned: 312000,
    done: 301500,
    blocked: 0,
    eta: "Sep 03 · 21:00",
    owner: "A. Rao",
    lastEvent: "Route 12 delivered · 8 receipts signed",
    lastEventAt: "3m",
    flow: [30, 42, 48, 55, 62, 68, 74, 81, 88, 94],
  },
  {
    id: "d-jai",
    name: "Jaipur",
    state: "Rajasthan",
    health: "warn",
    stage: "allocation",
    planned: 141000,
    done: 62800,
    blocked: 4400,
    eta: "Sep 06 · 12:00",
    owner: "M. Sharma",
    lastEvent: "Allocation held — booth list revision",
    lastEventAt: "1h",
    flow: [8, 14, 19, 22, 30, 33, 36, 41, 44, 45],
  },
  {
    id: "d-luc",
    name: "Lucknow",
    state: "Uttar Pradesh",
    health: "ok",
    stage: "office",
    planned: 268000,
    done: 88200,
    blocked: 0,
    eta: "Sep 07 · 16:00",
    owner: "V. Singh",
    lastEvent: "Inbound lot LP-3391 verified",
    lastEventAt: "18m",
    flow: [6, 12, 18, 26, 30, 32, 33, 35, 37, 39],
  },
  {
    id: "d-cok",
    name: "Ernakulam",
    state: "Kerala",
    health: "idle",
    stage: "printing",
    planned: 96000,
    done: 12400,
    blocked: 0,
    eta: "Sep 09 · 10:00",
    owner: "J. Thomas",
    lastEvent: "Press slot confirmed",
    lastEventAt: "2h",
    flow: [2, 4, 5, 7, 9, 10, 11, 12, 12, 13],
  },
];

export interface PrintLot {
  id: string;
  press: string;
  district: string;
  qty: number;
  done: number;
  health: Health;
  slot: string;
}

export const printLots: PrintLot[] = [
  { id: "LP-3391", press: "Orion Press · Line A", district: "Lucknow", qty: 84000, done: 84000, health: "ok", slot: "02:00–08:00" },
  { id: "LP-3392", press: "Orion Press · Line B", district: "Jaipur", qty: 62000, done: 41200, health: "warn", slot: "08:00–14:00" },
  { id: "LP-3401", press: "Deccan Print · Line 1", district: "Nagpur", qty: 118000, done: 96500, health: "ok", slot: "06:00–15:00" },
  { id: "LP-3407", press: "Deccan Print · Line 2", district: "Pune", qty: 74000, done: 12800, health: "crit", slot: "14:00–22:00" },
  { id: "LP-3412", press: "Coastal Litho", district: "Ernakulam", qty: 96000, done: 12400, health: "idle", slot: "22:00–06:00" },
];

export interface InventoryRow {
  sku: string;
  item: string;
  location: string;
  onHand: number;
  allocated: number;
  min: number;
}

export const inventory: InventoryRow[] = [
  { sku: "BAL-A4", item: "Ballot sheet A4", location: "Nagpur · Vault 2", onHand: 62400, allocated: 58000, min: 20000 },
  { sku: "SEAL-T", item: "Tamper seal (green)", location: "Nagpur · Vault 2", onHand: 3100, allocated: 2900, min: 4000 },
  { sku: "BOX-L", item: "Transit box L", location: "Pune · Bay 4", onHand: 1840, allocated: 1200, min: 800 },
  { sku: "BAL-A4", item: "Ballot sheet A4", location: "Jaipur · Vault 1", onHand: 41000, allocated: 39500, min: 15000 },
  { sku: "FORM-17", item: "Form 17C pad", location: "Lucknow · Store", onHand: 9600, allocated: 4100, min: 3000 },
  { sku: "SEAL-T", item: "Tamper seal (green)", location: "Bengaluru · Vault 3", onHand: 12800, allocated: 9400, min: 4000 },
];

export interface Consignment {
  id: string;
  district: string;
  vehicle: string;
  courier: string;
  boxes: number;
  stage: Stage;
  health: Health;
  progress: number;
  eta: string;
  origin: string;
  destination: string;
}

export const consignments: Consignment[] = [
  { id: "CN-88231", district: "Pune", vehicle: "MH12 AB 4410", courier: "N. Pawar", boxes: 320, stage: "transit", health: "warn", progress: 62, eta: "09:30", origin: "Pune Hub", destination: "Baramati DC" },
  { id: "CN-88244", district: "Bengaluru Urban", vehicle: "KA01 CJ 9921", courier: "T. Iyer", boxes: 288, stage: "delivery", health: "ok", progress: 94, eta: "21:00", origin: "BLR Hub", destination: "Yelahanka DC" },
  { id: "CN-88250", district: "Nagpur", vehicle: "MH31 QE 1187", courier: "D. Meshram", boxes: 410, stage: "dispatch", health: "crit", progress: 8, eta: "18:00", origin: "Nagpur Vault", destination: "Kamptee DC" },
  { id: "CN-88255", district: "Jaipur", vehicle: "RJ14 GG 3320", courier: "P. Meena", boxes: 190, stage: "allocation", health: "warn", progress: 0, eta: "12:00", origin: "Jaipur Vault", destination: "Amber DC" },
  { id: "CN-88261", district: "Lucknow", vehicle: "UP32 KL 7742", courier: "A. Yadav", boxes: 256, stage: "transit", health: "ok", progress: 41, eta: "16:00", origin: "Lucknow Store", destination: "Mohanlalganj DC" },
];

export interface Receipt {
  id: string;
  consignment: string;
  district: string;
  signedBy: string;
  at: string;
  boxes: number;
  variance: number;
  status: "signed" | "pending" | "disputed";
}

export const receipts: Receipt[] = [
  { id: "RC-5512", consignment: "CN-88244", district: "Bengaluru Urban", signedBy: "K. Nair", at: "16:42", boxes: 288, variance: 0, status: "signed" },
  { id: "RC-5513", consignment: "CN-88261", district: "Lucknow", signedBy: "—", at: "—", boxes: 256, variance: 0, status: "pending" },
  { id: "RC-5509", consignment: "CN-88198", district: "Pune", signedBy: "R. Jadhav", at: "11:04", boxes: 240, variance: -3, status: "disputed" },
  { id: "RC-5501", consignment: "CN-88170", district: "Nagpur", signedBy: "S. Bhoyar", at: "08:20", boxes: 312, variance: 0, status: "signed" },
];

export interface EventItem {
  id: string;
  at: string;
  stage: Stage;
  health: Health;
  district: string;
  text: string;
  actor: string;
}

export const events: EventItem[] = [
  { id: "e1", at: "16:48", stage: "dispatch", health: "crit", district: "Nagpur", text: "Seal mismatch on CN-88250 — dispatch halted at gate 3", actor: "Gate scanner" },
  { id: "e2", at: "16:31", stage: "delivery", health: "ok", district: "Bengaluru Urban", text: "Route 12 completed, 8 receipts signed", actor: "T. Iyer" },
  { id: "e3", at: "16:14", stage: "transit", health: "warn", district: "Pune", text: "CN-88231 delayed 40m at Katraj ghat", actor: "Telemetry" },
  { id: "e4", at: "15:52", stage: "allocation", health: "warn", district: "Jaipur", text: "Allocation frozen pending booth list revision v4", actor: "M. Sharma" },
  { id: "e5", at: "15:20", stage: "printing", health: "ok", district: "Lucknow", text: "Lot LP-3391 completed and verified — 84,000 units", actor: "Orion Press" },
  { id: "e6", at: "14:58", stage: "office", health: "ok", district: "Lucknow", text: "Inbound lot received into store, variance 0", actor: "V. Singh" },
];

export interface StateRow {
  code: string;
  name: string;
  districts: number;
  planned: number;
  done: number;
  blocked: number;
  health: Health;
}

export const states: StateRow[] = [
  { code: "MH", name: "Maharashtra", districts: 36, planned: 1840000, done: 1204000, blocked: 11900, health: "crit" },
  { code: "KA", name: "Karnataka", districts: 31, planned: 1420000, done: 1310000, blocked: 400, health: "ok" },
  { code: "RJ", name: "Rajasthan", districts: 33, planned: 1210000, done: 604000, blocked: 4400, health: "warn" },
  { code: "UP", name: "Uttar Pradesh", districts: 75, planned: 3120000, done: 998000, blocked: 0, health: "warn" },
  { code: "KL", name: "Kerala", districts: 14, planned: 640000, done: 132000, blocked: 0, health: "idle" },
];

export const fmt = (n: number) => n.toLocaleString("en-IN");

export const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

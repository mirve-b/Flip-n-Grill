/**
 * ✏️ Fill these in and the whole site picks them up (booking form, footer, buttons).
 * Leave a field "" to hide it.
 */
export const CONTACT = {
  /** WhatsApp number in international format, digits only — e.g. "923001234567" */
  whatsapp: "",
  /** Booking email — e.g. "bookings@flipandgrill.pk" */
  email: "",
  /** Instagram handle without the @ — e.g. "flipandgrill" */
  instagram: "flipngrill_",
};

export const EVENT_TYPES = [
  { id: "bazaar", label: "Bazaar / pop-up", sfx: "STALL UP!" },
  { id: "wedding", label: "Wedding / mehndi / dholki", sfx: "SHAADI MODE!" },
  { id: "corporate", label: "Corporate / office", sfx: "LUNCH BREAK!" },
  { id: "uni", label: "University / college event", sfx: "CAMPUS RAID!" },
  { id: "party", label: "Birthday / house party", sfx: "PARTY!" },
  { id: "other", label: "Something else", sfx: "SURPRISE!" },
] as const;

export const KARACHI_AREAS = [
  "DHA",
  "Clifton",
  "PECHS / Tariq Road",
  "Bahadurabad",
  "Gulshan-e-Iqbal",
  "Gulistan-e-Jauhar",
  "North Nazimabad",
  "Federal B Area",
  "Saddar",
  "Korangi",
  "Malir",
  "Scheme 33",
  "Other (Karachi)",
];

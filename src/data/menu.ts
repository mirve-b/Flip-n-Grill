export type IconId = "burger" | "double" | "curly" | "animal" | "mozzy" | "water" | "soda";

export type MenuItem = {
  name: string;
  blurb?: string;
  icon: IconId;
  badge?: { text: string; tone?: "red" };
  sfx?: string;
  tone?: "alt" | "spice";
};

export const burgers: MenuItem[] = [
  {
    name: "Oklahoma Smash",
    blurb: "Paper-thin onions smashed straight into the patty on a screaming-hot grill. Caramelised, lacy-edged, ridiculous.",
    icon: "burger",
    badge: { text: "The OG" },
    sfx: "CRUNCH!",
  },
  {
    name: "Smokehouse Smash",
    blurb: "Deep, smoky, saucy. A burger that walks in slow-motion with the wind in its hair.",
    icon: "burger",
    badge: { text: "Smoky", tone: "red" },
    sfx: "FWOOSH!",
    tone: "alt",
  },
];

export const extras = ["Patty", "Cheese", "Sauce"];

export const sides: MenuItem[] = [
  { name: "Salted Curly Fries", blurb: "Classic spirals. Crispy. Salty. No notes.", icon: "curly" },
  { name: "Masala Curly Fries", blurb: "Same spirals, Karachi spice-level unlocked.", icon: "curly", tone: "spice" },
  { name: "Animal Fries", blurb: "Fries buried under cheese and sauce. Feral. Unhinged.", icon: "animal" },
  { name: "Mozzy Sticks", blurb: "Golden outside, cheese-pull plot twist inside.", icon: "mozzy" },
];

export const meals: MenuItem[] = [
  { name: "Single + Fries", blurb: "One smash patty, one side of fries. The starter arc.", icon: "burger" },
  { name: "Double + Fries", blurb: "Two smash patties plus fries. The final-boss form.", icon: "double", tone: "alt" },
];

export const drinks: MenuItem[] = [
  { name: "Mineral Water", icon: "water" },
  { name: "Soft Drink", icon: "soda" },
];

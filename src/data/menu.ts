export type MenuItem = {
  name: string;
  blurb?: string;
  /** hand-drawn art in public/menu */
  img: string;
  /** price in rupees: shows on the receipt when set, e.g. price: 850 */
  price?: number;
};

export const burgers: MenuItem[] = [
  {
    name: "Oklahoma Smash",
    img: "/menu/oklahoma-smash.webp",
    blurb: "Paper-thin onions smashed straight into the patty on a screaming-hot grill. Caramelised, lacy-edged, ridiculous.",
  },
  {
    name: "Smokehouse Smash",
    img: "/menu/smokehouse-smash.webp",
    blurb: "Deep, smoky, saucy. A burger that walks in slow-motion with the wind in its hair.",
  },
];

export const sides: MenuItem[] = [
  { name: "Salted Curly Fries", img: "/menu/salted-curly.webp", blurb: "Classic spirals. Crispy. Salty. No notes." },
  { name: "Masala Curly Fries", img: "/menu/masala-curly.webp", blurb: "Same spirals, Karachi spice-level unlocked." },
  { name: "Animal Fries", img: "/menu/animal-fries.webp", blurb: "Fries buried under cheese and sauce. Feral. Unhinged." },
  { name: "Mozzy Sticks", img: "/menu/mozzy-sticks.webp", blurb: "Golden outside, cheese-pull plot twist inside." },
];

export const meals: MenuItem[] = [
  { name: "Single + Fries", img: "/menu/single-fries.webp", blurb: "One smash patty, one side of fries. The starter arc." },
  { name: "Double + Fries", img: "/menu/double-fries.webp", blurb: "Two smash patties plus fries. The final-boss form." },
];

export const drinks: MenuItem[] = [
  { name: "Mineral Water", img: "/menu/water.webp" },
  { name: "Soft Drink", img: "/menu/soft-drink.webp" },
];

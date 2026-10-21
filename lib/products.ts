export type ProductId =
  | "founders-combo"
  | "planet-identity"
  | "remote-access-custom-subdomain";

export type ProductConfig = {
  id: ProductId;
  name: string;
  description: string;
  unitAmount: number;
  priceLabel: string;
  paddlePriceId?: string;
};

export const PRODUCT_CATALOG: Record<ProductId, ProductConfig> = {
  
  "founders-combo": {
    id: "founders-combo",
    name: "Founder's Combo (Hosting/Remote Access/AI)",
    description:
      "Includes Friends & Family Hosting, Remote Access + Custom Subdomain, and AI Package.",
    unitAmount: 17500,
    priceLabel: "$175 first 500 signups",
    paddlePriceId: "pri_01m56vwf76s5adhn3ctegsq4bd",
  },
  "planet-identity": {
    id: "planet-identity",
    name: "Planet Identity",
    description: "Your own Urbit planet - a real identity on the network, owned by you.",
    unitAmount: 1000,
    priceLabel: "$10 one-time",
    paddlePriceId: "pri_01m56w4hyfv02fmk8pbr2fzxpg",
  },

  "remote-access-custom-subdomain": {
    id: "remote-access-custom-subdomain",
    name: "Remote Access + Custom Subdomain",
    description: "Access your server remotely with your own subdomain (yourname.orraah.com).",
    unitAmount: 5000,
    priceLabel: "$50 one-time (first 500 signups)",
    paddlePriceId: "pri_01m56vt2b1z98z3s28yk3g4gcd",
  },
};

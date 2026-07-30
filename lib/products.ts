export type ProductId =
  | "legacy-early-adopter"
  | "founders-combo"
  | "planet-identity"
  | "friends-family-hosting"
  | "remote-access-custom-subdomain"
  | "p2p-commerce-app-store"
  | "ai-package";

export type ProductConfig = {
  id: ProductId;
  name: string;
  description: string;
  unitAmount: number;
  priceLabel: string;
};

export const PRODUCT_CATALOG: Record<ProductId, ProductConfig> = {
  "legacy-early-adopter": {
    id: "legacy-early-adopter",
    name: "Orraah - Early Adopter Lifetime Access",
    description: "Lifetime access + all future updates. First 500 customers only.",
    unitAmount: 4900,
    priceLabel: "$49 one-time",
  },
  "founders-combo": {
    id: "founders-combo",
    name: "Founder's Combo (Hosting/Remote Access/Commerce/AI)",
    description:
      "Includes Friends & Family Hosting, Remote Access + Custom Subdomain, Peer-to-Peer Commerce & App Store, and AI Package.",
    unitAmount: 17500,
    priceLabel: "$175 first 500 signups",
  },
  "planet-identity": {
    id: "planet-identity",
    name: "Planet Identity",
    description: "Your own Urbit planet - a real identity on the network, owned by you.",
    unitAmount: 1000,
    priceLabel: "$10 one-time",
  },
  "friends-family-hosting": {
    id: "friends-family-hosting",
    name: "Friends & Family Hosting",
    description: "Host servers for your friends and family under your own infrastructure.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
  },
  "remote-access-custom-subdomain": {
    id: "remote-access-custom-subdomain",
    name: "Remote Access + Custom Subdomain",
    description: "Access your server remotely with your own subdomain (yourname.orraah.com).",
    unitAmount: 5000,
    priceLabel: "$50 first-year price for first 500 signups",
  },
  "p2p-commerce-app-store": {
    id: "p2p-commerce-app-store",
    name: "Peer-to-Peer Commerce & App Store",
    description: "Buy, sell, and discover apps directly with other Orraah users.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
  },
  "ai-package": {
    id: "ai-package",
    name: "AI Package",
    description: "Run your own AI assistant and sandbox on your virtual server.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
  },
};

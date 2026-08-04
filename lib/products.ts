export type ProductId =
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
  paddlePriceId?: string;
};

export const PRODUCT_CATALOG: Record<ProductId, ProductConfig> = {
  
  "founders-combo": {
    id: "founders-combo",
    name: "Founder's Combo (Hosting/Remote Access/Commerce/AI)",
    description:
      "Includes Friends & Family Hosting, Remote Access + Custom Subdomain, Peer-to-Peer Commerce & App Store, and AI Package.",
    unitAmount: 17500,
    priceLabel: "$175 first 500 signups",
    paddlePriceId: "pri_01kytdyq8kr7w5njawj9xrxqyt",
  },
  "planet-identity": {
    id: "planet-identity",
    name: "Planet Identity",
    description: "Your own Urbit planet - a real identity on the network, owned by you.",
    unitAmount: 1000,
    priceLabel: "$10 one-time",
    paddlePriceId: "pri_01kytb6k45tez9g0xwcs0h3vaz",
  },
  "friends-family-hosting": {
    id: "friends-family-hosting",
    name: "Friends & Family Hosting",
    description: "Host servers for your friends and family under your own infrastructure.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
    paddlePriceId: "pri_01kyta8jh8nra5nk401na09wvm",
  },
  "remote-access-custom-subdomain": {
    id: "remote-access-custom-subdomain",
    name: "Remote Access + Custom Subdomain",
    description: "Access your server remotely with your own subdomain (yourname.orraah.com).",
    unitAmount: 5000,
    priceLabel: "$50 one-time (first 500 signups)",
    paddlePriceId: "pri_01kytaaxxb5g2e7spwp4tg8vk6",
  },
  "p2p-commerce-app-store": {
    id: "p2p-commerce-app-store",
    name: "Peer-to-Peer Commerce & App Store",
    description: "Buy, sell, and discover apps directly with other Orraah users.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
    paddlePriceId: "pri_01kz7f4dkmkrh5209mk4dwexpk",
  },
  "ai-package": {
    id: "ai-package",
    name: "AI Package",
    description: "Run your own AI assistant and sandbox on your virtual server.",
    unitAmount: 5000,
    priceLabel: "$50 first 500 signups",
    paddlePriceId: "pri_01kyte027mpmdzc52aj7wbh9zb",
  },
};

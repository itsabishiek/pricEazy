import { env } from "./env/server";

export type TierNames = keyof typeof subscriptionTiers;
export type PaidTierNames = Exclude<TierNames, "Starter">;

export const subscriptionTiers = {
  Starter: {
    name: "Starter",
    priceInPaise: 0,
    maxNumberOfProducts: 1,
    maxNumberOfVisits: 5000,
    canAccessAnalytics: false,
    canCustomizeBanner: false,
    canRemoveBranding: false,
    stripePriceId: null,
  },
  Standard: {
    name: "Standard",
    priceInPaise: 39900,
    maxNumberOfProducts: 5,
    maxNumberOfVisits: 10000,
    canAccessAnalytics: true,
    canCustomizeBanner: false,
    canRemoveBranding: true,
    stripePriceId: env.STRIPE_STANDARD_PRICE_ID,
  },
  Pro: {
    name: "Pro",
    priceInPaise: 79900,
    maxNumberOfProducts: 30,
    maxNumberOfVisits: 100000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: env.STRIPE_PRO_PRICE_ID,
  },
  Elite: {
    name: "Elite",
    priceInPaise: 99900,
    maxNumberOfProducts: 50,
    maxNumberOfVisits: 1000000,
    canAccessAnalytics: true,
    canCustomizeBanner: true,
    canRemoveBranding: true,
    stripePriceId: env.STRIPE_ELITE_PRICE_ID,
  },
} as const;

export const subscriptionTiersInOrder = [
  subscriptionTiers.Starter,
  subscriptionTiers.Standard,
  subscriptionTiers.Pro,
  subscriptionTiers.Elite,
] as const;

export function getTierByPriceId(stripePriceId: string) {
  return Object.values(subscriptionTiers).find(
    (tier) => tier.stripePriceId === stripePriceId
  );
}

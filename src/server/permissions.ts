import { getProductCount } from "./db/products";
import { getProductViewCount } from "./db/productViews";
import { getUserSubscriptionTier } from "./db/subscription";
import { startOfMonth } from "date-fns";

export async function canRemoveBranding(userId: string) {
  if (!userId) return false;

  const tier = await getUserSubscriptionTier(userId);

  return tier.canRemoveBranding;
}

export async function canCustomizeBanner(userId: string) {
  if (!userId) return false;

  const tier = await getUserSubscriptionTier(userId);

  return tier.canCustomizeBanner;
}

export async function canAccessAnalytics(userId: string) {
  if (!userId) return false;

  const tier = await getUserSubscriptionTier(userId);

  return tier.canAccessAnalytics;
}

export async function canShowDiscountBanner(userId: string | null) {
  if (userId == null) return false;
  const tier = await getUserSubscriptionTier(userId);
  const productViews = await getProductViewCount(
    userId,
    startOfMonth(new Date())
  );

  return productViews < tier.maxNumberOfVisits;
}

export async function canCreateProduct(userId: string) {
  if (!userId) return false;

  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);

  return productCount < tier.maxNumberOfProducts;
}

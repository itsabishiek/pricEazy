import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(userId: string) {
  const [subscriptions, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, userId))
      .returning({
        id: UserSubscriptionTable.id,
      }),
    db
      .delete(ProductTable)
      .where(eq(ProductTable.clerkUserId, userId))
      .returning({ id: ProductTable.id }),
  ]);

  subscriptions.forEach((subs) => {
    revalidateDbCache({
      tag: CACHE_TAGS.subscription,
      userId: userId,
      id: subs.id,
    });
  });
  products.forEach((prod) => {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: userId,
      id: prod.id,
    });
  });

  return [subscriptions, products];
}

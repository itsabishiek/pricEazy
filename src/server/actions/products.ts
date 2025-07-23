"use server";

import {
  productCountryDiscountSchema,
  productCustomizationSchema,
  productDetailsSchema,
} from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  createProduct as createProductDB,
  updateProduct as updateProductDB,
  deleteProduct as deleteProductDB,
  updateCountryDiscounts as updateCountryDiscountsDB,
  updateProductCustomization as updateProductCustomizationDB,
} from "@/server/db/products";
import { redirect } from "next/navigation";
import { canCustomizeBanner } from "../permissions";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error creating your product!",
    };
  }

  const { id } = await createProductDB({ ...data, clerkUserId: userId });

  redirect(`/dashboard/products/${id}/tab=countries`);
}

export async function updateProduct(
  productId: string,
  unsafeData: z.infer<typeof productDetailsSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);
  const errorMessage = "There was an error updating your product!";

  if (!success || userId == null) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isSuccess = await updateProductDB(data, { productId, userId });

  return {
    error: !isSuccess,
    message: isSuccess ? "Product details updated!" : errorMessage,
  };
}

export async function deleteProduct(productId: string) {
  const { userId } = await auth();
  const errorMessage = "There was an error deleting your product!";

  if (userId == null) {
    return {
      error: true,
      message: errorMessage,
    };
  }

  const isSuccess = await deleteProductDB(productId, userId);

  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted your product" : errorMessage,
  };
}

export async function updateCountryDiscounts(
  productId: string,
  unsafeData: z.infer<typeof productCountryDiscountSchema>
) {
  const { userId } = await auth();
  const { success, data } = productCountryDiscountSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return {
      error: true,
      message: "There was an error saving your country discounts",
    };
  }

  const insert: {
    countryGroupId: string;
    productId: string;
    coupon: string;
    discountPercentage: number;
  }[] = [];
  const deleteIds: { countryGroupId: string }[] = [];

  data.groups.forEach((group) => {
    if (
      group.coupon != null &&
      group.coupon.length > 0 &&
      group.discountPercentage != null &&
      group.discountPercentage > 0
    ) {
      insert.push({
        countryGroupId: group.countryGroupId,
        coupon: group.coupon,
        discountPercentage: group.discountPercentage,
        productId,
      });
    } else {
      deleteIds.push({ countryGroupId: group.countryGroupId });
    }
  });

  await updateCountryDiscountsDB(deleteIds, insert, { productId, userId });

  return { error: false, message: "Country discounts updated!" };
}

export async function updateProductCustomization(
  productId: string,
  unsafeData: z.infer<typeof productCustomizationSchema>
) {
  const { userId } = await auth();
  if (userId == null) return;

  const { success, data } = productCustomizationSchema.safeParse(unsafeData);
  const canCustomize = await canCustomizeBanner(userId);

  if (!success || !canCustomize) {
    return {
      error: true,
      message: "There was an error updating your banner",
    };
  }

  await updateProductCustomizationDB(data, { productId, userId });

  return { error: false, message: "Banner Customization updated" };
}

import Banner from "@/components/banner";
import { env } from "@/data/env/server";
import { getProductForBanner } from "@/server/db/products";
import { createProductView } from "@/server/db/productViews";
import { canRemoveBranding, canShowDiscountBanner } from "@/server/permissions";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { createElement } from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const headerMap = headers();
  const requestingUrl =
    (await headerMap).get("referer") || (await headerMap).get("origin");
  if (requestingUrl == null) return notFound();

  const countryCode = getCountryCode(req);
  if (countryCode == null) return notFound();

  const { product, discount, country } = await getProductForBanner({
    id: productId,
    countryCode,
    url: requestingUrl,
  });
  if (product == null) return notFound();

  const canShowBanner = await canShowDiscountBanner(product.clerkUserId);

  await createProductView({
    productId: product.id,
    countryId: country?.id,
    userId: product.clerkUserId,
  });

  if (!canShowBanner) return notFound();
  if (country == null || discount == null) return notFound();

  return new Response(
    await getJavaScript(
      product,
      country,
      discount,
      await canRemoveBranding(product.clerkUserId)
    ),
    { headers: { "content-type": "text/javascript" }, status: 200 }
  );
}

function getCountryCode(
  req: NextRequest & {
    geo?: {
      country?: string;
      city?: string;
      region?: string;
    };
  }
) {
  if (req.geo?.country != null) return req.geo.country;

  if (process.env.NODE_ENV === "development") {
    return env.TEST_COUNTRY_CODE;
  }
}

async function getJavaScript(
  product: {
    customization: {
      locationMessage: string;
      bannerContainer: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      borderRadius: string;
      isSticky: boolean;
      classPrefix?: string | null;
    };
  },
  country: { name: string },
  discount: { coupon: string; percentage: number },
  canRemoveBranding: boolean
) {
  const { renderToStaticMarkup } = await import("react-dom/server");

  return `
        const banner = document.createElement("div");
        banner.innerHTML = '${renderToStaticMarkup(
          createElement(Banner, {
            message: product.customization.locationMessage,
            mappings: {
              country: country.name,
              coupon: discount.coupon,
              discount: discount.percentage.toString(),
            },
            customization: product.customization,
            canRemoveBranding: canRemoveBranding,
          })
        )}';

        document.querySelector("${
          product.customization.bannerContainer
        }").prepend(...banner.children);
    `.replace(/(\r\n|\n|\r)/g, "");
}

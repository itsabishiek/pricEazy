import HasPermission from "@/components/has-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByPPPChartData,
} from "@/server/db/productViews";
import { canAccessAnalytics } from "@/server/permissions";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import ViewsByCountryChart from "../_components/charts/views-by-country-chart";
import ViewsByPPPChart from "../_components/charts/views-by-ppp-chart";
import ViewsByDayChart from "../_components/charts/views-by-day-chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createURL } from "@/lib/utils";
import { getProducts } from "@/server/db/products";
import { ChevronDown } from "lucide-react";
import TimezoneDropdownMenuItem from "../_components/timezone-dropdown-menu-item";

type AnalyticsPageProps = {
  searchParams: Promise<{
    interval?: string;
    timezone?: string;
    productId?: string;
  }>;
};

const AnalyticsPage: React.FC<AnalyticsPageProps> = async ({
  searchParams,
}) => {
  const { interval: interl, productId, timezone } = await searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const interval =
    CHART_INTERVALS[interl as keyof typeof CHART_INTERVALS] ??
    CHART_INTERVALS.last7Days;

  return (
    <>
      <div className="mb-6 flex justify-between items-baseline">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:border-input">
                {Object.entries(CHART_INTERVALS).map(async ([key, value]) => (
                  <DropdownMenuItem
                    asChild
                    key={key}
                    className="cursor-pointer"
                  >
                    <Link
                      href={createURL(
                        "/dashboard/analytics",
                        await searchParams,
                        { interval: key }
                      )}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown
              userId={userId}
              searchParams={await searchParams}
              selectedProductId={productId}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {timezone ?? "UTC"}
                  <ChevronDown className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:border-input">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href={createURL(
                      "/dashboard/analytics",
                      await searchParams,
                      { timezone: "UTC" }
                    )}
                  >
                    UTC
                  </Link>
                </DropdownMenuItem>
                <TimezoneDropdownMenuItem searchParams={await searchParams} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewsByDayCard
            interval={interval}
            timezone={timezone || "UTC"}
            userId={userId}
            productId={productId}
          />
          <ViewsByPPPCard
            interval={interval}
            timezone={timezone || "UTC"}
            userId={userId}
            productId={productId}
          />
          <ViewsByCountryCard
            interval={interval}
            timezone={timezone || "UTC"}
            userId={userId}
            productId={productId}
          />
        </div>
      </HasPermission>
    </>
  );
};
export default AnalyticsPage;

async function ProductDropdown({
  searchParams,
  userId,
  selectedProductId,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId, {});

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDown className="size-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:border-input">
        <DropdownMenuItem asChild>
          <Link
            href={createURL("/dashboard/analytics", searchParams, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createURL("/dashboard/analytics", searchParams, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card className="dark:border-none">
      <CardHeader>
        <CardTitle className="text-lg">Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByPPPCard(
  props: Parameters<typeof getViewsByPPPChartData>[0]
) {
  const chartData = await getViewsByPPPChartData(props);

  return (
    <Card className="dark:border-none">
      <CardHeader>
        <CardTitle className="text-lg">Visitors Per PPP Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByPPPChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewsByCountryCard(
  props: Parameters<typeof getViewsByCountryChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card className="dark:border-none">
      <CardHeader>
        <CardTitle className="text-lg">Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

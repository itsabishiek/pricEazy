import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import NoProducts from "./_components/no-products";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import ProductGrid from "./_components/product-grid";
import HasPermission from "@/components/has-permission";
import { canAccessAnalytics } from "@/server/permissions";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productViews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewsByDayChart from "./_components/charts/views-by-day-chart";

type DashboardPageProps = {};

const DashboardPage: React.FC<DashboardPageProps> = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId === null) return redirectToSignIn();

  const products = await getProducts(userId, { limit: 6 });

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {products.length !== 0 && (
          <Button asChild>
            <Link href="/dashboard/products/create">
              <Plus />
              <span className="hidden md:block">Create Product</span>
            </Link>
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <NoProducts />
      ) : (
        <div className="mt-5">
          <ProductGrid products={products} />
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Link
          href="/dashboard/analytics"
          className="group flex items-center gap-2"
        >
          <span className="hidden md:block group-hover:text-primary">
            View more
          </span>
          <ArrowRight size={20} className="group-hover:text-primary" />
        </Link>
      </div>

      <HasPermission permission={canAccessAnalytics} renderFallback>
        <AnalyticsCharts userId={userId} />
      </HasPermission>
    </div>
  );
};
export default DashboardPage;

async function AnalyticsCharts({ userId }: { userId: string }) {
  const chartData = await getViewsByDayChartData({
    userId,
    interval: CHART_INTERVALS.last7Days,
    timezone: "UTC",
  });

  return (
    <Card className="mt-5 dark:border-none">
      <CardHeader>
        <CardTitle>Views by Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewsByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

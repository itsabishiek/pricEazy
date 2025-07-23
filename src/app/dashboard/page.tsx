import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import NoProducts from "./_components/no-products";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductGrid from "./_components/product-grid";
import { canCreateProduct } from "@/server/permissions";

type DashboardPageProps = {};

const DashboardPage: React.FC<DashboardPageProps> = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId === null) return redirectToSignIn();

  const products = await getProducts(userId, { limit: 6 });
  const canAddProduct = await canCreateProduct(userId);

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
    </div>
  );
};
export default DashboardPage;

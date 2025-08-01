import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import NoProducts from "../_components/no-products";
import ProductGrid from "../_components/product-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

type ProductsPageProps = {};

const ProductsPage: React.FC<ProductsPageProps> = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId === null) return redirectToSignIn();

  const products = await getProducts(userId, {});

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
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
export default ProductsPage;

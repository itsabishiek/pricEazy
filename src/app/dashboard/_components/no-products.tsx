import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type NoProductsProps = {};

const NoProducts: React.FC<NoProductsProps> = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3">
      <Image
        src="/img/no-products.svg"
        alt="no-products"
        width={300}
        height={300}
      />
      <h1 className="text-4xl font-semibold">You have no products</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Get started with PPP discounts by creating a product
      </p>

      <Button size="lg" asChild className="mt-3">
        <Link href="/dashboard/products/create">Create Product</Link>
      </Button>
    </div>
  );
};
export default NoProducts;

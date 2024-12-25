import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@clerk/nextjs/server";
import { getProduct } from "@/server/db/products";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductDetailsForm from "@/app/dashboard/_components/forms/product-details-form";

type EditProductPageProps = {
  params: {
    productId: string;
  };
  searchParams: {
    tab?: string;
  };
};

const EditProductPage: React.FC<EditProductPageProps> = async ({
  params,
  searchParams,
}) => {
  const { userId, redirectToSignIn } = await auth();
  const { productId } = await params;
  const { tab } = await searchParams;

  if (userId == null) return redirectToSignIn();

  const product = await getProduct(userId, productId);

  if (!product) return notFound();

  return (
    <div className="max-w-screen-md w-full mx-auto">
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full h-[60px] bg">
          <TabsTrigger value="details" className="h-[45px]">
            Product Details
          </TabsTrigger>
          <TabsTrigger value="countries" className="h-[45px]">
            Countries
          </TabsTrigger>
          <TabsTrigger value="customization" className="h-[45px]">
            Customization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="countries">
          <CountriesTab productId={product.id} userId={product.clerkUserId} />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationTab
            productId={product.id}
            userId={product.clerkUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default EditProductPage;

const DetailsTab = ({
  product,
}: {
  product: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) => {
  return (
    <Card className="dark:border-input">
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  );
};

const CountriesTab = ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  return (
    <Card className="dark:border-input">
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <ProductDetailsForm product={product} /> */}
      </CardContent>
    </Card>
  );
};

const CustomizationTab = ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  return (
    <Card className="dark:border-input">
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <ProductDetailsForm product={product} /> */}
      </CardContent>
    </Card>
  );
};
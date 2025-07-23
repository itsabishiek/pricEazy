import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@clerk/nextjs/server";
import {
  getProduct,
  getProductCountryGroups,
  getProductCustomization,
} from "@/server/db/products";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductDetailsForm from "@/app/dashboard/_components/forms/product-details-form";
import CountryDiscountForm from "@/app/dashboard/_components/forms/country-discount-form";
import ProductCustomizationForm from "@/app/dashboard/_components/forms/product-customization-form";
import { canCustomizeBanner, canRemoveBranding } from "@/server/permissions";

type EditProductPageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ tab?: string }>;
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

const CountriesTab = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const countryGroups = await getProductCountryGroups(productId, userId);

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
        <CountryDiscountForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  );
};

const CustomizationTab = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const customization = await getProductCustomization(productId, userId);
  if (!customization) return notFound();

  return (
    <Card className="dark:border-input">
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
        <CardDescription>
          Customize the banner style based on your website theme. You can also
          style it yourself using CSS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          customization={customization}
          canRemoveBranding={await canRemoveBranding(userId)}
          canCustomizeBanner={await canCustomizeBanner(userId)}
        />
      </CardContent>
    </Card>
  );
};

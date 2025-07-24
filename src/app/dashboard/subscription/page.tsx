import PricingCard from "@/app/(marketing)/_components/pricing-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  subscriptionTiers,
  subscriptionTiersInOrder,
} from "@/data/subscriptionTiers";
import { formatToCompactNumber } from "@/lib/formatters";
import { createCustomerPortalSession } from "@/server/actions/stripe";
import { getProductCount } from "@/server/db/products";
import { getUserSubscriptionTier } from "@/server/db/subscription";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type SubscriptionPageProps = {};

const SubscriptionPage: React.FC<SubscriptionPageProps> = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (userId === null) return redirectToSignIn();

  const tier = await getUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);

  const handleCreateCustomerPortal = async () => {
    "use server";

    await createCustomerPortalSession();
  };

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="dark:border-input">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                0 / {formatToCompactNumber(tier.maxNumberOfVisits)} pricing page
                visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress className="h-3" />
            </CardContent>
          </Card>
          <Card className="dark:border-input">
            <CardHeader>
              <CardTitle className="text-lg">Number of products</CardTitle>
              <CardDescription>
                {productCount} / {tier.maxNumberOfProducts} products created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(productCount / tier.maxNumberOfProducts) * 100}
                className="h-3"
              />
            </CardContent>
          </Card>
        </div>

        {tier != subscriptionTiers.Starter && (
          <Card className="dark:border-input">
            <CardHeader>
              <CardTitle className="text-lg">
                You are currently on the {tier.name} plan
              </CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleCreateCustomerPortal}>
                <Button>Manage Subscription</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
        {subscriptionTiersInOrder.map((t) => (
          <PricingCard
            key={t.name}
            {...t}
            currentTierName={tier.name}
            isDashboard={true}
          />
        ))}
      </div>
    </>
  );
};
export default SubscriptionPage;

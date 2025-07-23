import { Button } from "@/components/ui/button";
import { subscriptionTiersInOrder, TierNames } from "@/data/subscriptionTiers";
import { formatToCompactNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import {
  createCancelSession,
  createCheckoutSession,
} from "@/server/actions/stripe";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type PricingCardProps = (typeof subscriptionTiersInOrder)[number] & {
  isDashboard?: boolean;
  currentTierName?: TierNames;
};

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  priceInPaise,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  isDashboard,
  currentTierName,
}) => {
  const isMostPopular = name === "Pro";
  const isCurrent = currentTierName === name;

  const handleSubmit = async () => {
    "use server";

    if (name === "Starter") {
      await createCancelSession();
    } else {
      await createCheckoutSession(name);
    }
  };

  return (
    <div
      className={`${
        isMostPopular
          ? "bg-gradient-to-r from-red-500 to-orange-500 md:scale-100"
          : "bg-primary/20 dark:bg-accent/65"
      } p-2 rounded-md`}
    >
      {isMostPopular && (
        <div>
          <p className="text-center mb-2 font-bold text-white">Most Popular</p>
        </div>
      )}
      <div
        className={`${
          isMostPopular ? "bg-accent/50" : "bg-transparent"
        } flex flex-col gap-4  p-5 rounded-md`}
      >
        <h3
          className={`text-gray-800 dark:text-gray-200 font-semibold text-xl`}
        >
          {name}
        </h3>

        <h2 className="text-2xl font-extrabold">
          ${priceInPaise / 100} <span className="font-normal text-xl">/mo</span>
        </h2>

        <p>
          <b>{formatToCompactNumber(maxNumberOfVisits)}</b> pricing page
          visits/mo
        </p>

        {isDashboard ? (
          <form action={handleSubmit}>
            <Button
              disabled={isCurrent}
              className={`${
                name === "Elite"
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : isMostPopular
                  ? "bg-white text-black dark:text-black hover:bg-gray-100"
                  : ""
              } w-full`}
              size="lg"
            >
              {isCurrent ? "Current" : "Swap"}
            </Button>
          </form>
        ) : (
          <Button
            className={`${
              name === "Elite"
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : isMostPopular
                ? "bg-white text-black dark:text-black hover:bg-gray-100"
                : ""
            }`}
            size="lg"
            asChild
          >
            <Link href="/sign-in">Get started</Link>
          </Button>
        )}

        <div className="flex flex-col gap-3 items-start">
          <Feature className="font-bold">
            {maxNumberOfProducts}{" "}
            {maxNumberOfProducts === 1 ? "product" : "products"}
          </Feature>
          <Feature>PPP discounts</Feature>
          {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
          {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
          {canCustomizeBanner && <Feature>Banner customization</Feature>}
        </div>
      </div>
    </div>
  );
};
export default PricingCard;

function Feature({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon
        className={`size-4 stroke-accent bg-gray-900 dark:bg-primary/90 rounded-full p-0.5`}
      />
      <span>{children}</span>
    </div>
  );
}

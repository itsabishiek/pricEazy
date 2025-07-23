// stripe listen --forward-to localhost:3000/api/webhooks/stripe

import { env } from "@/data/env/server";
import { getTierByPriceId, subscriptionTiers } from "@/data/subscriptionTiers";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { updateUserSubscription } from "@/server/db/subscription";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "customer.subscription.created": {
      await handleCreateSubscription(event.data.object);
      break;
    }
    case "customer.subscription.updated": {
      await handleUpdateSubscription(event.data.object);
      break;
    }
    case "customer.subscription.deleted": {
      await handleDeleteSubscription(event.data.object);
      break;
    }
  }

  return new Response(null, { status: 200 });
}

async function handleCreateSubscription(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  const clerkUserId = subscription.metadata.clerkUserId;
  if (clerkUserId == null || tier == null) {
    return new Response(null, { status: 400 });
  }

  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    eq(UserSubscriptionTable.clerkUserId, clerkUserId),
    {
      stripeCustomerId: customerId,
      tier: tier.name,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionItemId: subscription.items.data[0].id,
    }
  );
}

async function handleUpdateSubscription(subscription: Stripe.Subscription) {
  const tier = getTierByPriceId(subscription.items.data[0].price.id);
  if (tier == null) {
    return new Response(null, { status: 400 });
  }

  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    { tier: tier.name }
  );
}

async function handleDeleteSubscription(subscription: Stripe.Subscription) {
  const customer = subscription.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

  return await updateUserSubscription(
    eq(UserSubscriptionTable.stripeCustomerId, customerId),
    {
      tier: subscriptionTiers.Starter.name,
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
    }
  );
}

import { env } from "@/data/env/server";
import { createUserSubscription } from "@/server/db/subscription";
import { deleteUser } from "@/server/db/users";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      await createUserSubscription({
        clerkUserId: event.data.id,
        tier: "Starter",
      });
      break;
    }
    case "user.deleted": {
      if (event.data.id != null) {
        await deleteUser(event.data.id);
      }
      //  TODO: Remove stripe subscription
    }
  }

  return new Response("Webhook received", { status: 200 });
}

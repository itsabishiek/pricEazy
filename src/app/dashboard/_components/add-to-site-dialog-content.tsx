"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { CopyCheckIcon, CopyIcon, CopyXIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type AddToSiteDialogContentProps = {
  productId: string;
};

type CopyState = "idle" | "copied" | "error";

const AddToSiteDialogContent: React.FC<AddToSiteDialogContentProps> = ({
  productId,
}) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}/banner"></script>`;
  const Icon = getCopyIcon(copyState);

  return (
    <DialogContent className="max-w-2xl dark:border-input">
      <DialogHeader>
        <DialogTitle>Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is, copy the below script into your site and your
          customers will start seeing PPP discounts!
        </DialogDescription>
      </DialogHeader>

      <pre className="w-full overflow-x-auto bg-secondary p-3 rounded-md max-w-screen-xl text-gray-400">
        <code>{code}</code>
      </pre>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState("copied");
                setTimeout(() => setCopyState("idle"), 2000);
              })
              .catch(() => {
                setCopyState("error");
                setTimeout(() => setCopyState("idle"), 2000);
              });
          }}
        >
          <Icon className="size-4 mr-1" />
          {getCopyText(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/products/${productId}/edit?tab=customization`}
            >
              Customise
            </Link>
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
};

export default AddToSiteDialogContent;

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return CopyIcon;
    case "copied":
      return CopyCheckIcon;
    case "error":
      return CopyXIcon;
  }
}

function getCopyText(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copy Code";
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
  }
}

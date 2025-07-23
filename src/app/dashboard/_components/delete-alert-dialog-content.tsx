"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteProduct } from "@/server/actions/products";
import React, { useTransition } from "react";

type DeleteAlertDialogContentProps = {
  productId: string;
};

const DeleteAlertDialogContent: React.FC<DeleteAlertDialogContentProps> = ({
  productId,
}) => {
  const { toast } = useToast();
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <AlertDialogContent className="dark:border-input">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startDeleteTransition(async () => {
              const data = await deleteProduct(productId);

              if (data.message) {
                toast({
                  title: data.error ? "Error" : "Success",
                  description: data.message,
                  variant: data.error ? "destructive" : "default",
                });
              }
            });
          }}
          disabled={isDeletePending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
export default DeleteAlertDialogContent;

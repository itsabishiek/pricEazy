"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/data/env/client";
import { useToast } from "@/hooks/use-toast";
import { productDetailsSchema } from "@/schemas/products";
import { createProduct, updateProduct } from "@/server/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CopyState,
  getCopyIcon,
  getCopyText,
} from "../add-to-site-dialog-content";

type ProductDetailsFormProps = {
  product?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
};

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({ product }) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product.description ?? "" }
      : {
          name: "",
          url: "",
          description: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof productDetailsSchema>) => {
    const action =
      product == null ? createProduct : updateProduct.bind(null, product.id);
    const data = await action(values);

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  };

  const [copyState, setCopyState] = useState<CopyState>("idle");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${product?.id}/banner"></script>`;
  const Icon = getCopyIcon(copyState);

  return (
    <>
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your website URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Include the protocol (http/https) and the full path to the
                    sales page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Descriptiom</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-20" {...field} />
                  </FormControl>
                  <FormDescription>
                    An optional description to help distinguish your product
                    from other products
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-2">
            <Button
              disabled={form.formState.isSubmitting}
              size="lg"
              type="submit"
            >
              {product == null ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8 mb-4">
        <h2 className="font-semibold text-xl">Add to Site</h2>
        <p className="text-muted-foreground text-sm mt-1">
          All you need to do is, copy the below script into your site and your
          customers will start seeing PPP discounts!
        </p>

        <pre className="mt-4 w-full overflow-x-auto bg-secondary p-3 rounded-md max-w-screen-xl text-gray-400">
          <code>{`<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${product?.id}/banner"></script>`}</code>
        </pre>

        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="secondary"
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
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/products/${product?.id}/edit?tab=customization`}
            >
              Customise
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
export default ProductDetailsForm;

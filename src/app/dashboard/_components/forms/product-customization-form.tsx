"use client";

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
import { Switch } from "@/components/ui/switch";
import { productCustomizationSchema } from "@/schemas/products";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Banner from "@/components/banner";
import { updateProductCustomization } from "@/server/actions/products";
import { useToast } from "@/hooks/use-toast";
import NoPermissionCard from "@/components/no-permission-card";

type ProductCustomizationFormProps = {
  customization: {
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    borderRadius: string;
    bannerContainer: string;
    isSticky: boolean;
    classPrefix: string | null;
  };
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
};

const ProductCustomizationForm: React.FC<ProductCustomizationFormProps> = ({
  customization,
  canRemoveBranding,
  canCustomizeBanner,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productCustomizationSchema>>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof productCustomizationSchema>
  ) => {
    const data = await updateProductCustomization(
      customization.productId,
      values
    );

    if (data?.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  };

  const formValues = form.watch();

  return (
    <>
      <div>
        <Banner
          customization={formValues}
          canRemoveBranding={canRemoveBranding}
          message={formValues.locationMessage}
          mappings={{
            country: "India",
            coupon: "HALF-OFF",
            discount: "50",
          }}
        />
      </div>

      {!canCustomizeBanner && (
        <div className="mt-5">
          <NoPermissionCard />
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col mt-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => (
                <FormItem className="md:col-span-4">
                  <FormLabel>Message PPP Discount</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={!canCustomizeBanner}
                      {...field}
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormDescription>
                    {"Data Parameters: {country}, {coupon}, {discount}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSticky"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sticky?</FormLabel>
                  <FormControl>
                    <Switch
                      className="block"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!canCustomizeBanner}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background color</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text color</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font size</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="borderRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Border Radius</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerContainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner container</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormDescription>
                    HTML container selector where you want to place the banner.
                    Ex: #container, .container, body
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classPrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CSS Prefix</FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormDescription>
                    An optional prefix added to all CSS classes to avoid
                    conflicts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {canCustomizeBanner && (
            <div>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="px-10"
              >
                Save
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};
export default ProductCustomizationForm;

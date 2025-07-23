"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { productCountryDiscountSchema } from "@/schemas/products";
import { updateCountryDiscounts } from "@/server/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CountryDiscountFormProps = {
  productId: string;
  countryGroups: {
    id: string;
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
      name: string;
      code: string;
    }[];
    discount?: {
      discountPercentage: number;
      coupon: string;
    };
  }[];
};

const CountryDiscountForm: React.FC<CountryDiscountFormProps> = ({
  productId,
  countryGroups,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productCountryDiscountSchema>>({
    resolver: zodResolver(productCountryDiscountSchema),
    defaultValues: {
      groups: countryGroups.map((countryGroup) => {
        const discount =
          countryGroup.discount?.discountPercentage ??
          countryGroup.recommendedDiscountPercentage! * 100;

        return {
          countryGroupId: countryGroup.id,
          discountPercentage:
            discount != null && discount != 0 ? discount : undefined,
          coupon: countryGroup.discount?.coupon ?? "",
        };
      }),
    },
  });

  const onSubmit = async (
    values: z.infer<typeof productCountryDiscountSchema>
  ) => {
    const data = await updateCountryDiscounts(productId, values);

    if (data.message) {
      toast({
        title: data.error ? "Error" : "Success",
        description: data.message,
        variant: data.error ? "destructive" : "default",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-5 flex-col"
      >
        <div className="self-end">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="px-10"
          >
            Save
          </Button>
        </div>

        {countryGroups.map((group, index) => (
          <Card key={group.id} className="dark:border-input">
            <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="">
                <h2 className="text-muted-foreground text-sm font-semibold mb-2">
                  {group.name}
                </h2>
                <div className="flex gap-2 flex-wrap w-full md:w-[300px]">
                  {group.countries.map((country) => (
                    <Image
                      key={country.code}
                      width={24}
                      height={16}
                      alt={country.name}
                      title={country.name}
                      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                      className="border"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center md:self-end gap-3">
                  <Input
                    type="hidden"
                    {...form.register(`groups.${index}.countryGroupId`)}
                  />
                  <FormField
                    control={form.control}
                    name={`groups.${index}.discountPercentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount %</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-24"
                            type="number"
                            value={field.value ?? ""}
                            min="0"
                            max="100"
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`groups.${index}.coupon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage>
                  {form.formState.errors.groups?.[index]?.root?.message}
                </FormMessage>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="self-start">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="px-10"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CountryDiscountForm;

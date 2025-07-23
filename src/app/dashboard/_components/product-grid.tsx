import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Album, Ellipsis } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddToSiteDialogContent from "./add-to-site-dialog-content";
import DeleteAlertDialogContent from "./delete-alert-dialog-content";

type ProductGridProps = {
  products: {
    id: string;
    name: string;
    url: string;
    description?: string | null;
  }[];
};

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};
export default ProductGrid;

const ProductCard = ({
  id,
  name,
  url,
  description,
}: {
  id: string;
  name: string;
  url: string;
  description?: string | null;
}) => {
  return (
    <Card className="shadow-md dark:border-input">
      <CardHeader>
        <div className="flex gap-3">
          <div className="flex items-center justify-center border dark:border-input p-3 rounded-md">
            <Album size="40" />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <CardTitle>
                <Link href={`/dashboard/products/${id}`}>{name}</Link>
              </CardTitle>
              <Dialog>
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="outline" className="size-8 p-0">
                        <div className="sr-only">Action Menu</div>
                        <Ellipsis className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dark:border-input">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/products/${id}/edit?tab=details`}
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DialogTrigger asChild>
                        <DropdownMenuItem>Add to site</DropdownMenuItem>
                      </DialogTrigger>

                      <DropdownMenuSeparator />

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DeleteAlertDialogContent productId={id} />
                </AlertDialog>

                <AddToSiteDialogContent productId={id} />
              </Dialog>
            </div>
            <CardDescription className="mt-2">{url}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

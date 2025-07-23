import React from "react";
import ProductDetailsForm from "../../_components/forms/product-details-form";
import HasPermission from "@/components/has-permission";
import { canCreateProduct } from "@/server/permissions";

type CreatePageProps = {};

const CreatePage: React.FC<CreatePageProps> = () => {
  return (
    <div className="max-w-screen-md w-full mx-auto">
      <h1 className="text-2xl font-semibold">Create Product</h1>

      <HasPermission
        permission={canCreateProduct}
        renderFallback
        fallbackText="You have already created the maximum number of products. Try upgrading your account to create more."
      >
        <div className="mt-8">
          <ProductDetailsForm />
        </div>
      </HasPermission>
    </div>
  );
};
export default CreatePage;

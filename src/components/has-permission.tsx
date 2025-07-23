import React from "react";
import NoPermissionCard from "./no-permission-card";
import { auth } from "@clerk/nextjs/server";

type HasPermissionProps = {
  permission: (userId: string) => Promise<boolean>;
  renderFallback?: boolean;
  fallbackText?: string;
  children: React.ReactNode;
};

const HasPermission: React.FC<HasPermissionProps> = async ({
  children,
  permission,
  fallbackText,
  renderFallback,
}) => {
  const { userId } = await auth();
  const hasPermission = await permission(userId as string);

  if (hasPermission) return children;
  if (renderFallback)
    return (
      <div className="mt-5">
        <NoPermissionCard>{fallbackText}</NoPermissionCard>
      </div>
    );
  return null;
};
export default HasPermission;

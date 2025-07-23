import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

type NoPermissionCardProps = {
  children?: React.ReactNode;
};

const NoPermissionCard: React.FC<NoPermissionCardProps> = ({
  children = "You do not have permission to perform this action. Try upgrading your account to access this feature.",
}) => {
  return (
    <Card className="dark:border-input">
      <CardHeader>
        <CardTitle className="text-xl">Permission Denied</CardTitle>
        <CardDescription className="text-[14.5px]">{children}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild size="sm">
          <Link href="/dashboard/subscription">Upgrade Account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
export default NoPermissionCard;

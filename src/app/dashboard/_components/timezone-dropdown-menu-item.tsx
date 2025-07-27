import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createURL } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type TimezoneDropdownMenuItemProps = {
  searchParams: Record<string, string>;
};

const TimezoneDropdownMenuItem: React.FC<TimezoneDropdownMenuItemProps> = ({
  searchParams,
}) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link
        href={createURL("/dashboard/analytics", searchParams, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
};
export default TimezoneDropdownMenuItem;

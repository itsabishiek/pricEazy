"use client";

import { useUser } from "@clerk/nextjs";
import {
  ChartNoAxesCombined,
  CircleUserRound,
  Landmark,
  LayoutPanelLeft,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarProps = {};

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="h-[calc(100vh-60px)] sticky top-[60px] p-5 hidden md:flex flex-col justify-between border-r border-input">
      <SidebarContents />
    </aside>
  );
};
export default Sidebar;

export const SidebarContents = () => {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-4 cursor-pointer p-3 rounded-md ${
            pathname === "/dashboard"
              ? "bg-primary hover:bg-primary/95"
              : "bg-transparent hover:bg-secondary"
          }`}
        >
          <LayoutPanelLeft />
          <h3 className="font-semibold text-lg">Dashboard</h3>
        </Link>
        <Link
          href="/dashboard/products"
          className={`flex items-center gap-4 cursor-pointer hover:bg-secondary p-3 rounded-md ${
            pathname === "/dashboard/products"
              ? "bg-primary hover:bg-primary/95"
              : "bg-transparent hover:bg-secondary"
          }`}
        >
          <Zap />
          <h3 className="font-semibold text-lg">Products</h3>
        </Link>
        <Link
          href="/dashboard/analytics"
          className={`flex items-center gap-4 cursor-pointer hover:bg-secondary p-3 rounded-md ${
            pathname === "/dashboard/analytics"
              ? "bg-primary hover:bg-primary/95"
              : "bg-transparent hover:bg-secondary"
          }`}
        >
          <ChartNoAxesCombined />
          <h3 className="font-semibold text-lg">Analytics</h3>
        </Link>
        <Link
          href="/dashboard/subscription"
          className={`flex items-center gap-4 cursor-pointer hover:bg-secondary p-3 rounded-md ${
            pathname === "/dashboard/subscription"
              ? "bg-primary hover:bg-primary/95"
              : "bg-transparent hover:bg-secondary"
          }`}
        >
          <Landmark />
          <h3 className="font-semibold text-lg">Subscription</h3>
        </Link>
      </div>

      <div
        className={`flex items-center gap-2 cursor-pointer hover:bg-secondary p-3 rounded-md`}
      >
        {user?.hasImage ? (
          <Image
            src={user?.imageUrl}
            alt="user-profile"
            width={35}
            height={35}
            className="rounded-full"
          />
        ) : (
          <CircleUserRound />
        )}

        <div className="w-full flex flex-col">
          <h3 className="font-semibold">{user?.fullName}</h3>
          <p className="text-gray-400 text-xs">
            {user?.emailAddresses[0]?.emailAddress?.length! > 25
              ? `${user?.emailAddresses[0]?.emailAddress.slice(0, 25)}...`
              : user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
      </div>
    </>
  );
};

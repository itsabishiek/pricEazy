"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ChartCandlestick, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { SidebarContents } from "./sidebar";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full h-[60px] sticky top-0 z-10 border-b bg-white dark:bg-[#121212] border-gray-600/30">
      <nav className="flex h-full items-center justify-between container px-5">
        <Link href="/dashboard" className="flex items-center gap-1">
          <ChartCandlestick className="text-primary" />
          <h1 className="font-bold text-xl">
            Pric<b className="text-primary">E</b>azy!
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <UserButton />

          <Sheet open={open} onOpenChange={() => setOpen(true)}>
            <div className="flex md:hidden">
              <SheetTrigger>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent
                className="dark:border-input sm:w-[300px]"
                onBlur={() => setOpen(false)}
              >
                <VisuallyHidden.Root>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden.Root>

                <div className="flex flex-col py-3 justify-between h-full">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-2 gap-1"
                  >
                    <ChartCandlestick className="text-primary" />
                    <h1 className="font-bold text-xl">
                      Pric<b className="text-primary">E</b>azy!
                    </h1>
                  </Link>
                  <SidebarContents />
                </div>
              </SheetContent>
            </div>
          </Sheet>

          <div className="hidden md:flex">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;

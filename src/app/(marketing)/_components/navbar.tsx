import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ChartCandlestick } from "lucide-react";
import Link from "next/link";
import React from "react";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="w-full h-[60px] sticky top-0 z-10 border-b bg-white dark:bg-[#121212] border-gray-600/30">
      <nav className="flex h-full items-center justify-between container px-5">
        <Link href="/" className="flex items-center gap-1">
          <ChartCandlestick className="text-primary" />
          <h1 className="font-bold text-xl">
            Pric<b className="text-primary">E</b>azy!
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Signup</Button>
            </SignUpButton>
          </SignedOut>

          <div className="hidden md:flex">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;

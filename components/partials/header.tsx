"use client";

import { useState, useEffect } from "react";
import {
  Moon,
  Search,
  Sun,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  User,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Search as you type — only on searchable listing pages
  const isSearchablePage =
    pathname === "/" || pathname === "/properties" || pathname === "/lands";

  // Live search-as-you-type on searchable listing pages only
  useEffect(() => {
    if (!isSearchablePage) return;

    const trimmed = debouncedSearchQuery.trim();

    let targetPath = "/";
    if (pathname.startsWith("/properties")) {
      targetPath = "/properties";
    } else if (pathname.startsWith("/lands")) {
      targetPath = "/lands";
    }

    if (trimmed) {
      router.push(`${targetPath}?q=${encodeURIComponent(trimmed)}`, {
        scroll: false,
      });
    } else {
      // Clear search if empty
      router.push(targetPath, { scroll: false });
    }
  }, [debouncedSearchQuery, pathname, router, isSearchablePage]);

  // On non-searchable pages, redirect to home listings on Enter
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSearchablePage) {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        router.push(`/?q=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="w-full border-b dark:border-neutral-800 border-neutral-300">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <div className="flex gap-2 items-center">
            <Image
              src="/brand/logo.png"
              height={30}
              width={30}
              alt=""
              className="dark:invert"
            />
            <p className="font-bold text-lg">odinala</p>
          </div>
        </Link>

        {/* Search bar - hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-md px-3 py-1.5 w-full max-w-sm mx-4">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search properties, lands, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>

        {/* Desktop nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 text-sm shrink-0">
          {/* <Link
            href="/"
            className={cn(
              "transition-colors",
              pathname === "/"
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </Link> */}
          <Link
            href="/properties"
            className={cn(
              "transition-colors",
              pathname.startsWith("/properties")
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Properties
          </Link>
          <Link
            href="/lands"
            className={cn(
              "transition-colors",
              pathname.startsWith("/lands")
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lands
          </Link>

          {/* Auth state */}
          {isPending ? (
            <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-foreground hover:text-muted-foreground transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <Link href="/my-account">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={28}
                    height={28}
                    className="rounded-full hover:ring-2 hover:ring-primary/50 transition-all"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium hover:ring-2 hover:ring-primary/50 transition-all">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </Link>

              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth/sign-in">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <Separator orientation="vertical" className="h-5" />

          {/* theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>
        </div>

        {/* Mobile: action buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="cursor-pointer p-1.5"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search properties, lands, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Mobile nav links */}
          <div className="px-4 py-2">
            <Link
              href="/"
              className={cn(
                "block py-2.5 text-sm transition-colors",
                pathname === "/"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              All Listings
            </Link>
            <Link
              href="/properties"
              className={cn(
                "block py-2.5 text-sm transition-colors",
                pathname.startsWith("/properties")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              Properties
            </Link>
            <Link
              href="/lands"
              className={cn(
                "block py-2.5 text-sm transition-colors",
                pathname.startsWith("/lands")
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              Lands
            </Link>

            <div className="h-px bg-border my-2" />

            {/* Auth state - mobile */}
            {isPending ? null : session ? (
              <>
                <Link
                  href="/my-account"
                  className={cn(
                    "flex items-center gap-2 py-2.5 text-sm transition-colors",
                    pathname.startsWith("/my-account")
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center gap-2 py-2.5 text-sm transition-colors",
                      pathname.startsWith("/dashboard")
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/sign-in" className="block py-2.5">
                <Button variant="default" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

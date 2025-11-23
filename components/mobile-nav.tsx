"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menuItems } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-client";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>DealDeck</SheetTitle>
          <SheetDescription>Select an area to manage.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || (pathname === "/" && item.href === "/dashboard");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}


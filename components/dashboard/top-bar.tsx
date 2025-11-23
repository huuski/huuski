"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { useI18n } from "@/lib/i18n-client";

export function TopBar() {
  const { t } = useI18n();

  return (
    <header className="flex flex-col gap-4 border-b bg-background px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <MobileNav />
      </div>
      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-3 py-1.5 lg:max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("menu.topBar.searchPlaceholder")}
            className="h-auto border-none p-0 focus-visible:ring-0"
            type="search"
          />
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}


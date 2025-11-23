"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Box,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n-client";

type MenuItem = {
  labelKey: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  sectionKey: string;
};

export const menuItems: MenuItem[] = [
  { labelKey: "menu.items.dashboard", href: "/dashboard", icon: LayoutDashboard, sectionKey: "menu.sections.overview" },
  { labelKey: "menu.items.executionFlow", href: "/products", icon: Package, sectionKey: "menu.sections.catalog" },
  { labelKey: "menu.items.products", href: "/products-list", icon: Box, sectionKey: "menu.sections.catalog" },
  { labelKey: "menu.items.services", href: "/services", icon: Wrench, sectionKey: "menu.sections.catalog" },
  { labelKey: "menu.items.customer", href: "/consumer", icon: Users, sectionKey: "menu.sections.catalog" },
  { labelKey: "menu.items.settings", href: "/settings", icon: Settings, sectionKey: "menu.sections.workspace" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const sections = Array.from(new Set(menuItems.map((item) => item.sectionKey)));

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card/60 p-4 lg:flex">
      <div className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
          HU
        </div>
        <div>
          <p className="text-sm font-semibold">Huuski</p>
          <p className="text-xs text-muted-foreground">Work in Progress</p>
        </div>
      </div>

      <nav className="mt-6 space-y-6 text-sm">
        {sections.map((sectionKey) => (
          <div key={sectionKey}>
            <p className="px-3 text-xs uppercase tracking-widest text-muted-foreground">
              {t(sectionKey)}
            </p>
            <div className="mt-2 space-y-1">
              {menuItems
                .filter((item) => item.sectionKey === sectionKey)
                .map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (pathname === "/" && item.href === "/dashboard");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <Separator className="my-4" />

    </aside>
  );
}


"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Lock, Bell, Trash2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-client";

type NavItem = {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

export function BottomNavBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { href: "/dashboard", icon: Lock, label: t("menu.pages.dashboard.title") },
    { href: "/notifications", icon: Bell, label: "Notificações" },
    { href: "/trash", icon: Trash2, label: "Lixeira" },
    { href: "/products-list", icon: ShoppingBag, label: t("menu.items.products") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-teal-500 p-4 lg:hidden">
      {/* Padrão de círculos sutis no fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-teal-400/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-teal-400/10 rounded-full blur-xl" />
      </div>

      {/* Card branco com navegação */}
      <div className="relative mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-lg px-6 py-5">
          <div className="flex items-center justify-around gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center transition-all",
                    "relative"
                  )}
                  aria-label={item.label}
                >
                  {isActive ? (
                    <div className="flex items-center justify-center w-11 h-11 bg-teal-500 rounded-full">
                      <Icon className="h-5 w-5 text-white stroke-[2]" />
                    </div>
                  ) : (
                    <Icon className="h-5 w-5 text-teal-500 stroke-[1.5]" />
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Linha divisória */}
          <div className="mt-4 h-px bg-gray-200" />
        </div>
      </div>
    </div>
  );
}


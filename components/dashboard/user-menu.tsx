"use client";

import { useTransition, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/actions/auth";
import { useI18n } from "@/lib/i18n-client";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export function UserMenu() {
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Buscar dados do usuário do cookie (via API route)
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Se falhar, usar dados padrão
        setUser({
          id: "",
          name: "Usuário",
          email: "",
        });
      });
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border px-2 py-1 text-left">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/avatar.png"} alt={user?.name || "Usuário"} />
            <AvatarFallback>{user ? getUserInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left text-sm leading-tight sm:block">
            <p className="font-medium">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="cursor-not-allowed opacity-50"
        >
          {t("menu.userMenu.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="cursor-not-allowed opacity-50"
        >
          {t("menu.userMenu.preferences")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          {isPending ? t("menu.userMenu.loggingOut") : t("menu.userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

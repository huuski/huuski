"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-client";

export function ThemeToggleCard() {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const prefersDark = resolvedTheme === "dark";
  const currentThemeLabel =
    theme === "system"
      ? `${t("preferences.theme.system")} (${systemTheme ?? "auto"})`
      : theme ?? "light";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{t("preferences.theme.title")}</CardTitle>
          <CardDescription>{t("preferences.theme.description")}</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="h-4 w-4" />
          <Switch
            checked={prefersDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Alternar modo escuro"
          />
          <Moon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">{t("preferences.theme.followSystem")}</p>
            <p className="text-xs text-muted-foreground">
              {t("preferences.theme.followSystemDesc")}
            </p>
          </div>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
          >
            {t("preferences.theme.useSystem")}
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">{t("preferences.theme.currentTheme")}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentThemeLabel}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(prefersDark ? "light" : "dark")}
          >
            {t("preferences.theme.toggle")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


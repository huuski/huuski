"use client";

import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-client";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n";
import { setLocaleAction } from "@/app/actions/i18n";

export function LanguageSelectorCard() {
  const { locale, setLocale, t } = useI18n();

  const handleLocaleChange = async (newLocale: Locale) => {
    setLocale(newLocale);
    await setLocaleAction(newLocale);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("preferences.language.title")}</CardTitle>
        <CardDescription>{t("preferences.language.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <span>{localeFlags[locale]}</span>
                <span>{localeNames[locale]}</span>
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full">
            {locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={locale === loc ? "bg-accent" : ""}
              >
                <span className="flex items-center gap-2">
                  <span>{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}


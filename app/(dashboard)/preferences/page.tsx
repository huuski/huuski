"use client";

import { ThemeToggleCard } from "@/components/settings/theme-toggle";
import { LanguageSelectorCard } from "@/components/settings/language-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n-client";

export default function PreferencesPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{t("preferences.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("preferences.description")}</p>
      </div>

      <ThemeToggleCard />
      <LanguageSelectorCard />

      <Card>
        <CardHeader>
          <CardTitle>{t("preferences.other.title")}</CardTitle>
          <CardDescription>{t("preferences.other.description")}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t("preferences.other.content")}
        </CardContent>
      </Card>
    </div>
  );
}


import React from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { GradientPageHeader } from "@/components/ui/GradientPageHeader";

export function StatisticsHeader() {
  const { t } = useTranslation();
  return (
    <GradientPageHeader
      icon={ChartBarIcon}
      title={t("statistics.pageTitle") || "Dashboard"}
      subtitle={t("statistics.pageSubtitle") || "Ödənişlər, işçi performansı, müraciətlər və şöbə statistikaları"}
      className="mb-6"
    />
  );
}

import React from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { GradientPageHeader } from "@/components/ui/GradientPageHeader";

export function DocumentsHeader() {
  const { t } = useTranslation();
  return (
    <GradientPageHeader
      icon={ChartBarIcon}
      title={t("documents.pageTitle") || "Documents"}
      subtitle={t("documents.pageSubtitle") || "Ödənişlər, işçi performansı, müraciətlər və şöbə statistikaları"}
      className="mb-6"
    />
  );
}

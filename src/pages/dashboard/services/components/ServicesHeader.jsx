import React from "react";
import { useTranslation } from "react-i18next";
import { PageHeaderBanner } from "@/components/ui/PageHeaderBanner";

export function ServicesHeader() {
  const { t } = useTranslation();
  return <PageHeaderBanner title={t("services.pageTitle")} />;
}


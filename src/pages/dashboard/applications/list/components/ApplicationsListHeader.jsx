import React from "react";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function ApplicationsListHeader() {
  const { getRgba: getMtkRgba } = useMtkColor();
  const { t } = useTranslation();

  return (
    <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border dark:border-gray-700">
      <h3 className="text-white font-bold">{t("applications.list.pageTitle")}</h3>
    </div>
  );
}


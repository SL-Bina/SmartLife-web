import React from "react";
import { useTranslation } from "react-i18next";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function ProfileHeader() {
  const { t } = useTranslation();
  const { getRgba, getActiveGradient } = useMtkColor();
  const title = t("profile.pageTitle");
  const subtitle = t("profile.subtitle");

  return (
    <div
      className="p-5 sm:p-6 rounded-xl shadow-lg border"
      style={{
        background: getActiveGradient(0.9, 0.7),
        borderColor: getRgba(0.3),
      }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg border border-white/30">
          <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <Typography variant="h4" className="text-white font-bold">
            {title && title !== "profile.pageTitle" ? title : "Profil"}
          </Typography>
          <Typography variant="small" className="text-white/80">
            {subtitle && subtitle !== "profile.subtitle" ? subtitle : "Hesab məlumatlarınız"}
          </Typography>
        </div>
      </div>
    </div>
  );
}

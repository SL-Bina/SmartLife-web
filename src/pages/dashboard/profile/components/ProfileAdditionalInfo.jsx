import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { CalendarIcon, UserCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ProfileAdditionalInfo({ user }) {
  const { t } = useTranslation();
  const additionalInfoLabel = t("profile.additionalInfo");
  const birthDateLabel = t("profile.birthDate");
  const personalCodeLabel = t("profile.personalCode");
  const formatDateTime = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString("az-AZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  const createdAt = user?.user_data?.created_at || "—";
  const updatedAt = user?.user_data?.updated_at || "—";

  return (
    <Card className="border dark:border-gray-700 shadow-sm dark:bg-gray-800 h-full">
      <CardBody className="p-5 dark:bg-gray-800 h-full flex flex-col">
        <Typography variant="h6" className="mb-3 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
          {additionalInfoLabel && additionalInfoLabel !== "profile.additionalInfo" ? additionalInfoLabel : "ƏLAVƏ MƏLUMATLAR"}
        </Typography>

        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 min-h-[84px]">
              <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  {birthDateLabel && birthDateLabel !== "profile.birthDate" ? birthDateLabel : "Doğum tarixi"}
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {user?.birthday
                    ? (() => {
                        const dateStr = user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday;
                        const date = new Date(dateStr);
                        return date.toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" });
                      })()
                    : "—"}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 min-h-[84px]">
              <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                <UserCircleIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  {personalCodeLabel && personalCodeLabel !== "profile.personalCode" ? personalCodeLabel : "Şəxsi kod"}
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {user?.personal_code || "—"}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 min-h-[84px]">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex-shrink-0">
                <ClockIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  Yaranma tarixi
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {formatDateTime(createdAt)}
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 min-h-[84px]">
              <div className="p-1.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg flex-shrink-0">
                <ClockIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                  Yenilənmə tarixi
                </Typography>
                <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                  {formatDateTime(updatedAt)}
                </Typography>
              </div>
            </div>

          </div>
        </div>
      </CardBody>
    </Card>
  );
}

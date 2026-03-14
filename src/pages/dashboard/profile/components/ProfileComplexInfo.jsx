import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ProfileComplexInfo({ user }) {
  const { t } = useTranslation();
  const complexInfoLabel = t("profile.complexInfo");
  const complexList = Array.isArray(user?.user_complex?.data) ? user.user_complex.data : [];

  return (
    <Card className="border dark:border-gray-700 shadow-sm dark:bg-gray-800 h-full">
      <CardBody className="p-5 dark:bg-gray-800 h-full flex flex-col">
        <Typography variant="h6" className="mb-2 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
          {complexInfoLabel && complexInfoLabel !== "profile.complexInfo" ? complexInfoLabel : "KOMPLEKS MƏLUMATLARI"}
        </Typography>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {complexList.length === 0 && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600">
              <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs">
                Məlumat yoxdur
              </Typography>
            </div>
          )}

          {complexList.map((complex) => (
            <Card
              key={complex.id}
              className="border border-green-200 dark:border-green-800 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20 w-full"
            >
              <CardBody className="p-3 flex items-center gap-3 min-h-[72px]">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg shadow-sm">
                  <HomeIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                    MTK
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-900 dark:text-white font-bold text-sm truncate">
                    {complex?.bind_mtk?.name || "-"}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs truncate mt-0.5">
                    {complex?.name || "-"}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

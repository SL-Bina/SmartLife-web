import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useComplexColor } from "@/hooks/useComplexColor";

export function ProfileSidebar({ user }) {
  const { t } = useTranslation();
  const { color, getRgba } = useComplexColor();

  const fullName = user?.name && user?.surname
    ? `${user.name} ${user.surname}`
    : user?.name || user?.surname || "Resident";

  const initials = ((user?.name?.[0] || "") + (user?.surname?.[0] || "")).toUpperCase() || "R";

  return (
    <div className="space-y-3 flex flex-col min-h-0">
      {/* ── Avatar card ── */}
      <div
        className="rounded-xl p-6 flex flex-col items-center text-center border shadow-md"
        style={{ background: `linear-gradient(135deg, ${color}, ${getRgba(0.75)})` }}
      >
        <div className="relative mb-3">
          {user?.profile_photo ? (
            <Avatar
              src={user.profile_photo}
              alt={fullName}
              size="xl"
              className="border-4 border-white/40 shadow-lg"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white/30"
              style={{ background: getRgba(0.4) }}
            >
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow" />
        </div>
        <p className="text-white font-bold text-base leading-tight">{fullName}</p>
        <p className="text-white/70 text-xs mt-0.5 truncate max-w-full">{user?.email || ""}</p>
        <span className="mt-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold border border-white/30 flex items-center gap-1">
          <UserCircleIcon className="h-3 w-3" /> RESIDENT
        </span>
      </div>

      {/* ── Contact rows ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0" style={{ background: getRgba(0.1) }}>
            <EnvelopeIcon className="h-4 w-4" style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{t("profile.email") || "E-poçt"}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.email || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0 bg-green-50 dark:bg-green-900/20">
            <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{t("profile.phone") || "Telefon"}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.phone || "N/A"}</p>
          </div>
        </div>
        {user?.properties?.length > 0 && (
          <div className="flex items-center gap-3 p-3.5">
            <div className="p-2 rounded-lg shrink-0 bg-purple-50 dark:bg-purple-900/20">
              <HomeIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{t("profile.properties") || "Mənzillər"}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.properties.length} {t("profile.property") || "mənzil"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


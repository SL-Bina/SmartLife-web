import React from "react";
import {
  Avatar,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  UserCircleIcon,
  UserIcon,
  BellIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function ProfileSidebar({ user }) {
  const { getRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();

  const fullName = user?.name && user?.surname
    ? `${user.name} ${user.surname}`
    : user?.name || user?.surname || "User";

  const initials = ((user?.name?.[0] || "") + (user?.surname?.[0] || "")).toUpperCase() || "U";
  const roleLabel = (user?.role?.name || user?.role || "USER").toUpperCase();
  const usernameLabel = t("profile.username");
  const emailLabel = t("profile.email");
  const phoneLabel = t("profile.phone");
  const propertiesLabel = t("profile.properties");
  const propertyLabel = t("profile.property");
  const notificationCount = Number(user?.notifications?.count || 0);
  const activeDeviceLabel = user?.active_device?.ip_address || "-";

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div
        className="rounded-xl p-6 sm:p-7 flex flex-col items-center text-center border shadow-md min-h-[184px] justify-center"
        style={{ background: getActiveGradient(0.9, 0.7), borderColor: getRgba(0.3) }}
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
          <UserCircleIcon className="h-3 w-3" /> {roleLabel}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden shadow-sm flex-1">
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0" style={{ background: getRgba(0.1) }}>
            <EnvelopeIcon className="h-4 w-4" style={{ color: getRgba(1) }} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{emailLabel && emailLabel !== "profile.email" ? emailLabel : "E-poçt"}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.email || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0 bg-green-50 dark:bg-green-900/20">
            <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{phoneLabel && phoneLabel !== "profile.phone" ? phoneLabel : "Telefon"}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.phone || "N/A"}</p>
          </div>
        </div>
        {user?.username && (
          <div className="flex items-center gap-3 p-3.5">
            <div className="p-2 rounded-lg shrink-0 bg-purple-50 dark:bg-purple-900/20">
              <UserIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{usernameLabel && usernameLabel !== "profile.username" ? usernameLabel : "İstifadəçi adı"}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user.username}</p>
            </div>
          </div>
        )}
        {user?.properties?.length > 0 && (
          <div className="flex items-center gap-3 p-3.5">
            <div className="p-2 rounded-lg shrink-0 bg-indigo-50 dark:bg-indigo-900/20">
              <HomeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">{propertiesLabel && propertiesLabel !== "profile.properties" ? propertiesLabel : "Mənzillər"}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.properties.length} {propertyLabel && propertyLabel !== "profile.property" ? propertyLabel : "mənzil"}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0 bg-amber-50 dark:bg-amber-900/20">
            <BellIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">Bildirişlər</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{notificationCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <div className="p-2 rounded-lg shrink-0 bg-sky-50 dark:bg-sky-900/20">
            <ComputerDesktopIcon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide">Aktiv cihaz IP</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{activeDeviceLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

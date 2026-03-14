import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

function InfoRow({ label, value, icon: Icon, accent = "#64748b" }) {
  return (
    <div className="flex items-center gap-3 min-h-[72px] py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="p-1.5 rounded-lg shrink-0" style={{ background: `${accent}18` }}>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

const GENDER_MAP = { male: "Kisi", female: "Qadin" };

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export function ProfileTabs({ user, messages, onEditClick }) {
  const { getRgba } = useMtkColor();
  const { t } = useTranslation();
  const fullName = user?.name || "-";
  const birthDate = formatDate(user?.birthday);
  const gender = GENDER_MAP[user?.gender] || user?.gender || "-";
  const statusValue = user?.status === true ? "Aktiv" : user?.status === false ? "Qeyri-aktiv" : "-";
  const userTypeValue = Number(user?.is_user) === 1 ? "İstifadəçi" : "Admin";
  const roleValue = user?.role?.name || "-";
  const firstNameLabel = t("profile.firstName");
  const lastNameLabel = t("profile.lastName");
  const usernameLabel = t("profile.username");
  const birthDateLabel = t("profile.birthDate");
  const genderLabel = t("profile.gender");
  const phoneLabel = t("profile.phone");
  const editLabel = t("profile.edit");
  const infoTitle = t("profile.personalInfo");

  return (
    <Card className="border dark:border-gray-700 shadow-sm dark:bg-gray-800 h-full">
      <CardBody className="p-5 sm:p-6 dark:bg-gray-800 h-full flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Typography variant="h6" className="font-bold dark:text-white text-sm sm:text-base">
            {infoTitle && infoTitle !== "profile.personalInfo" ? infoTitle : "Şəxsi məlumatlar"}
          </Typography>
          <Button
            size="sm"
            onClick={onEditClick}
            className="inline-flex items-center gap-1.5 text-white min-w-[138px] justify-center"
            style={{ background: getRgba(0.9) }}
          >
            <PencilSquareIcon className="h-4 w-4" />
            {editLabel && editLabel !== "profile.edit" ? editLabel : "Redaktə et"}
          </Button>
        </div>

        {messages?.successMessage && (
          <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
              {messages.successMessage}
            </Typography>
          </div>
        )}

        {messages?.errorMessage && (
          <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
              {messages.errorMessage}
            </Typography>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 flex-1">
          <InfoRow label={firstNameLabel && firstNameLabel !== "profile.firstName" ? firstNameLabel : "Ad"} value={user?.firstName || fullName.split(" ")[0] || "-"} icon={UserIcon} accent={getRgba(1)} />
          <InfoRow label={lastNameLabel && lastNameLabel !== "profile.lastName" ? lastNameLabel : "Soyad"} value={user?.lastName || fullName.split(" ").slice(1).join(" ") || "-"} icon={UserIcon} accent={getRgba(1)} />
          <InfoRow label={usernameLabel && usernameLabel !== "profile.username" ? usernameLabel : "İstifadəçi adı"} value={user?.username || "-"} icon={UserIcon} accent={getRgba(1)} />
          <InfoRow label={birthDateLabel && birthDateLabel !== "profile.birthDate" ? birthDateLabel : "Doğum tarixi"} value={birthDate} icon={CalendarIcon} accent={getRgba(1)} />
          <InfoRow label={genderLabel && genderLabel !== "profile.gender" ? genderLabel : "Cins"} value={gender} icon={UserIcon} accent={getRgba(1)} />
          <InfoRow label={phoneLabel && phoneLabel !== "profile.phone" ? phoneLabel : "Telefon"} value={user?.phone || "-"} icon={PhoneIcon} accent={getRgba(1)} />
          <InfoRow label="Rol" value={roleValue} icon={ShieldCheckIcon} accent={getRgba(1)} />
          <InfoRow label="Status" value={statusValue} icon={CheckCircleIcon} accent={getRgba(1)} />
          <InfoRow label="İstifadəçi tipi" value={userTypeValue} icon={UserIcon} accent={getRgba(1)} />
        </div>
      </CardBody>
    </Card>
  );
}

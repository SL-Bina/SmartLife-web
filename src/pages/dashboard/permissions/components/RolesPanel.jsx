import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Chip,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function RolesPanel({
  roles,
  loading,
  selectedRoleId,
  onRoleSelect,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) {
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleId = (role) => role.role_id ?? role.id;
  const getRoleName = (role) => role.role_name ?? role.name ?? "";

  const filteredRoles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return roles || [];
    return (roles || []).filter((role) => {
      const id = String(getRoleId(role) ?? "").toLowerCase();
      const name = getRoleName(role).toLowerCase();
      const label = (t(`permissions.rolesDict.${getRoleName(role)}`) || getRoleName(role)).toLowerCase();
      return id.includes(q) || name.includes(q) || label.includes(q);
    });
  }, [roles, searchTerm, t]);

  return (
    <Card
      className="shadow-lg dark:bg-gray-800 h-full flex flex-col max-w-full overflow-hidden"
      style={{ border: `1px solid ${getMtkRgba(0.35)}` }}
    >
      {/* Card top accent strip + header */}
      <div
        className="flex-shrink-0 px-4 pt-1 pb-4"
        style={{ borderBottom: `1px solid ${getMtkRgba(0.15)}` }}
      >
        {/* Coloured top stripe */}
        <div
          className="h-1 w-full rounded-b-full mb-4 -mx-4"
          style={{ background: getActiveGradient(0.85, 0.65), width: "calc(100% + 2rem)" }}
        />

        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: getMtkRgba(0.12) }}
            >
              <UserGroupIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />
            </div>
            <Typography variant="h6" className="font-bold dark:text-white text-gray-800">
              {t("permissions.roles.title") || "Rollar"}
            </Typography>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: getMtkRgba(0.1), color: getMtkRgba(1) }}
          >
            {roles?.length || 0} {t("permissions.roles.role") || "rol"}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Input
            type="text"
            placeholder={t("permissions.searchRoles") || "Axtarış..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full dark:text-white dark:bg-gray-800/50 pr-10 border-gray-300 dark:border-gray-600"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Create button */}
        <button
          onClick={onCreateClick}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm"
          style={{ background: getActiveGradient(0.9, 0.75) }}
        >
          <PlusIcon className="h-4 w-4" />
          {t("permissions.roles.create") || "Rol yarat"}
        </button>
      </div>

      {/* Role list */}
      <CardBody className="p-0 dark:bg-gray-800 flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner className="h-6 w-6" style={{ color: getMtkRgba(1) }} />
            <Typography variant="small" className="text-gray-400 dark:text-gray-400">
              {t("permissions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : !filteredRoles || filteredRoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <UserGroupIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
            <Typography variant="small" className="text-gray-400 dark:text-gray-500">
              {searchTerm
                ? t("permissions.roles.noRolesFiltered") || "Axtarışa uyğun rol tapılmadı"
                : t("permissions.roles.noRoles") || "Rol tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredRoles.map((role) => {
              const roleId = getRoleId(role);
              const roleName = getRoleName(role);
              const roleLabel = t(`permissions.rolesDict.${roleName}`) || roleName;
              const isSelected = selectedRoleId === roleId;

              return (
                <div
                  key={roleId}
                  onClick={() => onRoleSelect(roleId)}
                  className="p-3 rounded-xl border cursor-pointer transition-all duration-200 group"
                  style={
                    isSelected
                      ? {
                          backgroundColor: getMtkRgba(0.08),
                          borderColor: getMtkRgba(0.45),
                          boxShadow: `0 0 0 1px ${getMtkRgba(0.2)}`,
                        }
                      : {
                          backgroundColor: "transparent",
                          borderColor: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = getMtkRgba(0.04);
                      e.currentTarget.style.borderColor = getMtkRgba(0.2);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: icon + name */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{
                          backgroundColor: isSelected ? getMtkRgba(0.18) : getMtkRgba(0.08),
                        }}
                      >
                        <UserGroupIcon
                          className="h-4 w-4"
                          style={{ color: getMtkRgba(isSelected ? 1 : 0.7) }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography
                          variant="small"
                          className="font-semibold dark:text-white text-gray-800 text-sm truncate"
                        >
                          {roleLabel}
                        </Typography>
                        <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500">
                          ID: {roleId}
                        </Typography>
                      </div>
                    </div>

                    {/* Right: badge + actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Chip
                        value={t("permissions.status.active") || "Aktiv"}
                        color="green"
                        size="sm"
                        className="text-xs"
                      />
                      <IconButton
                        size="sm"
                        variant="text"
                        className="dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => { e.stopPropagation(); onEditClick(role); }}
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="text"
                        color="red"
                        className="dark:hover:bg-red-900/30"
                        onClick={(e) => { e.stopPropagation(); onDeleteClick(role); }}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

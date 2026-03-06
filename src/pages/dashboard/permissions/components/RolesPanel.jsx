import React, { useMemo, useState } from "react";
import { Spinner, Input } from "@material-tailwind/react";
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
    <div
      className="w-full rounded-2xl mb-4 overflow-hidden shadow-md border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900"
    >
      {/* Top accent stripe */}
      <div className="h-1 w-full" style={{ background: getActiveGradient(0.9, 0.7) }} />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Icon + label */}
        <div
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: getMtkRgba(0.12) }}
          >
            <UserGroupIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {t("permissions.roles.title") || "Rollar"}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-40 flex-shrink-0">
          <Input
            type="text"
            placeholder={t("permissions.searchRoles") || "Axtar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!h-8 text-sm dark:text-white pr-8"
            containerProps={{ className: "h-8" }}
            labelProps={{ className: "dark:text-gray-300 before:!border-0 after:!border-0" }}
          />
          <MagnifyingGlassIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Horizontal scrollable role tabs */}
        <div className="flex-1 overflow-x-auto min-w-0">
          {loading ? (
            <div className="flex items-center gap-2 py-1">
              <Spinner className="h-4 w-4" style={{ color: getMtkRgba(1) }} />
              <span className="text-xs text-gray-400">{t("permissions.loading") || "Yüklənir..."}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 pb-0.5">
              {filteredRoles.length === 0 ? (
                <span className="text-xs text-gray-400 italic">
                  {searchTerm ? t("permissions.roles.noRolesFiltered") || "Tapılmadı" : t("permissions.roles.noRoles") || "Rol yoxdur"}
                </span>
              ) : (
                filteredRoles.map((role) => {
                  const roleId = getRoleId(role);
                  const roleName = getRoleName(role);
                  const roleLabel = t(`permissions.rolesDict.${roleName}`) || roleName;
                  const isSelected = selectedRoleId === roleId;

                  return (
                    <div key={roleId} className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => onRoleSelect(roleId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap"
                        style={
                          isSelected
                            ? {
                                background: getActiveGradient(0.85, 0.65),
                                color: "#fff",
                                boxShadow: `0 2px 8px ${getMtkRgba(0.35)}`,
                              }
                            : {
                                backgroundColor: getMtkRgba(0.07),
                                color: getMtkRgba(0.85),
                                border: `1px solid ${getMtkRgba(0.2)}`,
                              }
                        }
                      >
                        <UserGroupIcon className="h-3 w-3" />
                        {roleLabel}
                      </button>
                      {/* Edit / Delete shown inline on selected */}
                      {isSelected && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); onEditClick(role); }}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <PencilIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteClick(role); }}
                            className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <TrashIcon className="h-3.5 w-3.5 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Create button */}
        <button
          onClick={onCreateClick}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm whitespace-nowrap"
          style={{ background: getActiveGradient(0.9, 0.75) }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          {t("permissions.roles.create") || "Rol yarat"}
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Spinner, Input, Typography } from "@material-tailwind/react";
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function PermissionsPanel({
  modules,
  loading,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
  onCreateClick,
  onEditPermission,
  onDeletePermission,
}) {
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRefs = useRef({});

  const permissionsByModule = (modules || []).reduce((acc, item) => {
    const module = item?.module;
    if (!module?.name) return acc;
    const moduleName = module.name;
    const perms = Array.isArray(module.permissions) ? module.permissions : [];
    if (perms.length) acc[moduleName] = perms;
    return acc;
  }, {});

  const moduleIdByName = (modules || []).reduce((acc, item) => {
    const m = item?.module;
    if (m?.name && m?.id != null) acc[m.name] = m.id;
    return acc;
  }, {});

  const trModule = (moduleName) => t(`permissions.modules.${moduleName}`) || moduleName;
  const trAction = (actionCode) => t(`permissions.actions.${actionCode}`) || actionCode;

  const isPermissionSelected = useCallback(
    (moduleName, permissionId) => {
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return modulePerms.some((id) => String(id) === String(permissionId));
    },
    [selectedPermissions]
  );

  const isModuleAllSelected = useCallback(
    (moduleName, permissionIds) => {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) return false;
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return permissionIds.every((id) => modulePerms.some((permId) => String(permId) === String(id)));
    },
    [selectedPermissions]
  );

  const isModuleSomeSelected = useCallback(
    (moduleName, permissionIds) => {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) return false;
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return permissionIds.some((id) => modulePerms.some((permId) => String(permId) === String(id)));
    },
    [selectedPermissions]
  );

  useEffect(() => {
    Object.keys(permissionsByModule).forEach((moduleName) => {
      const perms = permissionsByModule[moduleName] || [];
      const ids = perms.map((p) => p.id);
      const allSelected = isModuleAllSelected(moduleName, ids);
      const someSelected = isModuleSomeSelected(moduleName, ids);
      const checkbox = checkboxRefs.current[moduleName];
      if (checkbox) checkbox.indeterminate = someSelected && !allSelected;
    });
  }, [permissionsByModule, selectedPermissions, isModuleAllSelected, isModuleSomeSelected]);

  const filteredPermissions = Object.entries(permissionsByModule).reduce((acc, [moduleName, perms]) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return acc;
    const moduleLabel = trModule(moduleName).toLowerCase();
    const filtered = (perms || []).filter((perm) => {
      const details = (perm.details || perm.detail || "").toLowerCase();
      const code = (perm.permission || "").toLowerCase();
      const codeTr = trAction(perm.permission || "").toLowerCase();
      return (
        details.includes(q) || code.includes(q) || codeTr.includes(q) ||
        moduleName.toLowerCase().includes(q) || moduleLabel.includes(q)
      );
    });
    if (filtered.length) acc[moduleName] = filtered;
    return acc;
  }, {});

  const dataToRender = searchTerm ? filteredPermissions : permissionsByModule;

  const totalPermissions = Object.values(permissionsByModule).reduce(
    (sum, perms) => sum + (Array.isArray(perms) ? perms.length : 0),
    0
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar: search + create */}
      <div className="flex items-center gap-3 px-1 pb-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Input
            type="text"
            placeholder={t("permissions.search") || "Modul / icazə axtar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!h-9 text-sm dark:text-white pr-9"
            containerProps={{ className: "h-9" }}
            labelProps={{ className: "dark:text-gray-300 before:!border-0 after:!border-0" }}
          />
          <MagnifyingGlassIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: getMtkRgba(0.1), color: getMtkRgba(1) }}
        >
          {totalPermissions} {t("permissions.permissions.permission") || "icazə"}
        </span>

        <div className="flex-1" />

        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm flex-shrink-0"
          style={{ background: getActiveGradient(0.9, 0.75) }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          {t("permissions.permissions.create") || "İcazə yarat"}
        </button>
      </div>

      {/* Module cards grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner className="h-7 w-7" style={{ color: getMtkRgba(1) }} />
            <Typography variant="small" className="text-gray-400">
              {t("permissions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : Object.keys(dataToRender).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ShieldCheckIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <Typography variant="small" className="text-gray-400 dark:text-gray-500">
              {t("permissions.permissions.noPermissions") || "İcazə tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {Object.entries(dataToRender).map(([moduleName, perms]) => {
              if (!Array.isArray(perms) || perms.length === 0) return null;
              const ids = perms.map((p) => p.id);
              const allSelected = isModuleAllSelected(moduleName, ids);
              const someSelected = isModuleSomeSelected(moduleName, ids);
              const selectedCount = (selectedPermissions?.[moduleName] || []).length;

              return (
                <div
                  key={moduleName}
                  className="rounded-xl overflow-hidden border bg-white dark:bg-gray-900 shadow-sm"
                  style={{ borderColor: someSelected ? getMtkRgba(0.4) : "rgb(229,231,235)" }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2.5"
                    style={{ background: someSelected ? getMtkRgba(0.08) : "rgba(249,250,251,1)", borderBottom: "1px solid rgba(229,231,235,0.8)" }}
                  >
                    <input
                      type="checkbox"
                      ref={(el) => { checkboxRefs.current[moduleName] = el; }}
                      checked={allSelected}
                      onChange={() => onModuleToggle(moduleName, ids)}
                      className="h-4 w-4 rounded cursor-pointer flex-shrink-0"
                      style={{ accentColor: getMtkRgba(1) }}
                    />
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getMtkRgba(0.13) }}
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5" style={{ color: getMtkRgba(1) }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 flex-1 truncate capitalize">
                      {trModule(moduleName)}
                    </span>
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: someSelected ? getMtkRgba(0.15) : "rgba(229,231,235,1)",
                        color: someSelected ? getMtkRgba(1) : "#6b7280",
                      }}
                    >
                      {selectedCount}/{perms.length}
                    </span>
                  </div>

                  {/* Permission rows */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {perms.map((permission) => {
                      const isSelected = isPermissionSelected(moduleName, permission.id);
                      const title = permission.details || permission.detail || trAction(permission.permission);
                      const codeLabel = trAction(permission.permission);
                      const moduleId = moduleIdByName[moduleName];

                      return (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors group"
                          style={{ backgroundColor: isSelected ? getMtkRgba(0.04) : "transparent" }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = getMtkRgba(0.025); }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                          onClick={() => onPermissionToggle(moduleName, permission.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onPermissionToggle(moduleName, permission.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded cursor-pointer flex-shrink-0"
                            style={{ accentColor: getMtkRgba(1) }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium truncate"
                              style={isSelected ? { color: getMtkRgba(1) } : { color: "" }}
                            >
                              <span className={isSelected ? "" : "text-gray-700 dark:text-gray-300"}>{title}</span>
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{codeLabel}</p>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={(e) => { e.stopPropagation(); onEditPermission?.({ moduleId, moduleName, permission }); }}
                            >
                              <PencilIcon className="h-3 w-3 text-gray-500" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                              onClick={(e) => { e.stopPropagation(); onDeletePermission?.({ moduleId, moduleName, permission }); }}
                            >
                              <TrashIcon className="h-3 w-3 text-red-400" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

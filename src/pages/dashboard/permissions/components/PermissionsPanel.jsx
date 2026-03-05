import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  ShieldCheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
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
  const [openModules, setOpenModules] = useState({});
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

  const toggleModule = (moduleName) => {
    setOpenModules((prev) => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const totalPermissions = Object.values(permissionsByModule).reduce(
    (sum, perms) => sum + (Array.isArray(perms) ? perms.length : 0),
    0
  );

  return (
    <Card
      className="shadow-lg dark:bg-gray-800 h-full flex flex-col max-w-full overflow-hidden"
      style={{ border: `1px solid ${getMtkRgba(0.35)}` }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 pt-1 pb-4"
        style={{ borderBottom: `1px solid ${getMtkRgba(0.15)}` }}
      >
        {/* Top stripe */}
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
              <ShieldCheckIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />
            </div>
            <Typography variant="h6" className="font-bold dark:text-white text-gray-800">
              {t("permissions.permissions.title") || "İcazələr"}
            </Typography>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: getMtkRgba(0.1), color: getMtkRgba(1) }}
          >
            {totalPermissions} {t("permissions.permissions.permission") || "icazə"}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Input
            type="text"
            placeholder={t("permissions.search") || "Axtarış..."}
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
          {t("permissions.permissions.create") || "İcazə yarat"}
        </button>
      </div>

      {/* Permissions list */}
      <CardBody className="p-3 dark:bg-gray-800 flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Spinner className="h-6 w-6" style={{ color: getMtkRgba(1) }} />
            <Typography variant="small" className="text-gray-400">
              {t("permissions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : Object.keys(dataToRender).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <ShieldCheckIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
            <Typography variant="small" className="text-gray-400 dark:text-gray-500">
              {t("permissions.permissions.noPermissions") || "İcazə tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(dataToRender).map(([moduleName, perms]) => {
              if (!Array.isArray(perms) || perms.length === 0) return null;
              const ids = perms.map((p) => p.id);
              const allSelected = isModuleAllSelected(moduleName, ids);
              const someSelected = isModuleSomeSelected(moduleName, ids);
              const isOpen = openModules[moduleName];

              return (
                <div key={moduleName} className="rounded-xl overflow-hidden border" style={{ borderColor: getMtkRgba(0.2) }}>
                  {/* Module header */}
                  <div
                    className="flex items-center gap-3 px-3 py-2.5"
                    style={{ background: getMtkRgba(0.08), borderBottom: isOpen ? `1px solid ${getMtkRgba(0.15)}` : "none" }}
                  >
                    {/* Module checkbox */}
                    <div className="relative flex items-center flex-shrink-0">
                      <input
                        type="checkbox"
                        ref={(el) => { checkboxRefs.current[moduleName] = el; }}
                        checked={allSelected}
                        onChange={() => onModuleToggle(moduleName, ids)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded cursor-pointer"
                        style={{ accentColor: getMtkRgba(1) }}
                      />
                    </div>

                    {/* Module icon */}
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getMtkRgba(0.15) }}
                    >
                      <ShieldCheckIcon className="h-3.5 w-3.5" style={{ color: getMtkRgba(1) }} />
                    </div>

                    {/* Module name */}
                    <Typography
                      variant="small"
                      className="font-semibold dark:text-white text-gray-800 text-sm flex-1 capitalize"
                    >
                      {trModule(moduleName)}
                    </Typography>

                    {/* Count + selected indicator */}
                    <div className="flex items-center gap-1.5">
                      {someSelected && (
                        <CheckCircleIcon
                          className="h-4 w-4"
                          style={{ color: getMtkRgba(allSelected ? 1 : 0.6) }}
                        />
                      )}
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: getMtkRgba(0.12), color: getMtkRgba(1) }}
                      >
                        {perms.length}
                      </span>
                    </div>

                    {/* Expand toggle */}
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => toggleModule(moduleName)}
                      className="dark:text-white"
                    >
                      <ChevronDownIcon
                        strokeWidth={2}
                        className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: getMtkRgba(0.8) }}
                      />
                    </IconButton>
                  </div>

                  {/* Permissions list */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="divide-y dark:divide-gray-700/50 divide-gray-100">
                      {perms.map((permission) => {
                        const isSelected = isPermissionSelected(moduleName, permission.id);
                        const title = permission.details || permission.detail || trAction(permission.permission);
                        const codeLabel = trAction(permission.permission);
                        const moduleId = moduleIdByName[moduleName];

                        return (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors group"
                            style={{
                              backgroundColor: isSelected ? getMtkRgba(0.05) : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = getMtkRgba(0.03);
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                            }}
                            onClick={(e) => { e.stopPropagation(); onPermissionToggle(moduleName, permission.id); }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => { e.stopPropagation(); onPermissionToggle(moduleName, permission.id); }}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 rounded cursor-pointer flex-shrink-0"
                              style={{ accentColor: getMtkRgba(1) }}
                            />

                            <div className="flex-1 min-w-0">
                              <Typography
                                variant="small"
                                className="dark:text-gray-200 text-gray-700 text-sm font-medium truncate transition-colors"
                                style={isSelected ? { color: getMtkRgba(1) } : {}}
                              >
                                {title}
                              </Typography>
                              <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 truncate">
                                {codeLabel}
                              </Typography>
                            </div>

                            {/* Selected dot */}
                            {isSelected && (
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getMtkRgba(1) }}
                              />
                            )}

                            {/* Edit / Delete */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <IconButton
                                size="sm"
                                variant="text"
                                className="dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => { e.stopPropagation(); onEditPermission?.({ moduleId, moduleName, permission }); }}
                              >
                                <PencilIcon className="h-3.5 w-3.5" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                variant="text"
                                color="red"
                                className="dark:hover:bg-red-900/30"
                                onClick={(e) => { e.stopPropagation(); onDeletePermission?.({ moduleId, moduleName, permission }); }}
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </IconButton>
                            </div>
                          </div>
                        );
                      })}
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

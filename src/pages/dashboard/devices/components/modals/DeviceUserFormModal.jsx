import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, UserPlusIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@/components/ui/CustomInput";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function DeviceUserFormModal({ open, onClose, formData, errors = {}, onChange, onSave, saving, complexName = "" }) {
  const { t } = useTranslation();
  const { getActiveGradient } = useMtkColor();
  const gradientStyle = { background: getActiveGradient(0.92, 0.72) };
  const activeComplexLabel = complexName || t("devices.deviceUsers.selectComplex") || "Kompleks secin";

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-900 z-[140] border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl p-5 flex items-center gap-3" style={gradientStyle}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
            <UserPlusIcon className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <Typography variant="h6" className="text-white font-bold">
              {t("devices.deviceUsers.addUserTitle") || "Yeni istifadeci elave et"}
            </Typography>
            <Typography variant="small" className="text-white/90 text-xs">
              {(t("devices.deviceUsers.complex") || "Kompleks") + ": "}
              <b>{activeComplexLabel}</b>
            </Typography>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            type="button"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="px-4 md:px-5 py-4 dark:bg-gray-900 max-h-[70vh] overflow-y-auto">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 mb-4">
          <Typography variant="small" className="text-gray-500 dark:text-gray-300 flex items-center gap-1.5">
            <BuildingOffice2Icon className="h-4 w-4" />
            {t("devices.deviceUsers.complex") || "Kompleks"}
          </Typography>
          <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
            {activeComplexLabel}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CustomInput
            label={t("devices.deviceUsers.form.name") || "Ad"}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
          />
          <CustomInput
            label={t("devices.deviceUsers.form.email") || "E-poct"}
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
          />
          <CustomInput
            label={t("devices.deviceUsers.form.phone") || "Telefon"}
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            error={errors.phone}
          />
          <CustomInput
            label={t("devices.deviceUsers.form.domainId") || "Domain ID"}
            type="number"
            value={formData.domain_id}
            onChange={(e) => onChange("domain_id", e.target.value)}
            error={errors.domain_id}
          />
        </div>

        {errors.form ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/20 dark:text-red-300">
            {errors.form}
          </div>
        ) : null}
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
          {t("devices.actions.cancel") || "Ləğv et"}
        </Button>
        <Button color="blue" onClick={onSave} disabled={saving}>
          {saving ? t("devices.actions.saving") || "Yadda saxlanır..." : t("devices.actions.save") || "Saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

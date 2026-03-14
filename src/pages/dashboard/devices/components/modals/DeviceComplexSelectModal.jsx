import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { BuildingOffice2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function DeviceComplexSelectModal({
  open,
  onClose,
  complexes = [],
  selectedComplexId = null,
  onConfirm,
  loading = false,
  required = false,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(selectedComplexId ? String(selectedComplexId) : "");

  useEffect(() => {
    if (open) {
      setValue(selectedComplexId ? String(selectedComplexId) : "");
    }
  }, [open, selectedComplexId]);

  const options = useMemo(
    () => [
      { value: "", label: t("devices.deviceUsers.selectComplex") || "Kompleks secin" },
      ...complexes.map((complex) => ({
        value: String(complex.id),
        label: complex.name || complex.title || `Complex ${complex.id}`,
      })),
    ],
    [complexes, t]
  );

  const selectedName = useMemo(() => {
    const selected = complexes.find((item) => String(item.id) === value);
    return selected?.name || selected?.title || "";
  }, [complexes, value]);

  const handleConfirm = () => {
    if (!value) return;
    onConfirm?.(Number(value));
  };

  return (
    <Dialog
      open={open}
      handler={required ? undefined : onClose}
      size="sm"
      className="dark:bg-gray-900 z-[130]"
      dismiss={{ enabled: !required }}
    >
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <BuildingOffice2Icon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {t("devices.complexSelection.title") || "Kompleks secimi"}
          </Typography>
          {!required && (
            <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </DialogHeader>

      <DialogBody className="space-y-4 dark:bg-gray-900">
        <Typography variant="small" className="text-gray-600 dark:text-gray-300">
          {required
            ? t("devices.complexSelection.requiredDescription") ||
              "Cihazlar sehifesini acmaq ucun once kompleks secin."
            : t("devices.complexSelection.changeDescription") ||
              "Aktiv kompleks secimini deyisin."}
        </Typography>

        <CustomSelect
          label={t("devices.deviceUsers.selectComplex") || "Kompleks secin"}
          value={value}
          onChange={setValue}
          options={options}
          placeholder={t("devices.deviceUsers.selectComplex") || "Kompleks secin"}
        />

        {selectedName ? (
          <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
            {t("devices.complexSelection.activeComplex") || "Secilen kompleks"}: <b>{selectedName}</b>
          </Typography>
        ) : null}
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-4 py-3 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        {!required && (
          <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
            {t("devices.actions.cancel") || "Legv et"}
          </Button>
        )}
        <Button color="blue" onClick={handleConfirm} disabled={!value || loading}>
          {loading
            ? t("devices.actions.loading") || "Yuklenir..."
            : t("devices.complexSelection.confirm") || "Kompleksi ac"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

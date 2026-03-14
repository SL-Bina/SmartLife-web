import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogBody,
  Input,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon, PencilSquareIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { profileAPI } from "../api";

function splitName(fullName) {
  if (!fullName || typeof fullName !== "string") return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function ProfileEditModal({ open, onClose, user, onSaved, messages }) {
  const { t } = useTranslation();
  const { getRgba, getActiveGradient } = useMtkColor();

  const initialForm = useMemo(() => {
    const nameParts = splitName(user?.name || "");
    return {
      firstName: user?.firstName || nameParts.firstName,
      lastName: user?.lastName || nameParts.lastName,
      username: user?.username || "",
      birthDate: user?.birthday ? (user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday) : "",
      phone: user?.phone || "",
    };
  }, [user]);

  const [form, setForm] = useState(initialForm);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLocalError(null);
  }, [open, initialForm]);

  const handleClose = () => {
    setLocalError(null);
    onClose?.();
  };

  const handleSave = async () => {
    setSavingProfile(true);
    setLocalError(null);
    messages?.clearMessages?.();

    try {
      const updateData = {
        name: `${form.firstName} ${form.lastName}`.trim() || user?.name || "",
        username: form.username || user?.username || "",
        email: user?.email || "",
        phone: form.phone || user?.phone || "",
        is_user: Number(user?.is_user ?? 1),
        role_id: Number(user?.role_id || user?.role?.id || 1),
        modules: ["*"],
        grant_permissions: ["*"],
        birthday: form.birthDate || null,
        ...(user?.personal_code ? { personal_code: user.personal_code } : {}),
      };

      const response = await profileAPI.updateMe(updateData, user);

      if (response?.success === false) {
        const msg = response?.message || t("profile.updateError") || "Xeta bas verdi";
        setLocalError(msg);
        messages?.showError?.(msg);
        return;
      }

      messages?.showSuccess?.(t("profile.updateSuccess") || "Melumatlar ugurla yenilendi");
      await onSaved?.();
      handleClose();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.updateError") || "Xeta bas verdi");
      setLocalError(msg);
      messages?.showError?.(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    setLocalError(null);
    messages?.clearMessages?.();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      const msg = t("profile.passwordRequired") || "Bütün şifrə sahələri doldurulmalıdır";
      setLocalError(msg);
      messages?.showError?.(msg);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      const msg = t("profile.passwordMismatch") || "Yeni şifrələr uyğun gəlmir";
      setLocalError(msg);
      messages?.showError?.(msg);
      return;
    }

    setSavingPassword(true);

    try {
      const updateData = {
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        is_user: Number(user?.is_user ?? 1),
        role_id: Number(user?.role_id || user?.role?.id || 1),
        modules: ["*"],
        grant_permissions: ["*"],
        birthday: user?.birthday || null,
        ...(user?.personal_code ? { personal_code: user.personal_code } : {}),
        password: passwordForm.newPassword,
        password_confirmation: passwordForm.confirmPassword,
      };

      const response = await profileAPI.updateMe(updateData, user);

      if (response?.success === false) {
        const msg = response?.message || t("profile.passwordUpdateError") || "Xəta baş verdi";
        setLocalError(msg);
        messages?.showError?.(msg);
        return;
      }

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      messages?.showSuccess?.(t("profile.passwordUpdateSuccess") || "Şifrə uğurla yeniləndi");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.passwordUpdateError") || "Xəta baş verdi");
      setLocalError(msg);
      messages?.showError?.(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <Dialog open={open} handler={handleClose} size="md" className="dark:bg-gray-800 !max-w-xl">
      <div
        className="flex items-center justify-between px-5 py-4 rounded-t-xl border-b border-white/20"
        style={{ background: getActiveGradient(0.9, 0.7) }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <PencilSquareIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{t("profile.edit") || "Profili redakte et"}</p>
            <p className="text-white/70 text-xs">{user?.name || ""}</p>
          </div>
        </div>
        <button onClick={handleClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <DialogBody className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
        {localError && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <Typography variant="small" className="text-red-700 dark:text-red-300">
              {localError}
            </Typography>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              {t("profile.firstName") || "Ad"}
            </Typography>
            <Input
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              {t("profile.lastName") || "Soyad"}
            </Typography>
            <Input
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </div>

        <div>
          <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
            {t("profile.username") || "Istifadeci adi"}
          </Typography>
          <Input
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        <div>
          <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
            {t("profile.birthDate") || "Dogum tarixi"}
          </Typography>
          <Input
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        <div>
          <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
            {t("profile.phone") || "Telefon"}
          </Typography>
          <Input
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            onClick={handleSave}
            disabled={savingProfile}
            className="flex-1 text-white"
            style={{ background: getRgba(0.9) }}
          >
            {savingProfile ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-4 w-4" /> {t("profile.saving") || "Yadda saxlanir..."}
              </span>
            ) : (
              t("profile.save") || "Yadda saxla"
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            className="flex-1"
          >
            {t("profile.close") || "Bagla"}
          </Button>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <LockClosedIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-200">
              {t("profile.password") || "Şifrə dəyiş"}
            </Typography>
          </div>

          <div className="space-y-3">
            <div>
              <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                {t("profile.currentPassword") || "Cari şifrə"}
              </Typography>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                {t("profile.newPassword") || "Yeni şifrə"}
              </Typography>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>

            <div>
              <Typography variant="small" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
                {t("profile.confirmPassword") || "Şifrəni təsdiqlə"}
              </Typography>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>

            <Button
              onClick={handlePasswordSave}
              disabled={savingPassword}
              className="w-full text-white"
              style={{ background: getRgba(0.85) }}
            >
              {savingPassword ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" /> {t("profile.saving") || "Yadda saxlanir..."}
                </span>
              ) : (
                t("profile.password") || "Şifrə dəyiş"
              )}
            </Button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default ProfileEditModal;

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { residentProfileAPI } from "../api";
import { useResidentProfileForm, usePasswordForm } from "../hooks";
import { useComplexColor } from "@/hooks/useComplexColor";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export function ProfileTabs({ user, refreshUser, messages }) {
  const { t } = useTranslation();
  const { color, getRgba } = useComplexColor();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  const { formData, setFormData, onChange: onPersonalChange } = useResidentProfileForm(user);
  const { passwordData, onChange: onPasswordChange, reset: resetPassword } = usePasswordForm();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    messages.clearMessages();
  };

  const handleSavePersonalInfo = async () => {
    setLoading(true);
    messages.clearMessages();

    try {
      const updateData = {
        name: formData.name || user?.name || "",
        surname: formData.surname || user?.surname || "",
        email: formData.email || user?.email || "",
        phone: formData.phone || user?.phone || "",
        birth_date: formData.birth_date || null,
        gender: formData.gender || null,
        personal_code: formData.personal_code || null,
      };

      const response = await residentProfileAPI.updateMe(updateData);

      if (response?.success) {
        messages.showSuccess(t("profile.updateSuccess") || "Məlumatlar uğurla yeniləndi");
        await refreshUser();
      } else {
        messages.showError(response?.message || t("profile.updateError") || "Xəta baş verdi");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.updateError") || "Xəta baş verdi");

      messages.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setLoading(true);
    messages.clearMessages();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      messages.showError(t("profile.passwordMismatch") || "Yeni şifrələr uyğun gəlmir");
      setLoading(false);
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      messages.showError(t("profile.passwordRequired") || "Bütün sahələr doldurulmalıdır");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };

      const response = await residentProfileAPI.updatePassword(updateData);

      if (response?.success) {
        messages.showSuccess(t("profile.passwordUpdateSuccess") || "Şifrə uğurla yeniləndi");
        resetPassword();
      } else {
        messages.showError(response?.message || t("profile.passwordUpdateError") || "Xəta baş verdi");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.passwordUpdateError") || "Xəta baş verdi");

      messages.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 flex flex-col min-h-0">
      <CardBody className="p-0 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
        {/* ── Custom tab header ── */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 pt-3 gap-1">
          {[
            { key: "personal", label: t("profile.personalInfo") || "Şəxsi məlumatlar", Icon: UserIcon },
            { key: "password", label: t("profile.password") || "Şifrəm",            Icon: LockClosedIcon },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors ${
                activeTab === key
                  ? "text-white rounded-lg mb-[-1px]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              style={activeTab === key ? { background: color } : {}}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* ── Tab body ── */}
        <div className="p-4 flex-1 min-h-0 overflow-y-auto" style={{ minHeight: "450px" }}>
            {/* PERSONAL */}
            {activeTab === "personal" && (
            <div className="h-full flex flex-col">
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                {t("profile.personalInfo") || "Şəxsi məlumatlar"}
              </Typography>

              {messages.successMessage && (
                <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                    {messages.successMessage}
                  </Typography>
                </div>
              )}

              {messages.errorMessage && (
                <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                    {messages.errorMessage}
                  </Typography>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                      {t("profile.firstName") || "Ad"}
                    </Typography>
                    <Input
                      value={formData.name}
                      onChange={(e) => onPersonalChange("name", e.target.value)}
                      className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                      labelProps={{ className: "dark:text-gray-400" }}
                      containerProps={{ className: "min-w-0" }}
                      size="md"
                    />
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                      {t("profile.lastName") || "Soyad"}
                    </Typography>
                    <Input
                      value={formData.surname}
                      onChange={(e) => onPersonalChange("surname", e.target.value)}
                      className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                      labelProps={{ className: "dark:text-gray-400" }}
                      containerProps={{ className: "min-w-0" }}
                      size="md"
                    />
                  </div>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.email") || "E-poçt"}
                  </Typography>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onPersonalChange("email", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "min-w-0" }}
                    size="md"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.phone") || "Telefon"}
                  </Typography>
                  <Input
                    value={formData.phone}
                    onChange={(e) => onPersonalChange("phone", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.birthDate") || "Doğum tarixi"}
                  </Typography>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => onPersonalChange("birth_date", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.gender") || "Cins"}
                  </Typography>
                  <Select
                    value={formData.gender || ""}
                    onChange={(value) => onPersonalChange("gender", value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                  >
                    <Option value="">{t("profile.selectGender") || "Seçin"}</Option>
                    <Option value="male">{t("profile.genderMale") || "Kişi"}</Option>
                    <Option value="female">{t("profile.genderFemale") || "Qadın"}</Option>
                  </Select>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.personalCode") || "Şəxsi kod"}
                  </Typography>
                  <Input
                    value={formData.personal_code}
                    onChange={(e) => onPersonalChange("personal_code", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSavePersonalInfo}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: color }}
                  >
                    {loading ? (t("profile.saving") || "Yadda saxlanır...") : (t("profile.save") || "Yadda saxla")}
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* PASSWORD */}
            {activeTab === "password" && (
            <div className="h-full flex flex-col">
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                {t("profile.password") || "Şifrəm"}
              </Typography>

              {messages.successMessage && (
                <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                    {messages.successMessage}
                  </Typography>
                </div>
              )}

              {messages.errorMessage && (
                <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                    {messages.errorMessage}
                  </Typography>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.currentPassword") || "Cari şifrə"}
                  </Typography>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => onPasswordChange("currentPassword", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.newPassword") || "Yeni şifrə"}
                  </Typography>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => onPasswordChange("newPassword", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                    {t("profile.confirmPassword") || "Şifrəni təsdiqlə"}
                  </Typography>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => onPasswordChange("confirmPassword", e.target.value)}
                    className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500 text-sm w-full"
                    labelProps={{ className: "dark:text-gray-400" }}
                    size="md"
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSavePassword}
                    disabled={loading}
                    className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: color }}
                  >
                    {loading ? (t("profile.saving") || "Yadda saxlanır...") : (t("profile.save") || "Yadda saxla")}
                  </button>
                </div>
              </div>
            </div>
            )}
        </div>
      </CardBody>
    </Card>
  );
}


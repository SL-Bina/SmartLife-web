import React from "react";
import { useTranslation } from "react-i18next";
import { BanknotesIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const CARDS = [
  { key: "bank", labelKey: "expenses.summary.bank", fallback: "Bank", icon: BanknotesIcon, valueKey: "bankTotal", color: "from-orange-500 to-orange-600", text: "text-orange-600 dark:text-orange-400" },
  { key: "cash", labelKey: "expenses.summary.cash", fallback: "Nağd", icon: CurrencyDollarIcon, valueKey: "cashTotal", color: "from-amber-500 to-amber-600", text: "text-amber-600 dark:text-amber-400" },
  { key: "total", labelKey: "expenses.summary.total", fallback: "Ümumi", icon: ChartBarIcon, valueKey: "totalExpenses", color: null, text: "text-red-600 dark:text-red-400" },
];

export function ExpensesSummaryCard({ bankTotal, cashTotal, totalExpenses }) {
  const { t } = useTranslation();
  const { getActiveGradient } = useMtkColor();
  const values = { bankTotal, cashTotal, totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {CARDS.map(({ key, labelKey, fallback, icon: Icon, valueKey, color, text }) => (
        <div key={key} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4 flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md${color ? ` bg-gradient-to-br ${color}` : ''}`}
            style={!color ? { background: getActiveGradient(0.9, 0.7) } : undefined}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{t(labelKey) || fallback}</p>
            <p className={`text-xl font-bold ${text}`}>{(values[valueKey] ?? 0).toFixed(2)} ₼</p>
          </div>
        </div>
      ))}
    </div>
  );
}


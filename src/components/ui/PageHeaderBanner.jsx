/**
 * PageHeaderBanner - Simple dark section header with dynamic accent border.
 * Replaces the repeated pattern:
 *   <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
 *     <h3 className="text-white font-bold">{title}</h3>
 *   </div>
 */
import React from "react";
import { useAppColor } from "@/hooks/useAppColor";

export function PageHeaderBanner({ title, subtitle, children, className = "" }) {
  const { getRgba } = useAppColor();

  return (
    <div
      className={`w-full bg-gray-900 dark:bg-gray-800 my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 flex-shrink-0 ${className}`}
      style={{ border: `1.5px solid ${getRgba(0.7)}` }}
    >
      {title && (
        <h3 className="text-white font-bold text-base sm:text-lg">{title}</h3>
      )}
      {subtitle && (
        <p className="text-white/75 text-xs sm:text-sm mt-0.5">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export default PageHeaderBanner;

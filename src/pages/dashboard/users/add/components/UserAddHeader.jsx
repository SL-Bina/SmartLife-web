import React from "react";
import { Button } from "@material-tailwind/react";
import { UserPlusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { GradientPageHeader } from "@/components/ui/GradientPageHeader";

export function UserAddHeader({ onCreateClick }) {
  return (
    <GradientPageHeader
      icon={UserPlusIcon}
      title="İstifadəçilər İdarəetməsi"
      subtitle="İstifadəçi siyahısı, yarat / redaktə / sil"
    >
      {onCreateClick && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Button
            size="sm"
            variant="outlined"
            onClick={onCreateClick}
            className="border-white/40 text-white hover:bg-white/20 text-xs px-3 py-1.5 whitespace-nowrap flex items-center gap-1.5"
          >
            <PlusIcon className="h-4 w-4" />
            İstifadəçi əlavə et
          </Button>
        </div>
      )}
    </GradientPageHeader>
  );
}
 
import React from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  CalendarIcon,
  TagIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useComplexColor } from "@/hooks/useComplexColor";

const STATUS_CFG = {
  pending:     { label: "Gözləyir",    cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", Icon: ClockIcon },
  in_progress: { label: "İcrada",      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         Icon: ArrowPathIcon },
  resolved:    { label: "Həll olunub", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     Icon: CheckCircleSolid },
  completed:   { label: "Tamamlanıb",  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     Icon: CheckCircleSolid },
  cancelled:   { label: "Ləğv edilib", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            Icon: XCircleIcon },
  closed:      { label: "Bağlanıb",    cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",           Icon: XCircleIcon },
};

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm shrink-0">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}{label}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%]">{value || "-"}</span>
    </div>
  );
}

const fmtDate = (d) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return d; }
};

export function TicketDetailModal({ open, onClose, ticket }) {
  const { color, getRgba } = useComplexColor();
  if (!ticket) return null;

  const st = STATUS_CFG[ticket.status] || { label: ticket.status || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", Icon: null };
  const StIcon = st.Icon;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 !max-w-lg">
      {/* ── Compact gradient header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${getRgba(0.75)})` }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Müraciət Detalları</p>
            <p className="text-white/70 text-xs">#{ticket.id || ticket.ticket_number}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <DialogBody className="p-5 space-y-4">
        {/* Title + status banner */}
        <div
          className="rounded-xl p-4 flex items-start justify-between gap-3"
          style={{ background: getRgba(0.06), border: `1px solid ${getRgba(0.15)}` }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base leading-tight">{ticket.title || "Müraciət"}</p>
            {ticket.category && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ticket.category}</p>}
          </div>
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${st.cls}`}>
            {StIcon && <StIcon className="h-3.5 w-3.5" />}{st.label}
          </span>
        </div>

        {/* Description */}
        {(ticket.description || ticket.message) && (
          <div className="rounded-xl p-4 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Təsvir</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{ticket.description || ticket.message}</p>
          </div>
        )}

        {/* Detail rows */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-4 py-1">
          <Row icon={CalendarIcon} label="Tarix"      value={fmtDate(ticket.created_at || ticket.date)} />
          <Row icon={TagIcon}      label="Kateqoriya" value={ticket.category} />
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Bağla
        </button>
      </DialogBody>
    </Dialog>
  );
}

export default TicketDetailModal;

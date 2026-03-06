import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Typography, Spinner } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import {
  BuildingOfficeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const STATUSES = ["available", "occupied", "reserved", "disabled"];

const RESIDENTS = [
  "Əli Həsənov", "Nigar Məmmədova", "Orxan Quliyev", "Günel Rəsulova",
  "Tural Əliyev", "Sevinc Hüseynova", "Kamran İsmayılov", "Aynur Babayeva",
  "Murad Abdullayev", "Leyla Şirinova", "Elnur Nəcəfov", "Röya Həsənli",
  "Vüsal Qəhrəmanov",
];

function genSpots(floor, cols = 10) {
  const rows = ["A", "B", "C", "D"];
  return rows.flatMap((row, ri) =>
    Array.from({ length: cols }, (_, ci) => {
      const num = ci + 1;
      const rand = Math.random();
      const status =
        rand < 0.45 ? "available" :
        rand < 0.72 ? "occupied"  :
        rand < 0.85 ? "reserved"  : "disabled";
      return {
        id: `${floor}-${row}${num}`,
        label: `${row}${String(num).padStart(2, "0")}`,
        row,
        col: num,
        floor,
        status,
        resident: status === "occupied" ? RESIDENTS[(ri * cols + ci) % RESIDENTS.length] : null,
        property: status === "occupied" ? `Blok ${["A","B","C"][ri % 3]}, Mənzil ${(ri * cols + ci + 1) * 7 % 80 + 1}` : null,
        plate: status === "occupied" ? `${["10","77","90"][ri % 3]}-${String(Math.floor(Math.random() * 999) + 1).padStart(3,"0")}-${["AA","BB","CC","DD","EE"][ci % 5]}` : null,
      };
    })
  );
}

const FLOORS = [
  { id: "B2", label: "Yeraltı -2",   spots: genSpots("B2", 8) },
  { id: "B1", label: "Yeraltı -1",   spots: genSpots("B1", 10) },
  { id: "G",  label: "Qrunt (0)",    spots: genSpots("G",  12) },
  { id: "1",  label: "1-ci mərtəbə", spots: genSpots("1",  10) },
];

const STATUS_META = {
  available: { label: "Boş",       bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-400", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500"  },
  occupied:  { label: "Tutulmuş",  bg: "bg-red-50 dark:bg-red-900/30",         border: "border-red-400",     text: "text-red-700 dark:text-red-300",         dot: "bg-red-500"     },
  reserved:  { label: "Rezerv",    bg: "bg-amber-50 dark:bg-amber-900/30",     border: "border-amber-400",   text: "text-amber-700 dark:text-amber-300",     dot: "bg-amber-500"   },
  disabled:  { label: "Bağlı",     bg: "bg-gray-100 dark:bg-gray-800",         border: "border-gray-300 dark:border-gray-600", text: "text-gray-400 dark:text-gray-500", dot: "bg-gray-400" },
};

function SpotCard({ spot, onClick }) {
  const m = STATUS_META[spot.status] || STATUS_META.disabled;
  return (
    <button
      onClick={() => spot.status !== "disabled" && onClick(spot)}
      className={`
        relative flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-150
        ${m.bg} ${m.border}
        ${spot.status !== "disabled" ? "cursor-pointer hover:scale-105 hover:shadow-md active:scale-100" : "cursor-default opacity-50"}
        w-full aspect-[3/2] select-none
      `}
    >
      {/* Car icon for occupied */}
      {spot.status === "occupied" && (
        <svg className="h-4 w-4 opacity-40 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 10l1.5-4.5A2 2 0 017.4 4h5.2a2 2 0 011.9 1.5L16 10H4z"/>
          <rect x="2" y="10" width="16" height="5" rx="1"/>
          <circle cx="5.5" cy="15.5" r="1.5"/>
          <circle cx="14.5" cy="15.5" r="1.5"/>
        </svg>
      )}
      {spot.status === "reserved" && (
        <svg className="h-4 w-4 opacity-40 mb-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
        </svg>
      )}
      <span className={`text-[10px] font-bold leading-none ${m.text}`}>{spot.label}</span>
    </button>
  );
}

function SpotModal({ spot, onClose }) {
  // Close on Escape + lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", fn);
    };
  }, [onClose]);

  if (!spot) return null;
  const m = STATUS_META[spot.status];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-5 py-4 flex items-center justify-between ${m.bg} border-b ${m.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${m.border} ${m.bg}`}>
              <span className={`text-sm font-black ${m.text}`}>{spot.label}</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">Parkinq yeri</p>
              <p className={`text-xs font-semibold ${m.text}`}>{m.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <Row label="Yer nömrəsi" value={spot.label} />
          <Row label="Zona / Sıra" value={`Zona ${spot.row}, ${spot.col}-ci yer`} />
          <Row label="Mərtəbə" value={spot.floor} />
          <Row label="Status">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${m.bg} ${m.text} border ${m.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
              {m.label}
            </span>
          </Row>
          {spot.resident && <Row label="Sakin" value={spot.resident} />}
          {spot.property && <Row label="Mənzil" value={spot.property} />}
          {spot.plate && <Row label="Qeydiyyat nişanı">
            <span className="font-mono bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600 px-2 py-0.5 rounded text-xs font-bold tracking-wider">
              {spot.plate}
            </span>
          </Row>}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Row({ label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
      {children ?? <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 text-right">{value}</span>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ParkingPage() {
  const { t } = useTranslation();
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();

  const [activeFloor, setActiveFloor] = useState(FLOORS[1].id);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);

  const floor = FLOORS.find((f) => f.id === activeFloor) || FLOORS[0];

  const allSpots = useMemo(() => FLOORS.flatMap((f) => f.spots), []);
  const stats = useMemo(() => ({
    total:     allSpots.length,
    available: allSpots.filter((s) => s.status === "available").length,
    occupied:  allSpots.filter((s) => s.status === "occupied").length,
    reserved:  allSpots.filter((s) => s.status === "reserved").length,
    disabled:  allSpots.filter((s) => s.status === "disabled").length,
  }), [allSpots]);

  const visibleSpots = useMemo(() => {
    return floor.spots.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          s.label.toLowerCase().includes(q) ||
          (s.resident && s.resident.toLowerCase().includes(q)) ||
          (s.plate && s.plate.toLowerCase().includes(q)) ||
          (s.property && s.property.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [floor.spots, statusFilter, search]);

  const rows = useMemo(() => {
    const map = {};
    visibleSpots.forEach((s) => {
      if (!map[s.row]) map[s.row] = [];
      map[s.row].push(s);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [visibleSpots]);

  return (
    <div className="flex flex-col gap-4 pb-6">

      <div
        className="relative overflow-hidden rounded-2xl shadow-lg p-4 md:p-6 mt-4"
        style={{ background: getActiveGradient(0.92, 0.72), border: `1px solid ${getMtkRgba(0.3)}` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm"
            style={{ backgroundColor: getMtkRgba(0.2) }}
          >
            <svg className="h-7 w-7 text-white font-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 2h8a5 5 0 010 10H9v10H5V2zm4 4v6h4a3 3 0 000-6H9z"/>
            </svg>
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold text-lg md:text-2xl">
              {t("parking.pageTitle") || "Parkinq İdarəetməsi"}
            </Typography>
            <Typography className="text-white/85 text-xs md:text-sm font-medium">
              {t("parking.pageSubtitle") || "Parkinq yerlərini real vaxtda izləyin"}
            </Typography>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ümumi", value: stats.total,     color: "from-blue-500 to-blue-600",    icon: "🅿️" },
          { label: "Boş",   value: stats.available, color: "from-emerald-500 to-emerald-600", icon: "✅" },
          { label: "Tutulmuş", value: stats.occupied, color: "from-red-500 to-red-600",    icon: "🚗" },
          { label: "Rezerv",value: stats.reserved,  color: "from-amber-500 to-amber-600",  icon: "⏳" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-md`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-3xl font-black">{stat.value}</span>
            </div>
            <p className="text-white/80 text-xs font-semibold">{stat.label}</p>
            <div className="mt-2 bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all"
                style={{ width: `${Math.round((stat.value / stats.total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

        <div
          className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-700"
          style={{ scrollbarWidth: "none" }}
        >
          {FLOORS.map((f) => {
            const isActive = f.id === activeFloor;
            const floorStats = {
              available: f.spots.filter((s) => s.status === "available").length,
              occupied:  f.spots.filter((s) => s.status === "occupied").length,
            };
            return (
              <button
                key={f.id}
                onClick={() => setActiveFloor(f.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                  isActive
                    ? "border-current"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                style={isActive ? { color: getMtkRgba(1), borderColor: getMtkRgba(1) } : {}}
              >
                <span className="whitespace-nowrap">{f.label}</span>
                <span className="text-[10px] font-normal opacity-70">
                  {floorStats.available} boş / {floorStats.occupied} tutulmuş
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Yer, sakin, nişan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": getMtkRgba(0.5) }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FunnelIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {[{ v: "all", label: "Hamısı" }, ...STATUSES.map((s) => ({ v: s, label: STATUS_META[s].label }))].map(({ v, label }) => {
              const isActive = statusFilter === v;
              const meta = v !== "all" ? STATUS_META[v] : null;
              return (
                <button
                  key={v}
                  onClick={() => setStatusFilter(v)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? "text-white border-transparent shadow-sm"
                      : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                  }`}
                  style={isActive ? { background: v === "all" ? getActiveGradient(0.88, 0.68) : undefined, backgroundColor: v !== "all" ? meta?.dot.replace("bg-", "") : undefined } : {}}
                >
                  {meta && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : meta.dot}`} />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 md:p-6">

          <div className="flex flex-wrap gap-4 mb-5">
            {Object.entries(STATUS_META).map(([key, m]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm border ${m.border} ${m.bg}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{m.label}</span>
              </div>
            ))}
          </div>

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Uyğun parkinq yeri tapılmadı</p>
            </div>
          ) : (
            <div className="space-y-6">
              {rows.map(([rowLabel, spots]) => (
                <div key={rowLabel}>
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: getActiveGradient(0.85, 0.65) }}
                    >
                      {rowLabel}
                    </div>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                    <span className="text-xs text-gray-400">
                      {spots.filter((s) => s.status === "available").length} boş / {spots.length}
                    </span>
                  </div>

                  <div className="flex items-stretch gap-2">
                    <div className="w-3 flex-shrink-0 rounded-l-lg bg-gray-200 dark:bg-gray-700" />

                    <div className="flex-1 grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${Math.min(spots.length, 10)}, minmax(0, 1fr))` }}
                    >
                      {spots.map((spot) => (
                        <SpotCard key={spot.id} spot={spot} onClick={setSelectedSpot} />
                      ))}
                    </div>

                    <div className="w-3 flex-shrink-0 rounded-r-lg bg-gray-200 dark:bg-gray-700" />
                  </div>

                  <div className="mt-1.5 mx-3 h-5 rounded-b-lg bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 tracking-widest font-semibold uppercase">Keçid yolu</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}

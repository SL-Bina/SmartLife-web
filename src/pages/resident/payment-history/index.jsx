import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import {
  CreditCardIcon,
  EyeIcon,
  CalendarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useComplexColor } from "@/hooks/useComplexColor";

const ResidentPaymentHistoryPage = () => {
  const { t } = useTranslation();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"

  useEffect(() => { fetchPayments(); }, [selectedPropertyId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Demo data - real API çağrısı burada olacaq
      const demoPayments = [
        {
          id: 1,
          invoice_id: 101,
          service_name: "İstilik",
          amount: 45.50,
          payment_date: "2024-03-10T14:30:00",
          payment_method: "online",
          status: "completed",
          transaction_id: "TRX123456789",
          description: "Mart ayı istilik ödənişi"
        },
        {
          id: 2,
          invoice_id: 102,
          service_name: "Su",
          amount: 22.30,
          payment_date: "2024-03-08T10:15:00",
          payment_method: "cash",
          status: "completed",
          transaction_id: null,
          description: "Mart ayı su ödənişi"
        },
        {
          id: 3,
          invoice_id: 103,
          service_name: "Təmizlik",
          amount: 15.00,
          payment_date: "2024-03-05T16:45:00",
          payment_method: "bank_transfer",
          status: "completed",
          transaction_id: "BANK987654321",
          description: "Fevral ayı təmizlik xidməti"
        },
        {
          id: 4,
          invoice_id: 104,
          service_name: "İstilik",
          amount: 38.75,
          payment_date: "2024-02-28T09:20:00",
          payment_method: "online",
          status: "failed",
          transaction_id: "TRX456789123",
          description: "Fevral ayı istilik ödənişi (uğursuz)"
        },
        {
          id: 5,
          invoice_id: 105,
          service_name: "Qaz",
          amount: 31.20,
          payment_date: "2024-02-25T11:10:00",
          payment_method: "online",
          status: "completed",
          transaction_id: "TRX789123456",
          description: "Fevral ayı qaz ödənişi"
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Loading effect
      setPayments(demoPayments);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (payment) => { setSelectedPayment(payment); setDetailModalOpen(true); };

  const formatDate = (d) => {
    if (!d) return "-";
    try { 
      const date = new Date(d);
      return date.toLocaleDateString("az-AZ", { 
        year: "numeric", 
        month: "short", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }); 
    }
    catch { return d; }
  };

  const STATUSES = {
    completed: { label: "Tamamlandı", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircleIcon className="h-3.5 w-3.5" /> },
    failed:    { label: "Uğursuz",   cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",     icon: <XCircleIcon className="h-3.5 w-3.5" /> },
    pending:   { label: "Gözləyir",  cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <ClockIcon className="h-3.5 w-3.5" /> },
  };
  const statusCfg = (s) => STATUSES[s] || { label: s || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", icon: null };

  const completedCount = payments.filter((p) => p.status === "completed").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;
  const totalPaid = payments.filter((p) => p.status === "completed").reduce((s, p) => s + Number(p.amount || 0), 0);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse" style={{ position: "relative", zIndex: 0 }}>
        {/* Header */}
        <div className="h-[80px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl h-[76px] bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        {/* Filter/toggle row */}
        <div className="h-10 w-48 rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Payment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>
      {/* ── Header ── */}
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <CreditCardIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">Ödəniş Tarixcəsi</Typography>
            <Typography variant="small" className="text-white/80">{payments.length} ödəniş</Typography>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Cəmi",         value: payments.length,  cls: "text-gray-900 dark:text-white",        bg: getRgba(0.07) },
          { label: "Uğurlu",       value: completedCount,   cls: "text-green-600 dark:text-green-400",   bg: "rgba(34,197,94,0.07)", extra: `${totalPaid.toFixed(2)} ₼` },
          { label: "Uğursuz",      value: failedCount,      cls: "text-red-600 dark:text-red-400",     bg: "rgba(239,68,68,0.07)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center border dark:border-gray-700" style={{ background: s.bg, borderColor: getRgba(0.15) }}>
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">{s.label}</Typography>
            <Typography className={`font-bold text-xl ${s.cls}`}>{s.value}</Typography>
            {s.extra && <Typography variant="small" className="text-green-500 text-xs">{s.extra}</Typography>}
          </div>
        ))}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <DocumentTextIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <Typography className="font-semibold text-gray-500 dark:text-gray-400">Ödəniş tapılmadı</Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">Hələ heç bir ödəniş etməmisiniz</Typography>
        </div>
      ) : (
        <>
          {/* ── View toggle ── */}
          <div className="flex items-center gap-2">
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs font-medium whitespace-nowrap">Görünüş:</Typography>
            <div className="flex items-center rounded-xl border dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
              {[
                { id: "card",  Icon: Squares2X2Icon, label: "Kart" },
                { id: "table", Icon: TableCellsIcon,  label: "Cədvəl" },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === id
                      ? "text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  style={viewMode === id ? { background: color } : {}}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CARD VIEW ── */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {payments.map((payment, index) => {
                const cfg = statusCfg(payment.status);
                const isCompleted = payment.status === "completed";
                return (
                  <motion.div key={payment.id || index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                    <Card className="border dark:bg-gray-800 hover:shadow-lg transition-shadow" style={{ borderColor: isCompleted ? getRgba(0.3) : "rgba(239,68,68,0.3)" }}>
                      <CardBody className="p-4">
                        {/* top */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <Typography className="font-bold text-gray-900 dark:text-white text-sm truncate">
                              {payment.service_name}
                            </Typography>
                            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">#{payment.invoice_id}</Typography>
                          </div>
                          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </div>

                        {/* amount */}
                        <div className="flex items-end justify-between mb-3">
                          <div>
                            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Məbləğ</Typography>
                            <Typography className={`font-bold text-lg leading-tight ${isCompleted ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                              {Number(payment.amount || 0).toFixed(2)} ₼
                            </Typography>
                          </div>
                        </div>

                        {/* payment date */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                          <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                            {formatDate(payment.payment_date)}
                          </Typography>
                        </div>

                        {/* payment method */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <CreditCardIcon className="h-3.5 w-3.5 text-gray-400" />
                          <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                            {payment.payment_method === "online" ? "Online" : 
                             payment.payment_method === "cash" ? "Nağd" : 
                             payment.payment_method === "bank_transfer" ? "Bank Köçürmə" : payment.payment_method}
                          </Typography>
                        </div>

                        {/* actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetail(payment)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <EyeIcon className="h-3.5 w-3.5" /> Bax
                          </button>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === "table" && (
            <div className="rounded-xl border dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: getRgba(0.08) }}>
                      {["#", "Xidmət", "Məbləğ", "Tarix", "Ödəmə üsulu", "Status", ""].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, i) => {
                      const cfg = statusCfg(payment.status);
                      const isCompleted = payment.status === "completed";
                      return (
                        <tr key={payment.id || i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-3 py-2.5 text-gray-400 dark:text-gray-500 text-xs">#{payment.invoice_id}</td>
                          <td className="px-3 py-2.5">
                            <Typography variant="small" className="font-semibold text-gray-800 dark:text-white truncate max-w-[140px]">
                              {payment.service_name}
                            </Typography>
                          </td>
                          <td className={`px-3 py-2.5 font-bold whitespace-nowrap ${isCompleted ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                            {Number(payment.amount || 0).toFixed(2)} ₼
                          </td>
                          <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                            {formatDate(payment.payment_date)}
                          </td>
                          <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                            {payment.payment_method === "online" ? "Online" : 
                             payment.payment_method === "cash" ? "Nağd" : 
                             payment.payment_method === "bank_transfer" ? "Bank Köçürmə" : payment.payment_method}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${cfg.cls}`}>
                              {cfg.icon}{cfg.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => openDetail(payment)} title="Bax" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Detail Modal ── */}
      {detailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">Ödəniş Detalları</Typography>
              <button 
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Xidmət</Typography>
                <Typography className="font-semibold text-gray-900 dark:text-white">{selectedPayment.service_name}</Typography>
              </div>
              
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Faktura №</Typography>
                <Typography className="font-semibold text-gray-900 dark:text-white">#{selectedPayment.invoice_id}</Typography>
              </div>
              
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Məbləğ</Typography>
                <Typography className={`font-bold text-lg ${selectedPayment.status === "completed" ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-red-400"}`}>
                  {Number(selectedPayment.amount || 0).toFixed(2)} ₼
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Ödəniş Tarixi</Typography>
                <Typography className="font-semibold text-gray-900 dark:text-white">{formatDate(selectedPayment.payment_date)}</Typography>
              </div>
              
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Ödəmə Üsulu</Typography>
                <Typography className="font-semibold text-gray-900 dark:text-white">
                  {selectedPayment.payment_method === "online" ? "Online" : 
                   selectedPayment.payment_method === "cash" ? "Nağd" : 
                   selectedPayment.payment_method === "bank_transfer" ? "Bank Köçürmə" : selectedPayment.payment_method}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Status</Typography>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg(selectedPayment.status).cls}`}>
                  {statusCfg(selectedPayment.status).icon}{statusCfg(selectedPayment.status).label}
                </span>
              </div>
              
              {selectedPayment.transaction_id && (
                <div>
                  <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Tranzaksiya ID</Typography>
                  <Typography className="font-mono text-xs text-gray-600 dark:text-gray-400">{selectedPayment.transaction_id}</Typography>
                </div>
              )}
              
              {selectedPayment.description && (
                <div>
                  <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">Qeyd</Typography>
                  <Typography className="text-sm text-gray-700 dark:text-gray-300">{selectedPayment.description}</Typography>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResidentPaymentHistoryPage;

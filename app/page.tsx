"use client";

import { useState, useEffect } from "react";
import {
  hitungSusunanTrukOpsiB,
  TruckCalculationResult,
} from "@/app/lib/calculator";
import {
  Truck,
  Layers,
  Info,
  Table as TableIcon,
  Box,
  Sun,
  Moon,
} from "lucide-react";

export default function Home() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app_theme") === "dark";
    }
    return false;
  });

  const [metode, setMetode] = useState<string>("bantalan");
  const [tonase, setTonase] = useState<string>("");
  const [beratPcs, setBeratPcs] = useState<string>("10");
  const [pcsSamping, setPcsSamping] = useState<string>("");
  const [pcsBelakang, setPcsBelakang] = useState<string>("");

  // Sync class 'dark' ke elemen <html> setiap kali isDark berubah
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("app_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const [resultState, setResultState] = useState<TruckCalculationResult | null>(
    null,
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const pcsSampingAngka = Number(pcsSamping);
  const pcsBelakangAngka = Number(pcsBelakang);

  const hitung = () => {
    setResultState(
      hitungSusunanTrukOpsiB({
        metodeSusun: metode,
        tonaseKg: Number(tonase) || 0,
        beratPcs: Number(beratPcs) || 10,
        pcsSamping: Number(pcsSamping) || 0,
        pcsBelakang: Number(pcsBelakang) || 0,
      }),
    );
    setSubmitted(true);
  };

  const emptyResult: TruckCalculationResult = {
    totalPcs: 0,
    tinggiPuncak: 0,
    tinggiDasar: 0,
    barisPenuh: 0,
    barisRendah: 0,
    sisaGantung: 0,
    keterangan: "",
  };
  const hasil: TruckCalculationResult = resultState ?? emptyResult;

  const barisData = Array.from(
    { length: Math.max(0, pcsBelakangAngka) },
    (_, index) => {
      const barisKe = index + 1;
      const isPenuh = barisKe <= hasil.barisPenuh;
      const isTerakhir = barisKe === pcsBelakangAngka;

      const tinggi = isPenuh ? hasil.tinggiPuncak : hasil.tinggiDasar;
      let pcsGantung = 0;

      if (isTerakhir && hasil.sisaGantung > 0) {
        pcsGantung = hasil.sisaGantung;
      }

      const totalPcsBaris = tinggi * pcsSampingAngka + pcsGantung;

      let labelPosisi = "Tengah";
      if (barisKe === 1) labelPosisi = "Depan";
      if (isTerakhir) labelPosisi = "Belakang";

      let status = isPenuh ? "Baris Penuh (Tinggi Puncak)" : "Baris Standar";
      if (isTerakhir && pcsGantung > 0) {
        status = `Baris Standar + ${pcsGantung} Pcs Gantungan`;
      }

      return {
        barisKe,
        labelPosisi,
        totalPcsBaris,
        tinggi,
        pcsGantung,
        status,
        isPenuh,
        isTerakhir,
      };
    },
  );

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 p-3 sm:p-6 md:p-8 flex justify-center items-start transition-colors duration-300">
      <div className="w-full max-w-5xl space-y-5 sm:space-y-6">
        {/* Main Card */}
        <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-[#0b1120] text-white p-4 sm:p-6 flex items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-wide text-white">
                  Kalkulator Tonase Muatan Truk
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Susunan Muatan Beras Lapangan
                </p>
              </div>
            </div>

            {/* Toggle Mode & Badge */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="hidden sm:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-slate-300" />
                    <span className="hidden sm:inline">Night Mode</span>
                  </>
                )}
              </button>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold px-3 py-1.5 rounded-full">
                {metode === "bantalan" ? "Bantalan / Tir-tiran" : "Stapelan"}
              </span>
            </div>
          </div>

          {/* Form & Ringkasan Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6">
            {/* Form Input Parameter */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Parameter Muatan
              </h2>

              {/* Metode Susun */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Metode Susun
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["bantalan", "stapelan"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetode(m)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                        metode === m
                          ? "bg-amber-500 border-amber-600 text-slate-950 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {m === "bantalan" ? "Bantalan" : "Stapelan"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tonase & Kemasan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Tonase (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={tonase}
                    onChange={(e) => setTonase(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none transition"
                    placeholder="cth: 10020"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kemasan (kg/pcs)
                  </label>
                  <select
                    value={beratPcs}
                    onChange={(e) => setBeratPcs(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none transition cursor-pointer"
                  >
                    <option value={5}>5 kg</option>
                    <option value={10}>10 kg</option>
                    <option value={20}>20 kg</option>
                    <option value={25}>25 kg</option>
                    <option value={50}>50 kg</option>
                  </select>
                </div>
              </div>

              {/* Samping & Belakang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pcs Samping (Lebar)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={pcsSamping}
                    onChange={(e) => setPcsSamping(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none transition"
                    placeholder="cth: 7"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pcs Belakang (Panjang)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={pcsBelakang}
                    onChange={(e) => setPcsBelakang(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none transition"
                    placeholder="cth: 9"
                  />
                </div>
              </div>

              {/* Tombol Hitung */}
              <button
                type="button"
                onClick={hitung}
                className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm shadow-sm transition cursor-pointer"
              >
                Hitung Susunan
              </button>
            </div>

            {/* Panel Ringkasan Hasil */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-amber-500" />
                  <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Ringkasan Kapasitas
                  </h2>
                </div>

                {!submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <Info className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Isi parameter lalu tekan{" "}
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        &rdquo;Hitung Susunan&rdquo;
                      </span>{" "}
                      untuk melihat hasil.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                      Total Karung
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {hasil.totalPcs}{" "}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                        pcs
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                      Tinggi Puncak
                    </span>
                    <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                      {hasil.tinggiPuncak}{" "}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                        tk
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900/90 p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                      Gantungan
                    </span>
                    <p className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">
                      {hasil.sisaGantung}{" "}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                        pcs
                      </span>
                    </p>
                  </div>
                </div>

                {/* Keterangan Operasional */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 sm:p-4 rounded-xl flex items-start gap-2.5 sm:gap-3">
                  <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase mb-1">
                      Instruksi Susunan Lapangan
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed font-normal">
                      {hasil.sisaGantung === 0 &&
                      hasil.barisPenuh === pcsBelakangAngka ? (
                        <>
                          Semua{" "}
                          <strong className="font-bold text-amber-950 dark:text-amber-300">
                            {pcsBelakangAngka}
                          </strong>{" "}
                          baris rata setinggi{" "}
                          <strong className="font-bold text-amber-950 dark:text-amber-300">
                            {hasil.tinggiDasar}
                          </strong>{" "}
                          tumpuk (
                          <strong className="font-bold text-amber-950 dark:text-amber-300">
                            {pcsSampingAngka}
                          </strong>{" "}
                          karung per baris). Tidak ada sisa gantung.
                        </>
                      ) : (
                        <>
                          {hasil.barisPenuh > 0 && (
                            <>
                              Baris{" "}
                              <strong className="font-bold text-amber-950 dark:text-amber-300">
                                1 - {hasil.barisPenuh}
                              </strong>{" "}
                              dimuat penuh{" "}
                              <strong className="font-bold text-amber-950 dark:text-amber-300">
                                {hasil.tinggiPuncak} tumpuk.
                              </strong>{" "}
                            </>
                          )}
                          {hasil.sisaGantung === 0 ? (
                            <>
                              Baris sisanya (
                              <strong className="font-bold text-amber-950 dark:text-amber-300">
                                {hasil.barisPenuh + 1} - {pcsBelakangAngka}
                              </strong>
                              )
                              <strong className="font-bold text-amber-950 dark:text-amber-300">
                                setinggi {hasil.tinggiDasar}
                              </strong>{" "}
                              tumpuk rata tanpa gantungan.
                            </>
                          ) : (
                            <>
                              {hasil.barisRendah > 1 && (
                                <>
                                  <strong className="font-bold text-amber-950 dark:text-amber-300">
                                    Baris {hasil.barisPenuh + 1} -{" "}
                                    {pcsBelakangAngka - 1}
                                  </strong>{" "}
                                  <strong className="font-bold text-amber-950 dark:text-amber-300">
                                    setinggi {hasil.tinggiDasar}
                                    tumpuk.{" "}
                                  </strong>{" "}
                                </>
                              )}
                              <strong className="font-bold text-amber-950 dark:text-amber-300">
                                Baris {pcsBelakangAngka} (paling belakang)
                              </strong>{" "}
                              setinggi{" "}
                              <strong className="font-bold text-amber-950 dark:text-amber-300"></strong>{" "}
                              <strong className="font-bold text-rose-600 dark:text-rose-400">
                                {hasil.tinggiDasar} tumpuk + {hasil.sisaGantung}{" "}
                                pcs gantung
                              </strong>{" "}
                              di atasnya.
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
              </div>
              </>
                )}
              </div>

              {submitted && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-right">
                  <span className="text-[18px] text-slate-500 dark:text-slate-400">
                    <strong className="font-bold text-amber-950 dark:text-amber-300">
                      Formula: {hasil.tinggiPuncak} &times; {pcsSampingAngka} &times;{" "}
                      {hasil.barisPenuh} +{" "}
                      {hasil.barisRendah > 0
                        ? `(${hasil.tinggiDasar} × ${pcsSampingAngka}) + ${hasil.sisaGantung}`
                        : "0"}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Preview Visual */}
        <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                Preview Visual Susunan (Isometrik)
              </h3>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-x-2">
              <span>
                Kapasitas/Layer:{" "}
                <strong className="text-amber-600 dark:text-amber-400">
                  {pcsSampingAngka * pcsBelakangAngka} pcs
                </strong>
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto py-4 flex justify-center items-center min-h-55 bg-slate-50 dark:bg-[#080d19] rounded-xl border border-slate-200 dark:border-slate-800">
            {submitted && pcsSampingAngka > 0 && pcsBelakangAngka > 0 ? (
              <svg
                viewBox={`0 0 ${Math.max(500, (pcsBelakangAngka + pcsSampingAngka) * 32 + 60)} ${Math.max(220, (pcsBelakangAngka + pcsSampingAngka) * 14 + hasil.tinggiPuncak * 8 + 50)}`}
                className="w-full max-w-2xl h-auto"
              >
                <g
                  transform={`translate(${pcsSampingAngka * 20 + 30}, ${hasil.tinggiPuncak * 8 + 30})`}
                >
                  {Array.from({ length: pcsBelakangAngka }).map((_, rIdx) => {
                    const barisKe = rIdx + 1;
                    const isPenuh = barisKe <= hasil.barisPenuh;
                    const isTerakhir = barisKe === pcsBelakangAngka;
                    const layerCount = isPenuh
                      ? hasil.tinggiPuncak
                      : hasil.tinggiDasar;

                    return Array.from({ length: pcsSampingAngka }).map((_, cIdx) => {
                      const isGantungSlot =
                        isTerakhir && cIdx < hasil.sisaGantung;
                      const totalLayersHere =
                        layerCount + (isGantungSlot ? 1 : 0);

                      return Array.from({ length: totalLayersHere }).map(
                        (_, lIdx) => {
                          const isGantungBox =
                            isGantungSlot && lIdx === layerCount;
                          const isoX = (rIdx - cIdx) * 18;
                          const isoY = (rIdx + cIdx) * 9 - lIdx * 7;

                          const topColor = isGantungBox
                            ? "#f43f5e"
                            : lIdx % 2 === 0
                              ? "#93c5fd"
                              : "#60a5fa";
                          const leftColor = isGantungBox
                            ? "#e11d48"
                            : lIdx % 2 === 0
                              ? "#34d399"
                              : "#10b981";
                          const rightColor = isGantungBox
                            ? "#be123c"
                            : lIdx % 2 === 0
                              ? "#fbbf24"
                              : "#f59e0b";

                          return (
                            <g key={`box-${rIdx}-${cIdx}-${lIdx}`}>
                              <polygon
                                points={`${isoX},${isoY - 5} ${isoX + 16},${isoY + 3} ${isoX},${isoY + 11} ${isoX - 16},${isoY + 3}`}
                                fill={topColor}
                                stroke={isDark ? "#070b14" : "#ffffff"}
                                strokeWidth="0.6"
                              />
                              <polygon
                                points={`${isoX - 16},${isoY + 3} ${isoX},${isoY + 11} ${isoX},${isoY + 18} ${isoX - 16},${isoY + 10}`}
                                fill={leftColor}
                                stroke={isDark ? "#070b14" : "#ffffff"}
                                strokeWidth="0.6"
                              />
                              <polygon
                                points={`${isoX},${isoY + 11} ${isoX + 16},${isoY + 3} ${isoX + 16},${isoY + 10} ${isoX},${isoY + 18}`}
                                fill={rightColor}
                                stroke={isDark ? "#070b14" : "#ffffff"}
                                strokeWidth="0.6"
                              />
                            </g>
                          );
                        },
                      );
                    });
                  })}
                </g>
              </svg>
            ) : (
              <p className="text-xs text-slate-400">
                {submitted
                  ? "Masukkan nilai dimensi yang valid"
                  : 'Tekan "Hitung Susunan" untuk melihat preview.'}
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Tabel Rincian */}
        <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
              Tabel Rincian Muatan per Baris Truk
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4">Baris Truk</th>
                  <th className="py-3 px-3 sm:px-4">Jumlah Pcs</th>
                  <th className="py-3 px-3 sm:px-4">Tinggi (Karung)</th>
                  <th className="py-3 px-3 sm:px-4">Keterangan Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {!submitted && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 px-4 text-center text-xs text-slate-400 dark:text-slate-500"
                    >
                      Tekan &rdquo;Hitung Susunan&rdquo; untuk melihat rincian per
                      baris.
                    </td>
                  </tr>
                )}
                {barisData.map((row) => (
                  <tr
                    key={row.barisKe}
                    className={`transition-colors ${
                      row.isTerakhir && row.pcsGantung > 0
                        ? "bg-amber-500/10 dark:bg-blue-950/40 text-amber-900 dark:text-blue-200"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 dark:text-white">
                      Baris {row.barisKe} ({row.labelPosisi})
                    </td>
                    <td className="py-3 px-3 sm:px-4 font-semibold">
                      {row.totalPcsBaris} pcs
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      {row.tinggi}
                      {row.pcsGantung > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1 font-bold">
                          (+{row.pcsGantung} pcs)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.isTerakhir && row.pcsGantung > 0
                            ? "bg-amber-500 dark:bg-blue-600 text-slate-950 dark:text-white"
                            : row.isPenuh
                              ? "text-slate-800 dark:text-slate-300"
                              : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

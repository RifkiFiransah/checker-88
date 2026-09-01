// src/lib/calculator.ts

export interface TruckCalculationInput {
  metodeSusun?: string;
  tonaseKg: number;
  beratPcs?: number;
  pcsSamping: number;
  pcsBelakang: number;
}

export interface TruckCalculationResult {
  error?: string;
  totalPcs: number;
  tinggiPuncak: number;
  tinggiDasar: number;
  barisPenuh: number;
  barisRendah: number;
  sisaGantung: number;
  keterangan: string;
}

export function hitungSusunanTrukOpsiB({
  tonaseKg,
  beratPcs = 10,
  pcsSamping,
  pcsBelakang,
}: TruckCalculationInput): TruckCalculationResult {
  const totalPcs = Math.round(tonaseKg / beratPcs);
  const pcsPerLayer = pcsSamping * pcsBelakang;

  if (pcsPerLayer <= 0 || totalPcs <= 0) {
    return {
      error: "Input tidak valid",
      totalPcs: 0,
      tinggiPuncak: 0,
      tinggiDasar: 0,
      barisPenuh: 0,
      barisRendah: 0,
      sisaGantung: 0,
      keterangan: "Input tonase, samping, dan belakang harus lebih dari 0",
    };
  }

  // 1. Hitung tinggi dasar (lantai minimal) dan sisa
  const tinggiDasar = Math.floor(totalPcs / pcsPerLayer);
  const sisaKarungAtas = totalPcs % pcsPerLayer;

  // 2. Jika sisa pas 0 (semua baris rata setinggi dasar)
  if (sisaKarungAtas === 0) {
    return {
      totalPcs,
      tinggiPuncak: tinggiDasar,
      tinggiDasar,
      barisPenuh: pcsBelakang,
      barisRendah: 0,
      sisaGantung: 0,
      keterangan: `Semua <b>${pcsBelakang}</b> baris rata setinggi <b>${tinggiDasar}</b> tumpuk (<b>${pcsSamping}</b> karung per baris). Tidak ada sisa gantung.`,
    };
  }

  // 3. Sisa karung dinaikkan menjadi tumpukan ke-(tinggiDasar + 1) dari baris depan
  const tinggiPuncak = tinggiDasar + 1;
  const barisPenuh = Math.floor(sisaKarungAtas / pcsSamping);
  const sisaGantung = sisaKarungAtas % pcsSamping;
  const barisRendah = pcsBelakang - barisPenuh;

  // 4. Susun teks keterangan operasional
  let teksDeskripsi = "";
  if (barisPenuh > 0) {
    teksDeskripsi += `Baris 1 - <span>${barisPenuh}</span> dimuat penuh <span>${tinggiPuncak}</span> tumpuk. `;
  }

  if (sisaGantung === 0) {
    teksDeskripsi += `Baris sisanya (<span>${barisPenuh + 1}</span>–<span>${pcsBelakang}</span>) setinggi <span>${tinggiDasar}</span> tumpuk rata tanpa gantungan.`;
  } else {
    const barisGantungIndex = pcsBelakang;
    if (barisRendah > 1) {
      teksDeskripsi += `Baris <span>${barisPenuh + 1}</span>–<span>${barisGantungIndex - 1}</span> setinggi <span>${tinggiDasar}</span> tumpuk. `;
    }
    teksDeskripsi += `Baris <span>${barisGantungIndex}</span> (paling belakang) setinggi <span>${tinggiDasar}</span> tumpuk + <span>${sisaGantung}</span> pcs gantung di atasnya.`;
  }

  return {
    totalPcs,
    tinggiPuncak,
    tinggiDasar,
    barisPenuh,
    barisRendah,
    sisaGantung,
    keterangan: teksDeskripsi.trim(),
  };
}

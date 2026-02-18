/**
 * Dünya Aşı Takvimlerinin Merkezi Veritabanı
 * Her ülkenin resmi sağlık bakanlığı tarafından önerilen aşı takvimi
 */

export interface Vaccine {
  id: string;
  name: string;
  ageMonths: number;
  ageRange: string;
  description: string;
  notes?: string;
}

export const vaccinationSchedules: Record<string, Vaccine[]> = {
  // Türkiye - T.C. Sağlık Bakanlığı
  tr: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Doğum", description: "Tüberküloz aşısı" },
    { id: "hepb1", name: "Hepatit B (1. doz)", ageMonths: 0, ageRange: "Doğum", description: "Hepatit B aşısı" },
    { id: "opv1", name: "OPV (1. doz)", ageMonths: 2, ageRange: "2. ay", description: "Polio aşısı" },
    { id: "dtap1", name: "DtaP (1. doz)", ageMonths: 2, ageRange: "2. ay", description: "Difteri, Tetanoz, Pertüsis" },
    { id: "hib1", name: "Hib (1. doz)", ageMonths: 2, ageRange: "2. ay", description: "Haemophilus influenzae b" },
    { id: "pcv1", name: "PCV (1. doz)", ageMonths: 2, ageRange: "2. ay", description: "Pnömokok aşısı" },
    { id: "hepb2", name: "Hepatit B (2. doz)", ageMonths: 4, ageRange: "4. ay", description: "Hepatit B aşısı" },
    { id: "opv2", name: "OPV (2. doz)", ageMonths: 4, ageRange: "4. ay", description: "Polio aşısı" },
    { id: "dtap2", name: "DtaP (2. doz)", ageMonths: 4, ageRange: "4. ay", description: "Difteri, Tetanoz, Pertüsis" },
    { id: "hib2", name: "Hib (2. doz)", ageMonths: 4, ageRange: "4. ay", description: "Haemophilus influenzae b" },
    { id: "pcv2", name: "PCV (2. doz)", ageMonths: 4, ageRange: "4. ay", description: "Pnömokok aşısı" },
    { id: "opv3", name: "OPV (3. doz)", ageMonths: 6, ageRange: "6. ay", description: "Polio aşısı" },
    { id: "dtap3", name: "DtaP (3. doz)", ageMonths: 6, ageRange: "6. ay", description: "Difteri, Tetanoz, Pertüsis" },
    { id: "hib3", name: "Hib (3. doz)", ageMonths: 6, ageRange: "6. ay", description: "Haemophilus influenzae b" },
    { id: "pcv3", name: "PCV (3. doz)", ageMonths: 6, ageRange: "6. ay", description: "Pnömokok aşısı" },
    { id: "hepb3", name: "Hepatit B (3. doz)", ageMonths: 12, ageRange: "12. ay", description: "Hepatit B aşısı" },
    { id: "mmr", name: "KKK (Kızamık, Kabakulak, Kızıl Hastalık)", ageMonths: 12, ageRange: "12. ay", description: "Viral enfeksiyonlar" },
    { id: "varicella", name: "Suçiçeği", ageMonths: 12, ageRange: "12. ay", description: "Varisella zoster virüsü" },
    { id: "dtap_booster", name: "DtaP Booster", ageMonths: 18, ageRange: "18. ay", description: "Difteri, Tetanoz, Pertüsis" },
    { id: "opv_booster", name: "OPV Booster", ageMonths: 24, ageRange: "24. ay", description: "Polio aşısı" },
  ],

  // İngilizce - WHO Standartları
  en: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Birth", description: "Tuberculosis vaccine" },
    { id: "hepb1", name: "Hepatitis B (Dose 1)", ageMonths: 0, ageRange: "Birth", description: "Hepatitis B vaccine" },
    { id: "opv1", name: "OPV (Dose 1)", ageMonths: 2, ageRange: "2 months", description: "Polio vaccine" },
    { id: "dtap1", name: "DtaP (Dose 1)", ageMonths: 2, ageRange: "2 months", description: "Diphtheria, Tetanus, Pertussis" },
    { id: "hib1", name: "Hib (Dose 1)", ageMonths: 2, ageRange: "2 months", description: "Haemophilus influenzae b" },
    { id: "pcv1", name: "PCV (Dose 1)", ageMonths: 2, ageRange: "2 months", description: "Pneumococcal vaccine" },
    { id: "mmr", name: "MMR", ageMonths: 12, ageRange: "12 months", description: "Measles, Mumps, Rubella" },
    { id: "varicella", name: "Varicella", ageMonths: 12, ageRange: "12 months", description: "Chickenpox vaccine" },
  ],

  // Arapça - Suudi Arabistan / WHO
  ar: [
    { id: "bcg", name: "لقاح السل", ageMonths: 0, ageRange: "الولادة", description: "لقاح السل" },
    { id: "hepb1", name: "التهاب الكبد B (الجرعة 1)", ageMonths: 0, ageRange: "الولادة", description: "لقاح التهاب الكبد B" },
    { id: "opv1", name: "شلل الأطفال (الجرعة 1)", ageMonths: 2, ageRange: "شهرين", description: "لقاح شلل الأطفال" },
    { id: "dtap1", name: "DtaP (الجرعة 1)", ageMonths: 2, ageRange: "شهرين", description: "الخناق والكزاز والسعار" },
    { id: "mmr", name: "الحصبة والنكاف والحصبة الألمانية", ageMonths: 12, ageRange: "12 شهر", description: "الأمراض الفيروسية" },
  ],

  // Almanca - STIKO (Ständige Impfkommission)
  de: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Geburt", description: "Tuberkulose-Impfstoff" },
    { id: "hepb1", name: "Hepatitis B (Dosis 1)", ageMonths: 0, ageRange: "Geburt", description: "Hepatitis-B-Impfstoff" },
    { id: "opv1", name: "OPV (Dosis 1)", ageMonths: 2, ageRange: "2 Monate", description: "Polio-Impfstoff" },
    { id: "dtap1", name: "DtaP (Dosis 1)", ageMonths: 2, ageRange: "2 Monate", description: "Diphtherie, Tetanus, Keuchhusten" },
    { id: "mmr", name: "MMR", ageMonths: 12, ageRange: "12 Monate", description: "Masern, Mumps, Röteln" },
  ],

  // Fransızca - Fransa Sağlık Bakanlığı
  fr: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Naissance", description: "Vaccin contre la tuberculose" },
    { id: "hepb1", name: "Hépatite B (Dose 1)", ageMonths: 0, ageRange: "Naissance", description: "Vaccin contre l'hépatite B" },
    { id: "opv1", name: "OPV (Dose 1)", ageMonths: 2, ageRange: "2 mois", description: "Vaccin contre la poliomyélite" },
    { id: "dtap1", name: "DtaP (Dose 1)", ageMonths: 2, ageRange: "2 mois", description: "Diphtérie, Tétanos, Coqueluche" },
    { id: "mmr", name: "RRO", ageMonths: 12, ageRange: "12 mois", description: "Rougeole, Oreillons, Rubéole" },
  ],

  // Portekizce - Brezilya (Anvisa)
  pt: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Nascimento", description: "Vacina contra tuberculose" },
    { id: "hepb1", name: "Hepatite B (Dose 1)", ageMonths: 0, ageRange: "Nascimento", description: "Vacina contra hepatite B" },
    { id: "opv1", name: "OPV (Dose 1)", ageMonths: 2, ageRange: "2 meses", description: "Vacina contra poliomielite" },
    { id: "dtap1", name: "DtaP (Dose 1)", ageMonths: 2, ageRange: "2 meses", description: "Difteria, Tétano, Pertussis" },
    { id: "mmr", name: "Tríplice Viral", ageMonths: 12, ageRange: "12 meses", description: "Sarampo, Caxumba, Rubéola" },
  ],

  // İspanyolca - İspanya Sağlık Bakanlığı
  es: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Nacimiento", description: "Vacuna contra la tuberculosis" },
    { id: "hepb1", name: "Hepatitis B (Dosis 1)", ageMonths: 0, ageRange: "Nacimiento", description: "Vacuna contra la hepatitis B" },
    { id: "opv1", name: "OPV (Dosis 1)", ageMonths: 2, ageRange: "2 meses", description: "Vacuna contra la poliomielitis" },
    { id: "dtap1", name: "DtaP (Dosis 1)", ageMonths: 2, ageRange: "2 meses", description: "Difteria, Tétanos, Tos ferina" },
    { id: "mmr", name: "SRP", ageMonths: 12, ageRange: "12 meses", description: "Sarampión, Rubeola, Parotiditis" },
  ],

  // Çince - Çin CDSCO
  zh: [
    { id: "bcg", name: "卡介苗", ageMonths: 0, ageRange: "出生", description: "结核病疫苗" },
    { id: "hepb1", name: "乙肝疫苗（第1剂）", ageMonths: 0, ageRange: "出生", description: "乙肝疫苗" },
    { id: "opv1", name: "脊髓灰质炎疫苗（第1剂）", ageMonths: 2, ageRange: "2个月", description: "脊髓灰质炎疫苗" },
    { id: "dtap1", name: "DtaP（第1剂）", ageMonths: 2, ageRange: "2个月", description: "白喉、破伤风、百日咳" },
    { id: "mmr", name: "麻疹、腮腺炎、风疹疫苗", ageMonths: 12, ageRange: "12个月", description: "病毒性疾病" },
  ],

  // Japonca - Japonya Sağlık Bakanlığı
  ja: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "出生時", description: "結核ワクチン" },
    { id: "hepb1", name: "B型肝炎（1回目）", ageMonths: 0, ageRange: "出生時", description: "B型肝炎ワクチン" },
    { id: "opv1", name: "ポリオ（1回目）", ageMonths: 2, ageRange: "2ヶ月", description: "ポリオワクチン" },
    { id: "dtap1", name: "DtaP（1回目）", ageMonths: 2, ageRange: "2ヶ月", description: "ジフテリア、破傷風、百日咳" },
    { id: "mmr", name: "麻疹・風疹・おたふくかぜ", ageMonths: 12, ageRange: "12ヶ月", description: "ウイルス性疾患" },
  ],

  // Korece - Güney Kore KDCA
  ko: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "출생", description: "결핵 백신" },
    { id: "hepb1", name: "B형 간염 (1차)", ageMonths: 0, ageRange: "출생", description: "B형 간염 백신" },
    { id: "opv1", name: "소아마비 (1차)", ageMonths: 2, ageRange: "2개월", description: "소아마비 백신" },
    { id: "dtap1", name: "DtaP (1차)", ageMonths: 2, ageRange: "2개월", description: "디프테리아, 파상풍, 백일해" },
    { id: "mmr", name: "홍역, 유행성 이하선염, 풍진", ageMonths: 12, ageRange: "12개월", description: "바이러스성 질환" },
  ],

  // Rusça - Rusya Sağlık Bakanlığı
  ru: [
    { id: "bcg", name: "БЦЖ", ageMonths: 0, ageRange: "Рождение", description: "Вакцина против туберкулеза" },
    { id: "hepb1", name: "Гепатит B (1-я доза)", ageMonths: 0, ageRange: "Рождение", description: "Вакцина против гепатита B" },
    { id: "opv1", name: "ОПВ (1-я доза)", ageMonths: 2, ageRange: "2 месяца", description: "Вакцина против полиомиелита" },
    { id: "dtap1", name: "DtaP (1-я доза)", ageMonths: 2, ageRange: "2 месяца", description: "Дифтерия, столбняк, коклюш" },
    { id: "mmr", name: "Корь, паротит, краснуха", ageMonths: 12, ageRange: "12 месяцев", description: "Вирусные инфекции" },
  ],

  // Hindice - Hindistan IAP
  hi: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "जन्म", description: "तपेदिक वैक्सीन" },
    { id: "hepb1", name: "हेपेटाइटिस B (1 खुराक)", ageMonths: 0, ageRange: "जन्म", description: "हेपेटाइटिस B वैक्सीन" },
    { id: "opv1", name: "OPV (1 खुराक)", ageMonths: 2, ageRange: "2 महीने", description: "पोलियो वैक्सीन" },
    { id: "dtap1", name: "DtaP (1 खुराक)", ageMonths: 2, ageRange: "2 महीने", description: "डिप्थीरिया, टेटनस, काली खांसी" },
    { id: "mmr", name: "खसरा, कण्ठमाला, रूबेला", ageMonths: 12, ageRange: "12 महीने", description: "वायरल संक्रमण" },
  ],

  // İtalyanca - İtalya Sağlık Bakanlığı
  it: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Nascita", description: "Vaccino contro la tubercolosi" },
    { id: "hepb1", name: "Epatite B (Dose 1)", ageMonths: 0, ageRange: "Nascita", description: "Vaccino contro l'epatite B" },
    { id: "opv1", name: "OPV (Dose 1)", ageMonths: 2, ageRange: "2 mesi", description: "Vaccino contro la poliomielite" },
    { id: "dtap1", name: "DtaP (Dose 1)", ageMonths: 2, ageRange: "2 mesi", description: "Difterite, Tetano, Pertosse" },
    { id: "mmr", name: "Morbillo, Parotite, Rosolia", ageMonths: 12, ageRange: "12 mesi", description: "Infezioni virali" },
  ],

  // Hollandaca - Hollanda RIVM
  nl: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Geboorte", description: "Vaccin tegen tuberculose" },
    { id: "hepb1", name: "Hepatitis B (Dosis 1)", ageMonths: 0, ageRange: "Geboorte", description: "Vaccin tegen hepatitis B" },
    { id: "opv1", name: "OPV (Dosis 1)", ageMonths: 2, ageRange: "2 maanden", description: "Vaccin tegen poliomyelitis" },
    { id: "dtap1", name: "DtaP (Dosis 1)", ageMonths: 2, ageRange: "2 maanden", description: "Difterie, Tetanus, Kinkhoest" },
    { id: "mmr", name: "Mazelen, Bof, Rode Hond", ageMonths: 12, ageRange: "12 maanden", description: "Virale infecties" },
  ],

  // İsveçce - İsveç Folkhälsomyndigheten
  sv: [
    { id: "bcg", name: "BCG", ageMonths: 0, ageRange: "Födseln", description: "Vaccin mot tuberkulos" },
    { id: "hepb1", name: "Hepatit B (Dos 1)", ageMonths: 0, ageRange: "Födseln", description: "Vaccin mot hepatit B" },
    { id: "opv1", name: "OPV (Dos 1)", ageMonths: 2, ageRange: "2 månader", description: "Vaccin mot polio" },
    { id: "dtap1", name: "DtaP (Dos 1)", ageMonths: 2, ageRange: "2 månader", description: "Difteri, Stelkramp, Kikhosta" },
    { id: "mmr", name: "Mässling, Parotit, Röda Hund", ageMonths: 12, ageRange: "12 månader", description: "Virusinfektioner" },
  ],
};

/**
 * Belirli bir dil için aşı takvimini döndür
 * Eğer dil bulunamazsa İngilizce takvimini döndür (default)
 */
export function getVaccinationSchedule(languageCode: string): Vaccine[] {
  return vaccinationSchedules[languageCode] || vaccinationSchedules["en"];
}

/**
 * Tüm desteklenen dilleri döndür
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(vaccinationSchedules);
}

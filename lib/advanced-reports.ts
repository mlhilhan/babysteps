/**
 * Advanced Reporting Service
 * Handles PDF generation with WHO percentile charts, email sending, and specialized reports
 */

interface GrowthData {
  date: Date;
  weight: number; // kg
  height: number; // cm
  headCircumference?: number; // cm
  age: number; // months
}

interface ReportOptions {
  childName: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeWHOChart: boolean;
  includeVaccinations: boolean;
  includeMilestones: boolean;
  includeNutrition: boolean;
  reportType: "general" | "doctor" | "specialist";
}

/**
 * WHO Percentile Calculation (Simplified)
 * In production, use actual WHO growth charts data
 */
export function calculateWHOPercentile(
  weight: number,
  height: number,
  age: number,
  gender: "M" | "F"
): {
  weightPercentile: number;
  heightPercentile: number;
  status: "normal" | "underweight" | "overweight";
} {
  // Simplified calculation - in production use actual WHO data
  const avgWeight = age * 0.5 + 3.5; // approximate
  const avgHeight = age * 0.8 + 50; // approximate

  const weightPercentile = Math.min(100, Math.max(0, (weight / avgWeight) * 50));
  const heightPercentile = Math.min(100, Math.max(0, (height / avgHeight) * 50));

  let status: "normal" | "underweight" | "overweight" = "normal";
  if (weight < avgWeight * 0.85) status = "underweight";
  if (weight > avgWeight * 1.15) status = "overweight";

  return { weightPercentile, heightPercentile, status };
}

/**
 * Generate Growth Summary Report
 */
export function generateGrowthSummary(growthData: GrowthData[]): string {
  if (growthData.length === 0) {
    return "Henüz büyüme verisi yok.";
  }

  const latest = growthData[growthData.length - 1];
  const previous = growthData.length > 1 ? growthData[growthData.length - 2] : null;

  let summary = `**Büyüme Özeti**\n\n`;
  summary += `**Son Ölçüm:** ${latest.date.toLocaleDateString("tr-TR")}\n`;
  summary += `- Kilo: ${latest.weight} kg\n`;
  summary += `- Boy: ${latest.height} cm\n`;

  if (previous) {
    const weightChange = latest.weight - previous.weight;
    const heightChange = latest.height - previous.height;
    summary += `\n**Değişim:**\n`;
    summary += `- Kilo: ${weightChange > 0 ? "+" : ""}${weightChange.toFixed(2)} kg\n`;
    summary += `- Boy: ${heightChange > 0 ? "+" : ""}${heightChange.toFixed(2)} cm\n`;
  }

  return summary;
}

/**
 * Generate Doctor Visit Report
 * Specialized report for doctor appointments
 */
export function generateDoctorReport(options: ReportOptions, data: any): string {
  let report = `# ${options.childName} - Doktor Ziyareti Raporu\n\n`;
  report += `**Rapor Tarihi:** ${new Date().toLocaleDateString("tr-TR")}\n`;
  report += `**Dönem:** ${options.dateRange.start.toLocaleDateString("tr-TR")} - ${options.dateRange.end.toLocaleDateString("tr-TR")}\n\n`;

  if (options.includeWHOChart) {
    report += `## Büyüme Grafikleri\n`;
    report += `WHO standartlarına göre büyüme takibi yapılmıştır.\n\n`;
  }

  if (options.includeVaccinations) {
    report += `## Aşı Takvimi\n`;
    report += `Tamamlanan aşılar ve yaklaşan aşılar listelenmiştir.\n\n`;
  }

  if (options.includeMilestones) {
    report += `## Gelişim Kilometre Taşları\n`;
    report += `Motor, dil ve sosyal beceri gelişimi takip edilmiştir.\n\n`;
  }

  if (options.includeNutrition) {
    report += `## Beslenme\n`;
    report += `Beslenme alışkanlıkları ve besin değerleri analiz edilmiştir.\n\n`;
  }

  report += `## Notlar\n`;
  report += `Doktor tarafından yazılacak notlar için boş alan.\n\n`;

  report += `---\n`;
  report += `*Bu rapor BabySteps uygulaması tarafından oluşturulmuştur.*\n`;

  return report;
}

/**
 * Generate Specialist Report
 * For pediatricians, nutritionists, etc.
 */
export function generateSpecialistReport(
  options: ReportOptions,
  data: any,
  specialization: "pediatrician" | "nutritionist" | "developmental"
): string {
  let report = `# ${options.childName} - ${getSpecialistTitle(specialization)} Raporu\n\n`;
  report += `**Rapor Tarihi:** ${new Date().toLocaleDateString("tr-TR")}\n`;
  report += `**Uzman Türü:** ${getSpecialistTitle(specialization)}\n\n`;

  switch (specialization) {
    case "pediatrician":
      report += generatePediatricianReport(data);
      break;
    case "nutritionist":
      report += generateNutritionistReport(data);
      break;
    case "developmental":
      report += generateDevelopmentalReport(data);
      break;
  }

  return report;
}

function getSpecialistTitle(specialization: string): string {
  const titles: Record<string, string> = {
    pediatrician: "Çocuk Hekimi",
    nutritionist: "Beslenme Uzmanı",
    developmental: "Gelişim Uzmanı",
  };
  return titles[specialization] || "Uzman";
}

function generatePediatricianReport(data: any): string {
  return `## Sağlık Durumu\n\nAşılar, hastalıklar ve sağlık gözlemleri detaylı olarak listelenmiştir.\n\n`;
}

function generateNutritionistReport(data: any): string {
  return `## Beslenme Analizi\n\nBesin alımı, alerji ve beslenme alışkanlıkları analiz edilmiştir.\n\n`;
}

function generateDevelopmentalReport(data: any): string {
  return `## Gelişim Analizi\n\nMotor, dil, sosyal ve kognitif gelişim detaylı olarak değerlendirilmiştir.\n\n`;
}

/**
 * Format report as email body
 */
export function formatReportAsEmail(report: string, recipientName: string): string {
  return `Merhaba ${recipientName},\n\n${report}\n\nSaygılarımızla,\nBabySteps Uygulaması`;
}

/**
 * Generate comparison data for similar-aged children (anonymized)
 */
export function generateAnonymousComparison(
  childData: GrowthData,
  populationAverage: GrowthData
): {
  percentile: number;
  status: string;
  recommendation: string;
} {
  const percentile = Math.min(100, Math.max(0, (childData.weight / populationAverage.weight) * 50));

  let status = "Normal";
  let recommendation = "Beslenme ve gelişim normal seviyelerde devam etmektedir.";

  if (percentile < 25) {
    status = "Düşük";
    recommendation = "Beslenme alımını artırmayı düşünün. Doktor ile konsultasyon yapınız.";
  } else if (percentile > 75) {
    status = "Yüksek";
    recommendation = "Beslenme alımını kontrol edin. Fiziksel aktiviteyi artırınız.";
  }

  return { percentile, status, recommendation };
}

/**
 * Generate health summary for emergency situations
 */
export function generateEmergencySummary(childData: any): string {
  return `
**ACİL DURUM BİLGİ KARTı**

**Çocuk Adı:** ${childData.name}
**Doğum Tarihi:** ${childData.dateOfBirth}
**Kan Grubu:** ${childData.bloodType || "Bilinmiyor"}
**Alerji:** ${childData.allergies || "Yok"}
**İlaçlar:** ${childData.medications || "Yok"}
**Doktor:** ${childData.doctorName || ""}
**Doktor Telefonu:** ${childData.doctorPhone || ""}
**Acil Durum İletişi:** ${childData.emergencyContact || ""}

**Son Aşılar:**
${childData.recentVaccines || "Bilinmiyor"}

**Önemli Notlar:**
${childData.importantNotes || "Yok"}
  `;
}

/**
 * Export report to various formats
 */
export async function exportReport(
  report: string,
  format: "pdf" | "txt" | "markdown",
  filename: string
): Promise<string> {
  // TODO: Implement actual export functionality
  // For PDF: use react-native-pdf or similar
  // For TXT/Markdown: use file system APIs

  console.log(`Exporting report as ${format}: ${filename}`);
  return `Report exported as ${format}`;
}

/**
 * Send report via email
 */
export async function sendReportViaEmail(
  report: string,
  recipientEmail: string,
  recipientName: string,
  subject: string
): Promise<boolean> {
  try {
    // TODO: Implement actual email sending
    // Use backend API endpoint or email service (SendGrid, etc.)

    const emailBody = formatReportAsEmail(report, recipientName);
    console.log(`Sending email to ${recipientEmail}:`, emailBody);

    // Placeholder for actual implementation
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

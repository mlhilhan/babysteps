/**
 * RTL (Right-to-Left) Dil Desteği
 * Arapça ve diğer RTL dilleri için destek
 */

// RTL Dil Desteği

export const RTL_LANGUAGES = ["ar"]; // Arapça

/**
 * Belirli bir dil RTL mi kontrol et
 */
export function isRTLLanguage(languageCode: string): boolean {
  return RTL_LANGUAGES.includes(languageCode);
}

/**
 * Yazı yönünü döndür (ltr veya rtl)
 */
export function getTextDirection(languageCode: string): "ltr" | "rtl" {
  return isRTLLanguage(languageCode) ? "rtl" : "ltr";
}

/**
 * Flex yönünü ayarla (RTL için tersi)
 */
export function getFlexDirection(languageCode: string, defaultDirection: "row" | "column" = "row"): "row" | "row-reverse" | "column" | "column-reverse" {
  if (defaultDirection === "row" && isRTLLanguage(languageCode)) {
    return "row-reverse";
  }
  if (defaultDirection === "column" && isRTLLanguage(languageCode)) {
    return "column-reverse";
  }
  return defaultDirection;
}

/**
 * Margin/Padding yönünü ayarla (RTL için tersi)
 */
export function getMarginStart(languageCode: string, value: number): { marginLeft?: number; marginRight?: number } {
  if (isRTLLanguage(languageCode)) {
    return { marginRight: value };
  }
  return { marginLeft: value };
}

export function getMarginEnd(languageCode: string, value: number): { marginLeft?: number; marginRight?: number } {
  if (isRTLLanguage(languageCode)) {
    return { marginLeft: value };
  }
  return { marginRight: value };
}

export function getPaddingStart(languageCode: string, value: number): { paddingLeft?: number; paddingRight?: number } {
  if (isRTLLanguage(languageCode)) {
    return { paddingRight: value };
  }
  return { paddingLeft: value };
}

export function getPaddingEnd(languageCode: string, value: number): { paddingLeft?: number; paddingRight?: number } {
  if (isRTLLanguage(languageCode)) {
    return { paddingLeft: value };
  }
  return { paddingRight: value };
}

/**
 * Text align'ı ayarla (RTL için tersi)
 */
export function getTextAlign(languageCode: string, defaultAlign: "left" | "right" | "center" = "left"): "left" | "right" | "center" {
  if (isRTLLanguage(languageCode)) {
    if (defaultAlign === "left") return "right";
    if (defaultAlign === "right") return "left";
  }
  return defaultAlign;
}

/**
 * Transform scaleX'i ayarla (RTL için tersi)
 */
export function getScaleX(languageCode: string): number {
  return isRTLLanguage(languageCode) ? -1 : 1;
}

/**
 * RTL için Tailwind class'larını ayarla
 */
export function getRTLClasses(languageCode: string, baseClass: string): string {
  if (!isRTLLanguage(languageCode)) {
    return baseClass;
  }

  // RTL için class'ları ters çevir
  const rtlMappings: Record<string, string> = {
    "flex-row": "flex-row-reverse",
    "ml-": "mr-",
    "mr-": "ml-",
    "pl-": "pr-",
    "pr-": "pl-",
    "text-left": "text-right",
    "text-right": "text-left",
  };

  let rtlClass = baseClass;
  Object.entries(rtlMappings).forEach(([key, value]) => {
    rtlClass = rtlClass.replace(new RegExp(key, "g"), value);
  });

  return rtlClass;
}

/**
 * RTL için transform ayarı
 */
export function getRTLTransform(languageCode: string): { transform?: Array<{ scaleX: number }> } {
  if (isRTLLanguage(languageCode)) {
    return { transform: [{ scaleX: -1 }] };
  }
  return {};
}

/**
 * Sayı formatını RTL için ayarla (Arapça rakamlar)
 */
export function formatNumberForRTL(number: number, languageCode: string): string {
  if (languageCode === "ar") {
    // Arapça rakamları (٠١٢٣٤٥٦٧٨٩)
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(number)
      .split("")
      .map((digit) => {
        const num = parseInt(digit, 10);
        return isNaN(num) ? digit : arabicNumbers[num];
      })
      .join("");
  }
  return String(number);
}

/**
 * Para birimini RTL için formatla
 */
export function formatCurrencyForRTL(amount: string, currencySymbol: string, languageCode: string): string {
  if (isRTLLanguage(languageCode)) {
    // RTL'de para birimi sağda olur
    return `${amount} ${currencySymbol}`;
  }
  return `${currencySymbol}${amount}`;
}

/**
 * Tarih formatını RTL için ayarla
 */
export function formatDateForRTL(date: Date, languageCode: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (languageCode === "ar") {
    // Arapça tarih formatı
    return new Intl.DateTimeFormat("ar-SA", options).format(date);
  }

  return new Intl.DateTimeFormat(languageCode, options).format(date);
}

/**
 * RTL için alignment ayarı (Flex)
 */
export function getAlignItems(languageCode: string, defaultAlign: "flex-start" | "flex-end" | "center" = "flex-start"): "flex-start" | "flex-end" | "center" {
  if (isRTLLanguage(languageCode)) {
    if (defaultAlign === "flex-start") return "flex-end";
    if (defaultAlign === "flex-end") return "flex-start";
  }
  return defaultAlign;
}

/**
 * RTL için justify-content ayarı (Flex)
 */
export function getJustifyContent(languageCode: string, defaultJustify: "flex-start" | "flex-end" | "center" = "flex-start"): "flex-start" | "flex-end" | "center" {
  if (isRTLLanguage(languageCode)) {
    if (defaultJustify === "flex-start") return "flex-end";
    if (defaultJustify === "flex-end") return "flex-start";
  }
  return defaultJustify;
}

/**
 * RTL için position ayarı (absolute)
 */
export function getAbsolutePosition(languageCode: string, position: "left" | "right" = "left", value: number): { left?: number; right?: number } {
  if (isRTLLanguage(languageCode)) {
    if (position === "left") return { right: value };
    if (position === "right") return { left: value };
  }
  return position === "left" ? { left: value } : { right: value };
}

/**
 * RTL desteği için context hook'u
 */
export interface RTLContextType {
  isRTL: boolean;
  languageCode: string;
  direction: "ltr" | "rtl";
}

/**
 * RTL için style helper
 */
export const rtlStyle = (languageCode: string) => ({
  isRTL: isRTLLanguage(languageCode),
  direction: getTextDirection(languageCode),
  flexDirection: (dir: "row" | "column") => getFlexDirection(languageCode, dir),
  marginStart: (val: number) => getMarginStart(languageCode, val),
  marginEnd: (val: number) => getMarginEnd(languageCode, val),
  paddingStart: (val: number) => getPaddingStart(languageCode, val),
  paddingEnd: (val: number) => getPaddingEnd(languageCode, val),
  textAlign: (align: "left" | "right" | "center") => getTextAlign(languageCode, align),
  formatNumber: (num: number) => formatNumberForRTL(num, languageCode),
  formatCurrency: (amount: string, symbol: string) => formatCurrencyForRTL(amount, symbol, languageCode),
  formatDate: (date: Date) => formatDateForRTL(date, languageCode),
});

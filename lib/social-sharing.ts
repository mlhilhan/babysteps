import { Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Social Sharing Service
 * Handles achievement sharing, certificate generation, and social media integration
 */

interface AchievementShareData {
  achievementName: string;
  achievementIcon: string;
  achievementDescription: string;
  childName: string;
  unlockedDate: Date;
  level: number;
  totalXP: number;
}

interface ShareStatistics {
  totalShares: number;
  instagramShares: number;
  whatsappShares: number;
  emailShares: number;
  lastSharedDate: Date;
}

/**
 * Generate achievement certificate as text
 */
export function generateAchievementCertificate(data: AchievementShareData): string {
  const dateStr = data.unlockedDate.toLocaleDateString("tr-TR");

  return `
╔════════════════════════════════════════════════════════════╗
║                   🎓 BAŞARI SERTİFİKASI 🎓                ║
╚════════════════════════════════════════════════════════════╝

${data.achievementIcon} ${data.achievementName.toUpperCase()}

Bu sertifika, ${data.childName}'nin aşağıdaki başarıyı elde ettiğini
belgeler:

"${data.achievementDescription}"

Açılış Tarihi: ${dateStr}
Seviye: ${data.level}
Toplam XP: ${data.totalXP}

BabySteps Uygulaması tarafından onaylanmıştır.

═══════════════════════════════════════════════════════════════
Başarılar yolculuğunuzda size eşlik etmekten gurur duyuyoruz! 🌟
═══════════════════════════════════════════════════════════════
  `;
}

/**
 * Generate achievement share message
 */
export function generateShareMessage(data: AchievementShareData, platform: "instagram" | "whatsapp" | "email"): string {
  const dateStr = data.unlockedDate.toLocaleDateString("tr-TR");

  const baseMessage = `🎉 ${data.achievementIcon} ${data.childName} yeni bir başarı açtı!\n\n"${data.achievementName}"\n\n${data.achievementDescription}\n\nSeviye: ${data.level} | XP: ${data.totalXP}\n\n#BabySteps #EbeveynlikYolculuğu #ÇocukGelişimi`;

  if (platform === "instagram") {
    return `${baseMessage}\n\n📱 BabySteps ile çocuğunuzun gelişimini takip edin!`;
  } else if (platform === "whatsapp") {
    return `${baseMessage}\n\n💚 BabySteps ile çocuğunuzun gelişimini takip edin!`;
  } else {
    // Email
    return `Konu: ${data.achievementName} - ${data.childName}\n\n${baseMessage}`;
  }
}

/**
 * Share achievement to social media
 */
export async function shareAchievementToSocial(
  data: AchievementShareData,
  platform: "instagram" | "whatsapp" | "email" | "generic"
): Promise<boolean> {
  try {
    const message = generateShareMessage(data, platform as any);

    if (platform === "generic") {
      // Use native share sheet
      await Share.share({
        message,
        title: `${data.achievementName} - ${data.childName}`,
      });
    } else if (platform === "instagram") {
      // Instagram share (via generic share)
      await Share.share({
        message: `${message}\n\nInstagram'da paylaş: instagram.com`,
        title: data.achievementName,
      });
    } else if (platform === "whatsapp") {
      // WhatsApp share
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;

      // Try to open WhatsApp
      try {
        // For web/simulator, use generic share
        await Share.share({
          message,
          title: data.achievementName,
        });
      } catch {
        // Fallback to generic share
        await Share.share({
          message,
          title: data.achievementName,
        });
      }
    } else if (platform === "email") {
      // Email share
      const subject = `${data.achievementName} - ${data.childName}`;
      const body = generateShareMessage(data, "email");

      // Try to open email client
      try {
        await Share.share({
          message: body,
          title: subject,
        });
      } catch {
        // Fallback
        console.log("Email share not available");
      }
    }

    // Update share statistics
    await updateShareStatistics(platform);
    return true;
  } catch (error) {
    console.error("Error sharing achievement:", error);
    return false;
  }
}

/**
 * Update share statistics
 */
async function updateShareStatistics(platform: string): Promise<void> {
  try {
    const stats = await getShareStatistics();

    stats.totalShares++;
    stats.lastSharedDate = new Date();

    if (platform === "instagram") {
      stats.instagramShares++;
    } else if (platform === "whatsapp") {
      stats.whatsappShares++;
    } else if (platform === "email") {
      stats.emailShares++;
    }

    await AsyncStorage.setItem("share_statistics", JSON.stringify(stats));
  } catch (error) {
    console.error("Error updating share statistics:", error);
  }
}

/**
 * Get share statistics
 */
export async function getShareStatistics(): Promise<ShareStatistics> {
  try {
    const stats = await AsyncStorage.getItem("share_statistics");
    if (!stats) {
      return {
        totalShares: 0,
        instagramShares: 0,
        whatsappShares: 0,
        emailShares: 0,
        lastSharedDate: new Date(),
      };
    }
    return JSON.parse(stats);
  } catch (error) {
    console.error("Error getting share statistics:", error);
    return {
      totalShares: 0,
      instagramShares: 0,
      whatsappShares: 0,
      emailShares: 0,
      lastSharedDate: new Date(),
    };
  }
}

/**
 * Generate certificate as image (placeholder - would need image generation service)
 */
export async function generateCertificateImage(data: AchievementShareData): Promise<string> {
  // This would integrate with image generation service
  // For now, return a placeholder
  const certificate = generateAchievementCertificate(data);
  return certificate;
}

/**
 * Share certificate
 */
export async function shareCertificate(data: AchievementShareData, platform: "instagram" | "whatsapp" | "email"): Promise<boolean> {
  try {
    const certificate = await generateCertificateImage(data);

    if (platform === "whatsapp") {
      const encodedMessage = encodeURIComponent(certificate);
      // Would open WhatsApp with the certificate
      console.log("Sharing certificate to WhatsApp");
    } else if (platform === "email") {
      // Would open email with certificate attachment
      console.log("Sharing certificate via email");
    } else if (platform === "instagram") {
      // Would share to Instagram
      console.log("Sharing certificate to Instagram");
    }

    await updateShareStatistics(platform);
    return true;
  } catch (error) {
    console.error("Error sharing certificate:", error);
    return false;
  }
}

/**
 * Get share history
 */
export async function getShareHistory(): Promise<AchievementShareData[]> {
  try {
    const history = await AsyncStorage.getItem("share_history");
    if (!history) {
      return [];
    }
    return JSON.parse(history);
  } catch (error) {
    console.error("Error getting share history:", error);
    return [];
  }
}

/**
 * Add to share history
 */
export async function addToShareHistory(data: AchievementShareData): Promise<void> {
  try {
    const history = await getShareHistory();
    history.push(data);

    // Keep only last 50 shares
    if (history.length > 50) {
      history.shift();
    }

    await AsyncStorage.setItem("share_history", JSON.stringify(history));
  } catch (error) {
    console.error("Error adding to share history:", error);
  }
}

/**
 * Generate social media hashtags
 */
export function generateHashtags(category: string): string[] {
  const commonHashtags = ["#BabySteps", "#EbeveynlikYolculuğu", "#ÇocukGelişimi", "#Ebeveynlik"];

  const categoryHashtags: Record<string, string[]> = {
    milestone: ["#İlkAdımlar", "#Büyüme", "#MilaşTaşı"],
    health: ["#Sağlık", "#AşıTakvimi", "#Beslenme"],
    consistency: ["#Çizgi", "#Motivasyon", "#Başarı"],
    social: ["#Topluluk", "#Paylaşım", "#Aile"],
    special: ["#Başarı", "#Rozet", "#Ödül"],
  };

  return [...commonHashtags, ...(categoryHashtags[category] || [])];
}

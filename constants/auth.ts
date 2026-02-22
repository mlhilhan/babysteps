import * as ReactNative from "react-native";

const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
};

export const API_BASE_URL = env.apiBaseUrl;

/**
 * Get the API base URL (e.g. Railway backend or localhost).
 */
export function getApiBaseUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/$/, "");
  }
  if (
    ReactNative.Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location
  ) {
    const { protocol, hostname } = window.location;
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
  }
  return "";
}

export const SESSION_TOKEN_KEY = "app_session_token";
export const USER_INFO_KEY = "app_user_info";
/** İlk açılışta onboarding gösterildi mi (AsyncStorage) */
export const ONBOARDING_SEEN_KEY = "onboarding_seen";

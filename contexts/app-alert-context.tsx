"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

export type AppAlertButtonStyle = "default" | "cancel" | "destructive";

export type AppAlertButton = {
  text: string;
  onPress?: () => void;
  style?: AppAlertButtonStyle;
};

export type AppAlertOptions = {
  title?: string;
  message: string;
  buttons?: AppAlertButton[];
};

const defaultButtons: AppAlertButton[] = [{ text: "Tamam", style: "default" }];

const AppAlertContext = createContext<{
  showAlert: (options: AppAlertOptions) => void;
} | null>(null);

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AppAlertOptions | null>(null);
  const colors = useColors();

  const showAlert = useCallback((opts: AppAlertOptions) => {
    setOptions({
      ...opts,
      buttons: opts.buttons?.length ? opts.buttons : defaultButtons,
    });
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setOptions(null);
  }, []);

  const handlePress = useCallback(
    (button: AppAlertButton) => {
      button.onPress?.();
      hide();
    },
    [hide]
  );

  return (
    <AppAlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          const cancelBtn = options?.buttons?.find((b) => b.style === "cancel");
          if (cancelBtn) {
            handlePress(cancelBtn);
          } else {
            hide();
          }
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          onPress={hide}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: "100%", maxWidth: 340 }}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.background,
                borderRadius: 14,
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {options?.title ? (
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {options.title}
                </Text>
              ) : null}
              <Text
                style={{
                  fontSize: 15,
                  color: colors.muted ?? colors.foreground,
                  lineHeight: 22,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                {options?.message}
              </Text>
              <View style={{ flexDirection: "column", gap: 8 }}>
                {(options?.buttons ?? defaultButtons).map((btn, i) => {
                  const isDestructive = btn.style === "destructive";
                  const isCancel = btn.style === "cancel";
                  const buttonColor = isDestructive
                    ? "error" in colors ? (colors as { error: string }).error : "#EF4444"
                    : isCancel
                      ? colors.muted ?? colors.foreground
                      : colors.primary;
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      onPress={() => handlePress(btn)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                        backgroundColor: isCancel ? undefined : `${buttonColor}15`,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: isCancel ? "500" : "600",
                          color: buttonColor,
                        }}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const ctx = useContext(AppAlertContext);
  if (!ctx) {
    throw new Error("useAppAlert must be used within AppAlertProvider");
  }
  return ctx;
}

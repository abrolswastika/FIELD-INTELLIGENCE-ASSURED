import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  lightTheme,
  darkTheme,
  AppTheme,
} from "./theme";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "@srtk_theme_mode";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    loadThemeMode();
  }, []);

  async function loadThemeMode() {
    try {
      const savedMode = await AsyncStorage.getItem(
        THEME_STORAGE_KEY
      );

      if (
        savedMode === "light" ||
        savedMode === "dark" ||
        savedMode === "system"
      ) {
        setModeState(savedMode);
      }
    } catch (error) {
      console.log("Failed to load theme:", error);
    }
  }

  async function setMode(newMode: ThemeMode) {
    setModeState(newMode);

    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        newMode
      );
    } catch (error) {
      console.log("Failed to save theme:", error);
    }
  }

  const theme = useMemo<AppTheme>(() => {
    if (mode === "dark") {
      return darkTheme;
    }

    if (mode === "light") {
      return lightTheme;
    }

    return systemScheme === "dark"
      ? darkTheme
      : lightTheme;
  }, [mode, systemScheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSelection,
  getGroup,
  PRESETS,
  totalPrice,
  type Selection,
} from "@/lib/configurator";

interface BuildContextValue {
  selection: Selection;
  total: number;
  /** Toggle an option. Single-choice groups replace; multi-select groups add/remove. */
  toggleOption: (groupId: string, optionId: string) => void;
  isSelected: (groupId: string, optionId: string) => boolean;
  applyPreset: (presetId: string) => void;
  activePreset: string | null;
  reset: () => void;
}

const BuildContext = createContext<BuildContextValue | null>(null);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const toggleOption = useCallback((groupId: string, optionId: string) => {
    const group = getGroup(groupId);
    if (!group) return;
    setActivePreset(null);
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      let next: string[];
      if (group.type === "single") {
        next = [optionId];
      } else {
        next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      }
      return { ...prev, [groupId]: next };
    });
  }, []);

  const isSelected = useCallback(
    (groupId: string, optionId: string) =>
      (selection[groupId] ?? []).includes(optionId),
    [selection]
  );

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    // Clone so preset objects are never mutated by later toggles.
    const cloned: Selection = Object.fromEntries(
      Object.entries(preset.selection).map(([k, v]) => [k, [...v]])
    );
    setSelection(cloned);
    setActivePreset(presetId);
  }, []);

  const reset = useCallback(() => {
    setSelection(defaultSelection());
    setActivePreset(null);
  }, []);

  const total = useMemo(() => totalPrice(selection), [selection]);

  const value = useMemo(
    () => ({ selection, total, toggleOption, isSelected, applyPreset, activePreset, reset }),
    [selection, total, toggleOption, isSelected, applyPreset, activePreset, reset]
  );

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild(): BuildContextValue {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("useBuild must be used within a BuildProvider");
  return ctx;
}

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
  defaultTiers,
  getGroup,
  getOption,
  PRESETS,
  totalPrice,
  type Selection,
  type TierSelection,
} from "@/lib/configurator";

interface BuildContextValue {
  selection: Selection;
  tiers: TierSelection;
  engraving: string;
  total: number;
  toggleOption: (groupId: string, optionId: string) => void;
  isSelected: (groupId: string, optionId: string) => boolean;
  setTier: (optionId: string, tierId: string) => void;
  tierFor: (optionId: string) => string | undefined;
  setEngraving: (text: string) => void;
  applyPreset: (presetId: string) => void;
  activePreset: string | null;
  reset: () => void;
}

const BuildContext = createContext<BuildContextValue | null>(null);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(defaultSelection);
  const [tiers, setTiers] = useState<TierSelection>(defaultTiers);
  const [engraving, setEngravingState] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const toggleOption = useCallback((groupId: string, optionId: string) => {
    const group = getGroup(groupId);
    if (!group) return;
    setActivePreset(null);
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      const next =
        group.type === "single"
          ? [optionId]
          : current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  }, []);

  const isSelected = useCallback(
    (groupId: string, optionId: string) => (selection[groupId] ?? []).includes(optionId),
    [selection]
  );

  const setTier = useCallback((optionId: string, tierId: string) => {
    setActivePreset(null);
    setTiers((prev) => ({ ...prev, [optionId]: tierId }));
  }, []);

  const tierFor = useCallback(
    (optionId: string) => tiers[optionId] ?? getOption(optionId)?.tiers?.[0]?.id,
    [tiers]
  );

  const setEngraving = useCallback((text: string) => {
    setEngravingState(text);
    // Typing a name implies the engraving add-on is on.
    if (text.trim()) {
      setSelection((prev) => {
        const cur = prev.personalization ?? [];
        return cur.includes("personal-engrave")
          ? prev
          : { ...prev, personalization: [...cur, "personal-engrave"] };
      });
    }
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelection(
      Object.fromEntries(Object.entries(preset.selection).map(([k, v]) => [k, [...v]]))
    );
    setTiers({ ...defaultTiers(), ...(preset.tiers ?? {}) });
    setEngravingState(preset.engraving ?? "");
    setActivePreset(presetId);
  }, []);

  const reset = useCallback(() => {
    setSelection(defaultSelection());
    setTiers(defaultTiers());
    setEngravingState("");
    setActivePreset(null);
  }, []);

  const total = useMemo(() => totalPrice(selection, tiers), [selection, tiers]);

  const value = useMemo(
    () => ({
      selection,
      tiers,
      engraving,
      total,
      toggleOption,
      isSelected,
      setTier,
      tierFor,
      setEngraving,
      applyPreset,
      activePreset,
      reset,
    }),
    [selection, tiers, engraving, total, toggleOption, isSelected, setTier, tierFor, setEngraving, applyPreset, activePreset, reset]
  );

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild(): BuildContextValue {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("useBuild must be used within a BuildProvider");
  return ctx;
}

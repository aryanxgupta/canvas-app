import { create } from "zustand";

interface BrandKitState {
  // REQUIRED
  brandName: string;
  logoFile: File | null;
  productImages: File[];
  backgroundImages: File[];
  colorsJson: Record<string, string>;
  rulesText: string;
  prompt: string;
  format: string;
  logoUrl: string;
  productImageUrls: string[];
  backgroundImageUrls: string[];
  kitId: string;

  // OPTIONAL FIELDS (used for personalization & AI hints)
  campaignName: string;
  brandCategory: string;
  brandTagline: string;
  tone: string;
  style: string;
  channels: string[];

  // SETTERS
  setBrandName: (v: string) => void;
  setLogoFile: (f: File | null) => void;
  addProductImages: (files: File[]) => void;
  addBackgroundImages: (files: File[]) => void;
  setColorsJson: (obj: Record<string, string>) => void;
  setRulesText: (v: string) => void;
  setPrompt: (v: string) => void;
  setFormat: (v: string) => void;

  setCampaignName: (v: string) => void;
  setBrandCategory: (v: string) => void;
  setBrandTagline: (v: string) => void;
  setTone: (v: string) => void;
  setStyle: (v: string) => void;
  setChannels: (v: string[]) => void;

  setLogoUrl: (v: string) => void;
  setProductImageUrls: (v: string[]) => void;
  setBackgroundImageUrls: (v: string[]) => void;
  setKitId: (v: string) => void;
}

export const useBrandKitStore = create<BrandKitState>((set) => ({
  // REQUIRED
  brandName: "",
  logoFile: null,
  productImages: [],
  backgroundImages: [],
  colorsJson: {},  // object, not string
  rulesText: "",
  prompt: "",
  format: "square",
  logoUrl: "",
  productImageUrls: [],
  backgroundImageUrls: [],
  kitId: "",

  // OPTIONAL
  campaignName: "",
  brandCategory: "",
  brandTagline: "",
  tone: "",
  style: "",
  channels: [],

  // SETTERS
  setBrandName: (v) => set({ brandName: v }),
  setLogoFile: (f) => set({ logoFile: f }),

  addProductImages: (files) =>
    set((state) => ({
      productImages: [...state.productImages, ...files],
    })),

  addBackgroundImages: (files) =>
    set((state) => ({
      backgroundImages: [...state.backgroundImages, ...files],
    })),

  setColorsJson: (obj) => set({ colorsJson: obj }),
  setRulesText: (v) => set({ rulesText: v }),
  setPrompt: (v) => set({ prompt: v }),
  setFormat: (v) => set({ format: v }),

  setCampaignName: (v) => set({ campaignName: v }),
  setBrandCategory: (v) => set({ brandCategory: v }),
  setBrandTagline: (v) => set({ brandTagline: v }),
  setTone: (v) => set({ tone: v }),
  setStyle: (v) => set({ style: v }),
  setChannels: (v) => set({ channels: v }),

  setLogoUrl: (v) => set({ logoUrl: v }),
  setProductImageUrls: (v) => set({ productImageUrls: v }),
  setBackgroundImageUrls: (v) => set({ backgroundImageUrls: v }),
  setKitId: (v) => set({ kitId: v }),
}));

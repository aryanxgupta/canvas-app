import { create } from "zustand";

interface BrandKitState {
  // REQUIRED
  brandName: string;
  logoFile: File | null;
  productImages: File[];
  colorsJson: Record<string, string>;
  rulesText: string;
  prompt: string;
  format: string;
  logoUrl: string;
  productImageUrls: string[];
  kitId: string;

  // OPTIONAL FIELDS
  campaignName: string;
  brandCategory: string;
  brandTagline: string;
  tone: string;
  style: string;

  // SETTERS
  setBrandName: (v: string) => void;
  setLogoFile: (f: File | null) => void;
  addProductImages: (files: File[]) => void;
  setColorsJson: (obj: Record<string, string>) => void;
  setRulesText: (v: string) => void;
  setPrompt: (v: string) => void;
  setFormat: (v: string) => void;

  setCampaignName: (v: string) => void;
  setBrandCategory: (v: string) => void;
  setBrandTagline: (v: string) => void;
  setTone: (v: string) => void;
  setStyle: (v: string) => void;

  setLogoUrl: (v: string) => void;
  setProductImageUrls: (v: string[]) => void;
  setKitId: (v: string) => void;
}

export const useBrandKitStore = create<BrandKitState>((set) => ({
  // REQUIRED
  brandName: "",
  logoFile: null,
  productImages: [],
  colorsJson: { primary: "#8b5cf6", secondary: "#ffffff" }, // Set defaults here
  rulesText: "",
  prompt: "",
  format: "square",
  logoUrl: "",
  productImageUrls: [],
  kitId: "",

  // OPTIONAL
  campaignName: "",
  brandCategory: "",
  brandTagline: "",
  tone: "",
  style: "",

  // SETTERS
  setBrandName: (v) => set({ brandName: v }),
  setLogoFile: (f) => set({ logoFile: f }),

  addProductImages: (files) =>
    set((state) => ({
      productImages: [...state.productImages, ...files],
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

  setLogoUrl: (v) => set({ logoUrl: v }),
  setProductImageUrls: (v) => set({ productImageUrls: v }),
  setKitId: (v) => set({ kitId: v }),
}));
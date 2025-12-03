import { create } from "zustand";

// --- TYPES ---
export type CreativeMode = "standard" | "lep";
export type ValueTileType = "none" | "new" | "white" | "clubcard";
export type TescoTag =
  | "none"
  | "selectedStores"
  | "onlyAtTesco"
  | "availableAtTesco";
export type Format = "square" | "story" | "landscape";

interface BrandKitState {
  // -----------------------------
  // BASE FIELDS
  // -----------------------------
  brandName: string;
  logoFile: File | null;
  productImages: File[];
  colorsJson: Record<string, string>;
  rulesText: string;

  prompt: string;
  format: Format;

  logoUrl: string;
  productImageUrls: string[];
  kitId: string;

  // Optional branding (still allowed)
  campaignName: string;
  brandCategory: string;
  tone: string;
  style: string;

  // -----------------------------
  // MANDATORY COPY
  // -----------------------------
  headline: string;
  subhead: string;

  // -----------------------------
  // CREATIVE / TESCORETAIL RULES
  // -----------------------------
  creativeMode: CreativeMode;

  isLowEverydayPrice: boolean; // NEW — LEP toggle

  valueTileType: ValueTileType;
  whitePrice: string;

  clubcardOfferPrice: string;
  clubcardRegularPrice: string;
  clubcardEndDate: string; // DD/MM

  tescoTag: TescoTag;

  // -----------------------------
  // COMPLIANCE FLAGS
  // -----------------------------
  isAlcoholPromotion: boolean;
  isExclusiveProduct: boolean;
  hasPhotographyOfPeople: boolean;

  // -----------------------------
  // SETTERS
  // -----------------------------
  setBrandName: (v: string) => void;
  setLogoFile: (f: File | null) => void;
  addProductImages: (files: File[]) => void;
  setColorsJson: (obj: Record<string, string>) => void;

  setRulesText: (v: string) => void;

  setPrompt: (v: string) => void;
  setFormat: (v: Format) => void;

  setCampaignName: (v: string) => void;
  setBrandCategory: (v: string) => void;

  setTone: (v: string) => void;
  setStyle: (v: string) => void;

  setLogoUrl: (v: string) => void;
  setProductImageUrls: (v: string[]) => void;
  setKitId: (v: string) => void;

  // New setters — compliant
  setHeadline: (v: string) => void;
  setSubhead: (v: string) => void;

  setCreativeMode: (m: CreativeMode) => void;

  setIsLowEverydayPrice: (v: boolean) => void;

  setValueTileType: (v: ValueTileType) => void;
  setWhitePrice: (v: string) => void;

  setClubcardOfferPrice: (v: string) => void;
  setClubcardRegularPrice: (v: string) => void;
  setClubcardEndDate: (v: string) => void;

  setTescoTag: (v: TescoTag) => void;

  setIsAlcoholPromotion: (v: boolean) => void;
  setIsExclusiveProduct: (v: boolean) => void;
  setHasPhotographyOfPeople: (v: boolean) => void;
}

export const useBrandKitStore = create<BrandKitState>((set) => ({
  // -----------------------------
  // INITIAL STATE
  // -----------------------------

  brandName: "",
  logoFile: null,
  productImages: [],
  colorsJson: { primary: "#8b5cf6", secondary: "#ffffff" },

  rulesText: "",

  prompt: "",
  format: "square",

  logoUrl: "",
  productImageUrls: [],
  kitId: "",

  campaignName: "",
  brandCategory: "",
  tone: "",
  style: "",

  headline: "",
  subhead: "",

  creativeMode: "standard",
  isLowEverydayPrice: false,

  valueTileType: "none",
  whitePrice: "",

  clubcardOfferPrice: "",
  clubcardRegularPrice: "",
  clubcardEndDate: "",

  tescoTag: "none",

  isAlcoholPromotion: false,
  isExclusiveProduct: false,
  hasPhotographyOfPeople: false,

  // -----------------------------
  // SETTERS
  // -----------------------------

  setBrandName: (v) => set({ brandName: v }),
  setLogoFile: (f) => set({ logoFile: f }),

  addProductImages: (files) =>
    set((state) => ({
      productImages: [...state.productImages, ...files].slice(0, 3),
    })),

  setColorsJson: (obj) => set({ colorsJson: obj }),

  setRulesText: (v) => set({ rulesText: v }),

  setPrompt: (v) => set({ prompt: v }),
  setFormat: (v: Format) => set({ format: v }),

  setCampaignName: (v) => set({ campaignName: v }),
  setBrandCategory: (v) => set({ brandCategory: v }),

  setTone: (v) => set({ tone: v }),
  setStyle: (v) => set({ style: v }),

  setLogoUrl: (v) => set({ logoUrl: v }),
  setProductImageUrls: (v) => set({ productImageUrls: v }),
  setKitId: (v) => set({ kitId: v }),

  setHeadline: (v) => set({ headline: v }),
  setSubhead: (v) => set({ subhead: v }),

  setCreativeMode: (m) => set({ creativeMode: m }),
  setIsLowEverydayPrice: (v) => set({ isLowEverydayPrice: v }),

  setValueTileType: (v) => set({ valueTileType: v }),
  setWhitePrice: (v) => set({ whitePrice: v }),

  setClubcardOfferPrice: (v) => set({ clubcardOfferPrice: v }),
  setClubcardRegularPrice: (v) => set({ clubcardRegularPrice: v }),
  setClubcardEndDate: (v) => set({ clubcardEndDate: v }),

  setTescoTag: (v) => set({ tescoTag: v }),

  setIsAlcoholPromotion: (v) => set({ isAlcoholPromotion: v }),
  setIsExclusiveProduct: (v) => set({ isExclusiveProduct: v }),
  setHasPhotographyOfPeople: (v) => set({ hasPhotographyOfPeople: v }),
}));

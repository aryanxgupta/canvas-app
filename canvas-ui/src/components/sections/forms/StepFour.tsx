import { ArrowRight, Loader2 } from "lucide-react";
import { useBrandKitStore } from "../../../store/useBrandKitStore";
import { useState } from "react";
import { useEditorStore, type AIResponse } from "@/store/editorStore";
import { useLocation } from "wouter";
import { body } from "motion/react-client";
import { validateTescoCopy } from "@/lib/tescoCopyValidator";


interface StepFourProps {
  onBack: () => void;
}

export default function StepFour({ onBack }: StepFourProps) {
  const {
    brandName,
    brandCategory,

    // mandatory copy
    headline,
    subhead,

    // compliance + rules
    creativeMode,
    valueTileType,
    whitePrice,
    clubcardOfferPrice,
    clubcardRegularPrice,
    clubcardEndDate,
    isAlcoholPromotion,
    hasPhotographyOfPeople,
    isExclusiveProduct,
    tescoTag,

    // assets
    logoUrl,
    logoFile,
    productImages,

    // legacy fields (kept only for compatibility)
    prompt,
    format,
    tone,
    style,
    colorsJson,

    setLogoUrl,
    setProductImageUrls,
    setKitId,
  } = useBrandKitStore();

  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAiDesign } = useEditorStore();

  // -------------------------------
  //  FINAL TESCO TAG CALCULATION
  // -------------------------------
  const deriveFinalTagString = (): string => {
    // Rule 1 — LEP always uses this tag
    if (creativeMode === "lep") {
      return "Selected stores. While stocks last.";
    }

    // Rule 2 — Clubcard forces special tag format
    if (valueTileType === "clubcard") {
      const date = clubcardEndDate || "DD/MM";
      return `Available in selected stores. Clubcard/app required. Ends ${date}`;
    }

    // Rule 3 — exclusive product
    if (isExclusiveProduct) {
      return "Only at Tesco";
    }

    // Rule 4 — user-selected tag
    switch (tescoTag) {
      case "onlyAtTesco":
        return "Only at Tesco";
      case "availableAtTesco":
        return "Available at Tesco";
      case "selectedStores":
        return "Selected stores. While stocks last.";
      default:
        return "Available at Tesco"; // fallback
    }
  };

  const finalTescoTag = deriveFinalTagString();

  // -------------------------------
  //  IMAGE UPLOAD HELPERS
  // -------------------------------
  async function uploadSingle(file: File, type: string) {
    const fd = new FormData();
    fd.append(`${type}_file`, file);

    const res = await fetch(`http://localhost:8080/upload-${type}`, {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    return json.data;
  }

  // -------------------------------
  //      GENERATE FUNCTION
  // -------------------------------
  async function generateCreative() {
    try {
      setLoading(true);
      setError("");
      const headlineError = validateTescoCopy(headline);
    const subheadError = validateTescoCopy(subhead);

    if (headlineError || subheadError) {
      setError(headlineError || subheadError!);
      setLoading(false);
      return;
    }

      // upload logo
      let currentLogoUrl = logoUrl;
      if (logoFile) {
        const r = await uploadSingle(logoFile, "logo");
        currentLogoUrl = r.url;
        setLogoUrl(currentLogoUrl);
      }

      // upload packshots (store enforces max 3)
      const productUrls: string[] = [];
      for (const f of productImages) {
        const p = await uploadSingle(f, "product");
        productUrls.push(p.url);
      }
      setProductImageUrls(productUrls);

      // -----------------------------------------
      //  STRICT COMPLIANCE PAYLOAD SENT TO GEMINI
      // -----------------------------------------
      const compliancePayload = {
        headline,
        subhead,
        creative_mode: creativeMode, // standard | lep

        value_tile: {
          type: valueTileType,
          white_price: valueTileType === "white" ? whitePrice : null,
          offer_price: valueTileType === "clubcard" ? clubcardOfferPrice : null,
          regular_price:
            valueTileType === "clubcard" ? clubcardRegularPrice : null,
          end_date: valueTileType === "clubcard" ? clubcardEndDate : null,
        },

        is_alcohol_promotion: isAlcoholPromotion,
        has_people: hasPhotographyOfPeople,
        is_exclusive_product: isExclusiveProduct,

        tesco_final_tag: finalTescoTag, // final computed tag
      };

      // -----------------------------------------
      //  LEGACY RULES TEXT (backend compatibility)
      // -----------------------------------------
      const rules = {
        // Legacy "prompt" must stay short — avoids hallucination
        prompt: `HEADLINE: ${headline}. SUBHEAD: ${subhead}. TAG: ${finalTescoTag}.`,

        // LEP overrides
        tone: creativeMode === "lep" ? "trade" : tone,
        style: creativeMode === "lep" ? "white-background" : style,

        tagline: subhead, // legacy fallback

        // structured data for AI
        compliance: compliancePayload,

        primary_color: colorsJson.primary,
        secondary_color: colorsJson.secondary,

      };

      // create brand kit
      const kitRes = await fetch("http://localhost:8080/create-brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName,
          colors_json: colorsJson,
          logo_url: currentLogoUrl,
          image_urls: productUrls,
          rules_text: JSON.stringify(rules),
        }),
      });

      const kitJson = await kitRes.json();
      if (!kitRes.ok) throw new Error(kitJson.message);

      const kitId = kitJson.data.brand_kit[0].id;
      setKitId(kitId);

      // generate creative
      const genRes = await fetch(
        `http://localhost:8080/brand-kit/${kitId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }, 
      );

      const genJson = await genRes.json();
      if (!genRes.ok) throw new Error(genJson.message);

      setAiDesign(genJson.data);
      setLocation("/canvas");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  

  // -------------------------------
  //         UI RENDER
  // -------------------------------
  return (
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      <h3 className="text-2xl font-bold-heading mb-8 shrink-0">
        Review & Generate
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 custom-scrollbar">
        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-200 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-sm text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">

            <p><strong className="text-white">Brand:</strong> {brandName}</p>
            <p><strong className="text-white">Category:</strong> {brandCategory}</p>

            <div className="sm:col-span-2 border-t border-white/10 my-2" />

            <p className="sm:col-span-2"><strong className="text-white">Headline:</strong> {headline}</p>
            <p className="sm:col-span-2"><strong className="text-white">Subhead:</strong> {subhead}</p>

            <div className="sm:col-span-2 border-t border-white/10 my-2" />

            <p><strong className="text-white">Format:</strong> {format}</p>
            <p><strong className="text-white">Mode:</strong> {creativeMode}</p>

            {creativeMode === "standard" && (
              <>
                <p><strong className="text-white">Tone:</strong> {tone}</p>
                <p><strong className="text-white">Style:</strong> {style}</p>
              </>
            )}

            <div className="sm:col-span-2 border-t border-white/10 my-2" />

            <p><strong className="text-white">Value Tile:</strong> {valueTileType}</p>
            <p><strong className="text-white">Tesco Tag:</strong> {finalTescoTag}</p>

            {valueTileType === "white" && (
              <p className="sm:col-span-2">
                <strong className="text-white">White Price:</strong> £{whitePrice}
              </p>
            )}

            {valueTileType === "clubcard" && (
              <p className="sm:col-span-2">
                <strong className="text-white">Clubcard:</strong> £{clubcardOfferPrice} (Reg £{clubcardRegularPrice}), Ends {clubcardEndDate}
              </p>
            )}

            <div className="sm:col-span-2 border-t border-white/10 my-2" />

            <p><strong className="text-white">Alcohol:</strong> {isAlcoholPromotion ? "Yes" : "No"}</p>
            <p><strong className="text-white">People:</strong> {hasPhotographyOfPeople ? "Yes" : "No"}</p>
            <p><strong className="text-white">Exclusive:</strong> {isExclusiveProduct ? "Yes" : "No"}</p>

            <div className="sm:col-span-2 border-t border-white/10 my-2" />

            <p className="sm:col-span-2">
              <strong className="text-white">Assets:</strong> {productImages.length} product(s), {logoFile ? "1 logo" : "0 logos"}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6 border-t border-white/10">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white"
        >
          ← Back
        </button>

        <button
          onClick={generateCreative}
          disabled={loading || !headline || !subhead}
          className="px-8 py-3 rounded-xl bg-violet-300 hover:bg-violet-400 text-black font-bold flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              Generate Creative <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

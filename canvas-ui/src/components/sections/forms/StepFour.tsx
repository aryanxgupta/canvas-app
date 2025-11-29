import { ArrowRight, Loader2 } from "lucide-react";
import { useBrandKitStore } from "../../../store/useBrandKitStore";
import { useState } from "react";
import { useEditorStore, type AIResponse } from "@/store/editorStore";
import { useLocation } from "wouter";

interface StepFourProps {
  onBack: () => void;
}

export default function StepFour({ onBack }: StepFourProps) {
  const {
    brandName,
    brandCategory,
    brandTagline,
    campaignName,
    logoUrl,
    productImageUrls,
    logoFile,
    productImages,
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

  async function generateCreative() {
    try {
      setLoading(true);
      setError("");

      // 1. Upload Logo
      let currentLogoUrl = logoUrl;
      if (logoFile) {
        const logo_res = await uploadSingle(logoFile, "logo");
        currentLogoUrl = logo_res.url;
        setLogoUrl(currentLogoUrl);
      }

      // 2. Upload Product Images
      const productUrls: string[] = [];
      for (const file of productImages) {
        const prod_url = await uploadSingle(file, "product");
        productUrls.push(prod_url.url);
      }
      setProductImageUrls(productUrls);

      const rules = {
        prompt: prompt,
        tone: tone,
        style: style,
        tagline: brandTagline,
      };

      // 3. Create Brand Kit
      const brandKitRes = await fetch("http://localhost:8080/create-brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName,
          colors_json: colorsJson,
          logo_url: currentLogoUrl,
          image_urls: [...productUrls],
          rules_text: JSON.stringify(rules),
        }),
      });

      const brandKitJson = await brandKitRes.json();
      if (!brandKitRes.ok) throw new Error(brandKitJson.message);
      const kitId = brandKitJson.data.brand_kit[0].id;
      setKitId(kitId);

      // 4. Generate Layout
      const layoutRes = await fetch(
        `http://localhost:8080/brand-kit/${kitId}/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const layoutJson = await layoutRes.json();
      if (!layoutRes.ok) throw new Error(layoutJson.message);

      const AiDesignObj: AIResponse = JSON.parse(layoutJson.data);
      setAiDesign(AiDesignObj);
      setLocation("/canvas");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      <h3 className="text-2xl font-bold-heading mb-8 shrink-0">
        Review & Generate
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 custom-scrollbar">
        {/* ERROR ALERT */}
        {error && (
          <div className="bg-red-600/30 border border-red-500 text-red-200 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SUMMARY CARD */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 text-sm text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <p><span className="font-semibold text-white">Brand:</span> {brandName}</p>
            <p><span className="font-semibold text-white">Category:</span> {brandCategory || "—"}</p>
            <p className="sm:col-span-2"><span className="font-semibold text-white">Tagline:</span> {brandTagline || "—"}</p>

            <div className="border-t border-white/10 my-2 sm:col-span-2"></div>

            <p><span className="font-semibold text-white">Campaign:</span> {campaignName || "—"}</p>
            <p><span className="font-semibold text-white">Format:</span> {format}</p>
            <p><span className="font-semibold text-white">Tone:</span> {tone || "—"}</p>
            <p><span className="font-semibold text-white">Style:</span> {style || "—"}</p>

            <div className="border-t border-white/10 my-2 sm:col-span-2"></div>

            <p className="sm:col-span-2 flex items-center gap-2">
              <span className="font-semibold text-white">Colors:</span>
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colorsJson.primary }}></span> {colorsJson.primary}
              <span className="text-gray-500">/</span>
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colorsJson.secondary }}></span> {colorsJson.secondary}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-white">Assets:</span> {productImages.length} Product(s), {logoFile ? 1 : 0} Logo(s)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 mt-auto shrink-0 border-t border-white/10">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={generateCreative}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-violet-300 text-black font-bold hover:bg-violet-400 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="animate-spin"><Loader2 /></span> Generating...
            </>
          ) : (
            <div className="flex items-center justify-start gap-4 font-sub-heading">
              Generate Creative
              <ArrowRight size={20} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
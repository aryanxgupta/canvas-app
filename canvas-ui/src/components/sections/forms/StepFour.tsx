import { useBrandKitStore } from "../../../store/useBrandKitStore";
import { useState } from "react";

interface StepFourProps {
  onBack: () => void;
}

export default function StepFour({ onBack }: StepFourProps) {
  const {
    // Brand info
    brandName,
    brandCategory,
    brandTagline,
    campaignName,

    // Assets
    logoFile,
    productImages,
    backgroundImages,

    // Preferences
    prompt,
    format,
    tone,
    style,
    channels,
    colorsJson,

    // Setters
    setLogoUrl,
    setProductImageUrls,
    setKitId,
  } = useBrandKitStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function uploadSingle(file: File, type: string) {
    const fd = new FormData();
    fd.append(type, file);

    const res = await fetch(`http://localhost:4000/upload/${type}`, {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    return json.data.url;
  }

  async function generateCreative() {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Upload Logo
      const logoUrl = await uploadSingle(logoFile!, "logo");
      setLogoUrl(logoUrl);

      // 2️⃣ Upload Product Images
      const productUrls: string[] = [];
      for (const file of productImages) {
        const url = await uploadSingle(file, "product");
        productUrls.push(url);
      }
      setProductImageUrls(productUrls);

      // 3️⃣ Upload Background Images
      const bgUrls: string[] = [];
      for (const bg of backgroundImages) {
        const url = await uploadSingle(bg, "background"); 
        bgUrls.push(url);
      }

      // 4️⃣ Create Brand Kit
      const brandKitRes = await fetch("http://localhost:4000/brandkits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brandName,
          category: brandCategory || null,
          tagline: brandTagline || null,
          colors_json: colorsJson,
          logo_url: logoUrl,
          images: [...productUrls, ...bgUrls],
        }),
      });

      const brandKitJson = await brandKitRes.json();
      if (!brandKitRes.ok) throw new Error(brandKitJson.message);

      const kitId = brandKitJson.data.brandkits[0].id;
      setKitId(kitId);

      // 5️⃣ Generate Layout (Gemini will use all fields)
      const layoutRes = await fetch(
        `http://localhost:4000/generate_layout/${kitId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            format,
            campaignName,
            tagline: brandTagline,
            category: brandCategory,
            tone,
            style,
            channels,
            colors: colorsJson,
            backgroundImages: bgUrls, 
          }),
        }
      );

      const layoutJson = await layoutRes.json();
      if (!layoutRes.ok) throw new Error(layoutJson.message);

      console.log("Generated Creative Result:", layoutJson);

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white space-y-10">

      <h3 className="text-2xl font-bold-heading">Review & Generate</h3>

      {error && (
        <div className="bg-red-600/30 border border-red-500 text-red-200 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="space-y-4 text-gray-300">
        <p><span className="font-semibold text-white">Brand:</span> {brandName}</p>
        <p><span className="font-semibold text-white">Category:</span> {brandCategory || "—"}</p>
        <p><span className="font-semibold text-white">Tagline:</span> {brandTagline || "—"}</p>
        <p><span className="font-semibold text-white">Campaign:</span> {campaignName || "—"}</p>
        <p><span className="font-semibold text-white">Tone:</span> {tone || "—"}</p>
        <p><span className="font-semibold text-white">Style:</span> {style || "—"}</p>
        <p><span className="font-semibold text-white">Format:</span> {format}</p>
        <p><span className="font-semibold text-white">Channels:</span> {channels.join(", ") || "—"}</p>
        <p><span className="font-semibold text-white">Colors:</span> 
          {colorsJson.primary} , {colorsJson.secondary}
        </p>
        <p><span className="font-semibold text-white">Backgrounds:</span> 
          {backgroundImages.length} selected
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="
            px-6 py-3 rounded-xl bg-white/10 border border-white/10 
            hover:bg-white/20 text-white transition disabled:opacity-40
          "
        >
          ← Back
        </button>

        <button
          onClick={generateCreative}
          disabled={loading}
          className="
            px-6 py-3 rounded-xl bg-violet-300 text-black font-bold
            hover:bg-violet-400 active:scale-95 transition 
            disabled:opacity-50
          "
        >
          {loading ? "Generating..." : "Generate Creative 🚀"}
        </button>
      </div>
    </div>
  );
}

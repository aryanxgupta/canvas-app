import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({ onNext, onBack }: StepTwoProps) {
  const {
    addProductImages,
    addBackgroundImages,
    productImages,
    backgroundImages,
    setCampaignName,
    setBrandTagline,
  } = useBrandKitStore();

  function handleProductUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addProductImages(Array.from(e.target.files));
  }

  function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addBackgroundImages(Array.from(e.target.files));
  }

  return (
    <div className="text-white space-y-12">

      <h3 className="text-3xl font-bold-heading">Campaign Setup</h3>

      {/* CAMPAIGN NAME */}
      <div className="space-y-2">
        <label className="text-sm font-sub-heading text-gray-300">
          Campaign Name (Optional)
        </label>
        <input
          type="text"
          onChange={(e) => setCampaignName(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl
            bg-[#111] border border-white/20
            text-white placeholder-white/40
            focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
            transition
          "
          placeholder="e.g., Winter Mega Sale"
        />
      </div>

      {/* TAGLINE */}
      <div className="space-y-2">
        <label className="text-sm font-sub-heading text-gray-300">
          Tagline (Optional)
        </label>
        <input
          type="text"
          onChange={(e) => setBrandTagline(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl
            bg-[#111] border border-white/20
            text-white placeholder-white/40
            focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
            transition
          "
          placeholder="e.g., Freshness Delivered"
        />
      </div>

      {/* PRODUCT IMAGES */}
      <div className="space-y-4">
        <label className="block text-lg text-gray-200 font-sub-heading">
          Product Images (Packshots)
        </label>

        <label
          className="
            bg-violet-300 text-black font-semibold
            px-5 py-3 rounded-xl cursor-pointer text-sm
            hover:bg-violet-400 transition
          "
        >
          Upload Product Images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleProductUpload}
            className="hidden"
          />
        </label>

        <div className="flex flex-wrap gap-4 mt-4">
          {productImages.map((img, i) => (
            <div
              key={i}
              className="
                w-28 h-28 rounded-xl
                bg-[#111] border border-white/10
                flex items-center justify-center
                text-xs text-gray-300
              "
            >
              {img.name}
            </div>
          ))}
        </div>
      </div>

      {/* BACKGROUND IMAGES */}
      <div className="space-y-4">
        <label className="block text-lg text-gray-200 font-sub-heading">
          Background Images (Optional)
        </label>

        <label
          className="
            bg-violet-300 text-black font-semibold
            px-5 py-3 rounded-xl cursor-pointer text-sm
            hover:bg-violet-400 transition
          "
        >
          Upload Backgrounds
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />
        </label>

        <div className="flex flex-wrap gap-4 mt-4">
          {backgroundImages.map((img, i) => (
            <div
              key={i}
              className="
                w-28 h-28 rounded-xl
                bg-[#111] border border-white/10
                flex items-center justify-center
                text-xs text-gray-300
              "
            >
              {img.name}
            </div>
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onBack}
          className="
            px-6 py-3 rounded-xl
            bg-white/10 border border-white/10
            text-white font-semibold
            hover:bg-white/20 active:scale-95
            transition
          "
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          className="
            px-6 py-3 rounded-xl
            bg-violet-300 text-black font-bold
            hover:bg-violet-400 active:scale-95
            transition
          "
        >
          Continue →
        </button>
      </div>

    </div>
  );
}

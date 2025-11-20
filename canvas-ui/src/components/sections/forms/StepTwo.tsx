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
    // ROOT: Flex column, constrained height
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      
      {/* HEADER: Fixed at top */}
      <h3 className="text-3xl font-bold-heading mb-8 shrink-0">
        Campaign Setup
      </h3>

      {/* BODY: Scrollable Area */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-10 custom-scrollbar">
        
        {/* INPUTS GROUP */}
        <div className="flex flex-col gap-6">
          {/* CAMPAIGN NAME */}
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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
        </div>

        {/* PRODUCT IMAGES */}
        <div className="flex flex-col gap-4">
          <label className="block text-lg text-gray-200 font-sub-heading">
            Product Images (Packshots)
          </label>

          <label
            className="
              self-start bg-violet-300 text-black font-semibold
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

          <div className="flex flex-wrap gap-4">
            {productImages.map((img, i) => (
              <div
                key={i}
                className="
                  w-28 h-28 rounded-xl
                  bg-[#111] border border-white/10
                  flex items-center justify-center
                  text-xs text-gray-300 overflow-hidden p-2 text-center
                "
              >
                {img.name}
              </div>
            ))}
          </div>
        </div>

        {/* BACKGROUND IMAGES */}
        {/* <div className="flex flex-col gap-4">
          <label className="block text-lg text-gray-200 font-sub-heading">
            Background Images (Optional)
          </label>

          <label
            className="
              self-start bg-violet-300 text-black font-semibold
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

          <div className="flex flex-wrap gap-4 pb-4">
            {backgroundImages.map((img, i) => (
              <div
                key={i}
                className="
                  w-28 h-28 rounded-xl
                  bg-[#111] border border-white/10
                  flex items-center justify-center
                  text-xs text-gray-300 overflow-hidden p-2 text-center
                "
              >
                {img.name}
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* FOOTER: Buttons fixed at bottom relative to container */}
      <div className="flex justify-between pt-6 mt-auto shrink-0 border-t border-white/10">
        <button
          onClick={onBack}
          className="
            px-6 py-3 rounded-xl
            bg-white/10 border border-white/10
            text-white font-semibold
            hover:bg-white/20 active:scale-95
            transition cursor-pointer
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
            transition cursor-pointer
          "
        >
          Continue →
        </button>
      </div>

    </div>
  );
}
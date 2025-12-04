import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTwo({ onNext, onBack }: StepTwoProps) {
  const {
    addProductImages,
    productImages,
    // Original optional fields are still in store, but removed from UI: campaignName, brandTagline
    
    // NEW MANDATORY COPY
    setHeadline,
    setSubhead,
    headline,
    subhead,
    
    // NEW COMPLIANCE FLAGS
    isAlcoholPromotion,
    setIsAlcoholPromotion,
    isExclusiveProduct,
    setIsExclusiveProduct,
    hasPhotographyOfPeople,
    setHasPhotographyOfPeople,
  } = useBrandKitStore();

  function handleProductUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // WHY: Enforce max 3 packshots (Appendix A)
    if (e.target.files) addProductImages(Array.from(e.target.files));
  }
  
  // Logic to enforce Max 3 Packshots
  const canUploadMore = productImages.length < 3;
  const productLimitReached = productImages.length >= 3;

  return (
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      <h3 className="text-3xl font-bold-heading mb-8 shrink-0">
        Campaign Copy & Assets
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-10 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {/* HEADLINE (Mandatory, Appendix A) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-sub-heading text-gray-300">
              * Headline 
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/20 text-white placeholder-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40 transition"
              placeholder="e.g., Get Ready for Summer Savings"
              required
            />
          </div>

          {/* SUBHEAD (Mandatory, Appendix A) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-sub-heading text-gray-300">
              * Subhead 
            </label>
            <input
              type="text"
              value={subhead}
              onChange={(e) => setSubhead(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/20 text-white placeholder-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40 transition"
              placeholder="e.g., Freshness Delivered to Your Door"
              required
            />
          </div>

          {/* COMPLIANCE FLAGS */}
          <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
             <label className="block text-lg text-gray-200 font-sub-heading mb-2">
                Compliance Checks
            </label>
            
            {/* Alcohol Promotion / Caveat (Appendix A) */}
            <div className="flex items-start gap-3">
                <input
                    id="alcohol-promo"
                    type="checkbox"
                    checked={isAlcoholPromotion}
                    onChange={(e) => setIsAlcoholPromotion(e.target.checked)}
                    className="mt-1 w-4 h-4 text-violet-400 bg-[#111] border-white/20 rounded focus:ring-violet-400"
                />
                <label htmlFor="alcohol-promo" className="text-sm text-gray-300 cursor-pointer font-light-heading tracking-wide ">
                    This campaign promotes <span className="font-bold-heading tracking-wide">Alcohol (Mandatory Drinkaware caveat will be applied)</span>. 
                </label>
            </div>

            {/* Exclusive Product (Appendix A) */}
            <div className="flex items-start gap-3">
                <input
                    id="exclusive-product"
                    type="checkbox"
                    checked={isExclusiveProduct}
                    onChange={(e) => setIsExclusiveProduct(e.target.checked)}
                    className="mt-1 w-4 h-4 text-violet-400 bg-[#111] border-white/20 rounded focus:ring-violet-400"
                />
                <label htmlFor="exclusive-product" className="text-sm text-gray-300 cursor-pointer font-light-heading tracking-wide">
                    This product is <span className="font-bold-heading tracking-wide">Exclusive to Tesco. (Influences Tesco Tag)</span> 
                </label>
            </div>
          </div>
        </div>

        {/* PRODUCT IMAGES */}
        <div className="flex flex-col gap-4">
          <label className="block text-lg text-gray-200 font-sub-heading">
            Product Images (Packshots - Max 3)
          </label>
          
          <label 
            className={`self-start text-black font-semibold px-5 py-3 rounded-xl cursor-pointer text-sm transition ${
                canUploadMore 
                ? 'bg-violet-300 hover:bg-violet-400' 
                : 'bg-gray-600/50 cursor-not-allowed'
            }`}
          >
            {productLimitReached ? "Maximum 3 Images" : "Upload Product Images"}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleProductUpload}
              className="hidden"
              disabled={productLimitReached}
            />
          </label>
          
          {productLimitReached && (
            <p className="text-sm text-red-300">Maximum of 3 packshots allowed.</p>
          )}
          
          {productImages.length > 0 && (
             <div className="flex flex-wrap gap-4 pt-2">
                {productImages.map((img, i) => (
                  <div
                    key={i}
                    className="w-28 h-28 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center text-xs text-gray-300 overflow-hidden p-2 text-center"
                  >
                    {img.name}
                  </div>
                ))}
              </div>
          )}


          {/* WARNING: Photography of People (Appendix B) */}
          <div className="flex items-start gap-3 mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-xl">
             <input
                required
                id="photo-people-confirm"
                type="checkbox"
                checked={hasPhotographyOfPeople}
                onChange={(e) => setHasPhotographyOfPeople(e.target.checked)}
                className="mt-1 w-4 h-4 text-yellow-400 bg-[#111] border-white/20 rounded focus:ring-yellow-400"
            />
            <label htmlFor="photo-people-confirm" className="text-sm font-light-heading tracking-wide text-gray-100 cursor-pointer">
                <span className="font-bold-heading tracking-wide">Image Warning:</span> I confirm that any photography of people in the uploaded images (If any) is <span className="font-bold-heading tracking-wide">integral to the campaign</span>.
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 mt-auto shrink-0 border-t border-white/10">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          // WHY: Headline, Subhead, and at least one image are mandatory for any banner (Appendix A)
          disabled={!headline || !subhead || productImages.length === 0 || !hasPhotographyOfPeople} 
          className="px-6 py-3 rounded-xl bg-violet-300 text-black font-bold hover:bg-violet-400 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
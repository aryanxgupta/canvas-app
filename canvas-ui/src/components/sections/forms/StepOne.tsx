import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepOneProps {
  onNext: () => void;
}

const PRESET_CATEGORIES = [
  "food",
  "beauty",
  "fashion",
  "electronics",
  "home",
  "grocery",
];

export default function StepOne({ onNext }: StepOneProps) {
  const {
    brandName,
    brandCategory,
    colorsJson,
    logoFile,
    setBrandName,
    setBrandCategory,
    setColorsJson,
    setLogoFile,
  } = useBrandKitStore();

  // Helper to determine if the current category is a custom one
  const isCustomCategory =
    brandCategory && !PRESET_CATEGORIES.includes(brandCategory);
  
  // Helper for the Select value
  const selectValue = isCustomCategory ? "other" : brandCategory;

  const handleColorChange = (key: string, value: string) => {
    setColorsJson({
      ...colorsJson,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-10 text-white max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <h3 className="text-3xl font-bold-heading shrink-0">Brand Details</h3>

      <div className="flex flex-col gap-8">
        {/* BRAND NAME */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Name
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Nescafé"
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/20 text-white placeholder-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40 transition"
          />
        </div>

        {/* BRAND CATEGORY */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Category (optional)
          </label>
          <select
            value={selectValue}
            onChange={(e) => {
              const value = e.target.value;
              // If user selects "other", clear category so input shows empty or keeps previous custom
              if (value === "other") {
                setBrandCategory(""); 
              } else {
                setBrandCategory(value);
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/20 text-white focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40 transition"
          >
            <option value="">Select category</option>
            <option value="food">Food & Beverages</option>
            <option value="beauty">Beauty & Personal Care</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home & Living</option>
            <option value="grocery">Grocery</option>
            <option value="other">Other</option>
          </select>

          {/* Custom Category Input */}
          {(selectValue === "other" || isCustomCategory) && (
            <input
              type="text"
              value={brandCategory}
              onChange={(e) => setBrandCategory(e.target.value)}
              placeholder="Please specify your category"
              className="w-full px-4 py-3 rounded-xl bg-[#111] border border-white/20 text-white placeholder-white/40 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40 transition mt-2"
            />
          )}
        </div>

        {/* COLOR THEME PICKER */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Color Theme (optional)
          </label>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Primary</p>
              <input
                type="color"
                value={colorsJson.primary || "#8b5cf6"}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Secondary</p>
              <input
                type="color"
                value={colorsJson.secondary || "#ffffff"}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* LOGO UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Upload Logo
          </label>

          <label className="self-start bg-violet-300 text-black font-semibold px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-violet-400 transition">
            Choose Logo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLogoFile(file);
              }}
              className="hidden"
            />
          </label>

          {logoFile && (
            <p className="text-sm text-gray-300 mt-1">
              Selected: <span className="font-semibold">{logoFile.name}</span>
            </p>
          )}
        </div>
      </div>


      <button
        onClick={onNext}
        className="mt-auto mb-2 px-6 py-3 rounded-xl bg-violet-300 text-black font-bold hover:bg-violet-400 active:scale-95 transition shrink-0 cursor-pointer"
      >
        Continue →
      </button>
    </div>
  );
}
import { useState } from "react";
import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepOneProps {
  onNext: () => void;
}

export default function StepOne({ onNext }: StepOneProps) {
  const {
    brandCategory,
    setBrandName,
    setBrandCategory,
    setBrandTagline,
    setColorsJson,
    setLogoFile,
  } = useBrandKitStore();

  const [fileName, setFileName] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // For color theme
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");

  function handleColorSave() {
    setColorsJson({
      primary: primaryColor,
      secondary: secondaryColor,
    });
  }

  return (
    // Main Container: Flex column, max height 80vh, with scroll handling
    <div className="flex flex-col gap-10 text-white max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      
      {/* TITLE */}
      <h3 className="text-3xl font-bold-heading shrink-0">Brand Details</h3>

      {/* FORM CONTENT WRAPPER */}
      <div className="flex flex-col gap-8">
        
        {/* BRAND NAME */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Name
          </label>
          <input
            type="text"
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Nescafé"
            className="
              w-full px-4 py-3 rounded-xl bg-[#111]
              border border-white/20 text-white placeholder-white/40
              focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
              transition
            "
          />
        </div>

        {/* BRAND CATEGORY */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Category (optional)
          </label>
          <select
            value={brandCategory}
            onChange={(e) => {
              const value = e.target.value;
              setBrandCategory(value);
              if (value !== "other") setCustomCategory("");
            }}
            className="
              w-full px-4 py-3 rounded-xl bg-[#111]
              border border-white/20 text-white
              focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
              transition
            "
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
          {brandCategory === "other" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setBrandCategory(e.target.value);
              }}
              placeholder="Please specify your category"
              className="
                w-full px-4 py-3 rounded-xl bg-[#111]
                border border-white/20 text-white placeholder-white/40
                focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
                transition mt-2
              "
            />
          )}
        </div>

        {/* BRAND TAGLINE */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Brand Tagline (optional)
          </label>
          <input
            type="text"
            onChange={(e) => setBrandTagline(e.target.value)}
            placeholder="e.g., It All Starts With a Nescafé"
            className="
              w-full px-4 py-3 rounded-xl bg-[#111]
              border border-white/20 text-white placeholder-white/40
              focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
              transition
            "
          />
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
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Secondary</p>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
              />
            </div>
          </div>

          {/* <button
            onClick={handleColorSave}
            className="
              self-start px-4 py-2 mt-2 rounded-lg bg-white/10 text-white
              border border-white/10 hover:bg-white/20 transition
            "
          >
            Save Colors
          </button> */}
        </div>

        {/* LOGO UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-sub-heading text-gray-300">
            Upload Logo
          </label>

          <label
            className="
              self-start bg-violet-300 text-black font-semibold
              px-4 py-2 rounded-lg cursor-pointer text-sm
              hover:bg-violet-400 transition
            "
          >
            Choose Logo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLogoFile(file);
                setFileName(file ? file.name : "");
              }}
              className="hidden"
            />
          </label>

          {fileName && (
            <p className="text-sm text-gray-300 mt-1">
              Selected: <span className="font-semibold">{fileName}</span>
            </p>
          )}
        </div>
      </div>

      {/* CONTINUE BUTTON - Using mt-auto to push to bottom if space permits, otherwise it flows naturally */}
      <button
        onClick={onNext}
        className="
          mt-auto mb-2 px-6 py-3 rounded-xl
          bg-violet-300 text-black font-bold
          hover:bg-violet-400 active:scale-95
          transition shrink-0 cursor-pointer
        "
      >
        Continue →
      </button>
    </div>
  );
}
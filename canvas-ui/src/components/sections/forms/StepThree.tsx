import { ArrowRightIcon } from "lucide-react";
import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepThreeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepThree({ onNext, onBack }: StepThreeProps) {
  const {
    prompt,
    setPrompt,

    format,
    setFormat,

    tone,
    setTone,

    style,
    setStyle,

    creativeMode,
    setCreativeMode,

    valueTileType,
    setValueTileType,

    whitePrice,
    setWhitePrice,

    clubcardOfferPrice,
    setClubcardOfferPrice,

    clubcardRegularPrice,
    setClubcardRegularPrice,

    clubcardEndDate,
    setClubcardEndDate,

    tescoTag,
    setTescoTag,

    isExclusiveProduct, // from step 2
  } = useBrandKitStore();

  // -------------------------------------------
  // HANDLE TESCO TAG OVERRIDES
  // -------------------------------------------
  let forcedTag: string | null = null;

  // Rule 1 — Clubcard overrides everything
  if (valueTileType === "clubcard") {
    forcedTag = clubcardEndDate
      ? `Available in selected stores. Clubcard/app required. Ends ${clubcardEndDate}`
      : "Available in selected stores. Clubcard/app required. Ends DD/MM";
  }

  // Rule 2 — LEP mode
  else if (creativeMode === "lep") {
    forcedTag = "Selected stores. While stocks last.";
  }

  // Rule 3 — Exclusive product
  else if (isExclusiveProduct) {
    forcedTag = "Only at Tesco";
  }

  // Rule 4 — User controls the dropdown (forcedTag stays null)

  const handleTescoTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTescoTag(e.target.value as any);
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      <h3 className="text-3xl font-bold-heading mb-8 shrink-0">
        Ad Preferences
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-8 custom-scrollbar">

        {/* CREATIVE PROMPT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Creative Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the ad style you want..."
            className="w-full min-h-[120px] bg-[#111] border border-white/20 
                       text-white placeholder-white/40 rounded-xl p-4"
          />
        </div>

        {/* FORMAT • TONE • STYLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* FORMAT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
            >
              <option value="square">Square (1080×1080)</option>
              <option value="story">Story (1080×1920)</option>
              <option value="landscape">Landscape (1200×628)</option>
            </select>
          </div>

          {/* TONE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
            >
              <option value="">Select tone</option>
              <option value="fun">Fun / Energetic</option>
              <option value="premium">Premium / Elegant</option>
              <option value="minimal">Minimal / Clean</option>
              <option value="bold">Bold / Strong visuals</option>
            </select>
          </div>

          {/* STYLE */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-gray-300">Design Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
            >
              <option value="">Select style</option>
              <option value="clean">Clean & Modern</option>
              <option value="festive">Festive / Seasonal</option>
              <option value="luxury">Luxury / Premium</option>
              <option value="neon">Neon / Vibrant</option>
            </select>
          </div>
        </div>

        {/* CREATIVE MODE */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Creative Mode</label>
          <select
            value={creativeMode}
            onChange={(e) => setCreativeMode(e.target.value as any)}
            className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
          >
            <option value="standard">Standard</option>
            <option value="lep">Low Everyday Price (LEP)</option>
          </select>
        </div>

        {/* VALUE TILE */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Value Tile</label>
          <select
            value={valueTileType}
            onChange={(e) => setValueTileType(e.target.value as any)}
            className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
          >
            <option value="none">None</option>
            <option value="new">New</option>
            <option value="white">White Price Tile</option>
            <option value="clubcard">Clubcard Price</option>
          </select>
        </div>

        {/* PRICE INPUTS */}
        {valueTileType === "white" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">White Tile Price</label>
            <input
              value={whitePrice}
              onChange={(e) => setWhitePrice(e.target.value)}
              placeholder="e.g. £3.50"
              className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
            />
          </div>
        )}

        {valueTileType === "clubcard" && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Clubcard Offer Price</label>
              <input
                value={clubcardOfferPrice}
                onChange={(e) => setClubcardOfferPrice(e.target.value)}
                placeholder="e.g. £2.00"
                className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Clubcard Regular Price</label>
              <input
                value={clubcardRegularPrice}
                onChange={(e) => setClubcardRegularPrice(e.target.value)}
                placeholder="e.g. £3.00"
                className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Clubcard End Date (DD/MM/YYYY)</label>
              <input
                value={clubcardEndDate}
                onChange={(e) => setClubcardEndDate(e.target.value)}
                placeholder="e.g. 23/06"
                className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
              />
            </div>
          </>
        )}

        {/* TESCO TAG */}
        <div className="flex flex-col gap-2 pt-4">
          <label className="text-sm text-gray-300">Tesco Tag (Required)</label>

          {forcedTag ? (
            <input
              value={forcedTag}
              readOnly
              disabled
              className="px-4 py-3 bg-[#333] border border-white/20 rounded-xl 
                         text-gray-300 cursor-not-allowed"
            />
          ) : (
            <select
              value={tescoTag}
              onChange={handleTescoTagChange}
              className="px-4 py-3 bg-[#111] border border-white/20 rounded-xl text-white"
            >
              <option value="availableAtTesco">Available at Tesco</option>
              <option value="onlyAtTesco">Only at Tesco</option>
              <option value="selectedStores">Selected stores. While stocks last.</option>
            </select>
          )}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-between pt-6 mt-auto border-t border-white/10">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/10 border border-white/20 
                     rounded-xl hover:bg-white/20"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          className="px-6 py-3 bg-violet-300 text-black font-bold 
                     rounded-xl hover:bg-violet-400 flex items-center gap-2"
        >
          Next <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  );
}

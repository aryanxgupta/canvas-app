import { useBrandKitStore } from "../../../store/useBrandKitStore";

interface StepThreeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepThree({ onNext, onBack }: StepThreeProps) {
  const {
    setPrompt,
    setFormat,
    setTone,
    setStyle,
    channels,
    setChannels,
  } = useBrandKitStore();

  const channelOptions = [
    "Facebook Feed",
    "Instagram Feed",
    "Instagram Story",
    "Story",
    "Landscape Banner",
    "Square Ad",
  ];

  // Toggle channel selection
  function toggleChannel(channel: string) {
    if (channels.includes(channel)) {
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  }

  return (
    // ROOT: Flex column with max height
    <div className="flex flex-col h-full max-h-[80vh] text-white custom-scrollbar">
      
      {/* HEADER */}
      <h3 className="text-3xl font-bold-heading mb-8 shrink-0">
        Ad Preferences
      </h3>

      {/* BODY: Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-8 custom-scrollbar">
        
        {/* GROUP 1 — CREATIVE PROMPT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Creative Prompt</label>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            className="
              w-full min-h-[120px]
              bg-[#111] border border-white/20
              text-white placeholder-white/40
              rounded-xl p-4
              focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
              transition resize-none
            "
            placeholder="Describe the ad style you want — clean, festive, minimal, premium, etc."
          />
        </div>

        {/* GROUP 2 — FORMAT + TONE + STYLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Format */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Format</label>
            <select
              onChange={(e) => setFormat(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#111] border border-white/20 text-white
                focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
                transition
              "
            >
              <option value="square">Square (1080×1080)</option>
              <option value="story">Story (1080×1920)</option>
              <option value="landscape">Landscape (1200×628)</option>
            </select>
          </div>

          {/* Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Tone</label>
            <select
              onChange={(e) => setTone(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#111] border border-white/20 text-white
                focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
                transition
              "
            >
              <option value="">Select tone</option>
              <option value="fun">Fun / Energetic</option>
              <option value="premium">Premium / Elegant</option>
              <option value="minimal">Minimal / Clean</option>
              <option value="bold">Bold / Strong visuals</option>
            </select>
          </div>

          {/* Style */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-gray-300">Design Style</label>
            <select
              onChange={(e) => setStyle(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                bg-[#111] border border-white/20 text-white
                focus:border-violet-400 focus:ring-2 focus:ring-violet-400/40
                transition
              "
            >
              <option value="">Select style</option>
              <option value="clean">Clean & Modern</option>
              <option value="festive">Festive / Seasonal</option>
              <option value="luxury">Luxury / Premium</option>
              <option value="neon">Neon / Vibrant</option>
            </select>
          </div>
        </div>

        {/* GROUP 3 — CHANNELS */}
        <div className="flex flex-col gap-3">
          <label className="text-sm text-gray-300">Channels (Optional)</label>
          <div className="grid grid-cols-2 gap-3">
            {channelOptions.map((channel) => {
              const selected = channels.includes(channel);
              return (
                <button
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`
                    px-3 py-3 text-xs font-medium rounded-lg transition border
                    ${
                      selected
                        ? "bg-violet-400 text-black border-violet-500"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  {channel}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* FOOTER: Fixed Buttons */}
      <div className="flex justify-between pt-6 mt-auto shrink-0 border-t border-white/10">
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
          Generate Ads →
        </button>
      </div>

    </div>
  );
}
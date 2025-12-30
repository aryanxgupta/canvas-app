import { fabric } from "fabric";
import { SAFE_ZONE, SOCIAL_CANVAS, MIN_FONT_SIZE } from "./ValidationRules";

export type Platform =
  | "social"          // IG / FB Story
  | "instagramPost"
  | "facebookAd"
  | "checkoutSingle"
  | "says";

export function validateCanvas(
  canvas: fabric.Canvas,
  platform: Platform,
  canvasWidth: number,
  canvasHeight: number
) {
  const errors: { id?: string; message: string }[] = [];

  /* -------------------------------------------------
   * 1️⃣ CANVAS SIZE — ONLY FOR STORIES
   * ------------------------------------------------- */
  if (platform === "social") {
    if (
      canvasWidth !== SOCIAL_CANVAS.width ||
      canvasHeight !== SOCIAL_CANVAS.height
    ) {
      errors.push({
        message: "Canvas must be 1080x1920 (9:16) for Social Stories",
      });
    }
  }

  /* -------------------------------------------------
   * 2️⃣ OBJECT-LEVEL VALIDATION
   * ------------------------------------------------- */
  canvas.getObjects().forEach((obj: any) => {
    // ✅ Bounding box is zoom / origin / scale safe
    const bounds = obj.getBoundingRect(true, true);
    const top = bounds.top;
    const bottom = bounds.top + bounds.height;

    /* ---------------------------------------------
     * SAFE ZONES — ONLY FOR STORIES
     * --------------------------------------------- */
    if (platform === "social") {
      if (top < SAFE_ZONE.top) {
        errors.push({
          id: obj.id,
          message: "Element violates top safe zone (200px)",
        });
      }

      if (bottom > SOCIAL_CANVAS.height - SAFE_ZONE.bottom) {
        errors.push({
          id: obj.id,
          message: "Element violates bottom safe zone (250px)",
        });
      }
    }

    /* ---------------------------------------------
     * FONT SIZE — PLATFORM-AWARE
     * --------------------------------------------- */
    if (
      obj.type === "textbox" ||
      obj.type === "text" ||
      obj.type === "i-text"
    ) {
      const minFont = MIN_FONT_SIZE[platform as keyof typeof MIN_FONT_SIZE];
      const fontSize = obj.fontSize ?? 0;

      if (minFont && fontSize < minFont) {
        errors.push({
          id: obj.id,
          message: `Font size too small (min ${minFont}px)`,
        });
      }
    }
  });

  return errors;
}

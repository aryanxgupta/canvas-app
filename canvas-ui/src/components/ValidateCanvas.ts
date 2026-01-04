import { fabric } from "fabric";
import { SAFE_ZONE, SOCIAL_CANVAS, MIN_FONT_SIZE } from "./ValidationRules";

export function validateCanvas(
  canvas: fabric.Canvas,
  platform: "social" | "checkoutSingle" | "says",
  canvasWidth: number,
  canvasHeight: number
) {
  const errors: { id?: string; message: string }[] = [];

  // 1️⃣ Canvas size check (USE LOGICAL SIZE, NOT FABRIC SIZE)
  

  // 2️⃣ Object-level validation
  canvas.getObjects().forEach((obj: any) => {
    // ✅ ALWAYS use bounding box (zoom + origin safe)
    const bounds = obj.getBoundingRect(true, true);
    const top = bounds.top;
    const bottom = bounds.top + bounds.height;

    // 🔴 Safe zone checks
    if (top < SAFE_ZONE.top) {
      errors.push({
        id: obj.id,
        message: "Element violates top safe zone ",
      });
    }

    if (bottom > SOCIAL_CANVAS.height - SAFE_ZONE.bottom) {
      errors.push({
        id: obj.id,
        message: "Element violates bottom safe zone",
      });
    }

    // 🟠 Font size accessibility (text only)
    if (obj.type === "textbox" || obj.type === "text" || obj.type === "i-text") {
      const minFont = MIN_FONT_SIZE[platform];
      const fontSize = obj.fontSize ?? 0;

      if (fontSize < minFont) {
        errors.push({
          id: obj.id,
          message: `Font size too small (min ${minFont}px)`,
        });
      }
    }
  });

  return errors;
}

import React, { useEffect } from "react";
import { fabric } from "fabric";
import { useEditorStore } from "../store/editorStore";
import { SAFE_ZONE } from "./ValidationRules";

export const SafeZoneOverlay = () => {
  const { canvas, width, height } = useEditorStore();

  useEffect(() => {
    if (!canvas || width !== 1080 || height !== 1920) return;

    // Draw safe zone guides (visual only, not part of canvas export)
    const drawSafeZones = () => {
      // Remove previous guides if they exist
      canvas.getObjects().forEach((obj: any) => {
        if (obj.isSafeZoneGuide) {
          canvas.remove(obj);
        }
      });

      // Top safe zone line
      const topLine = new fabric.Line([0, SAFE_ZONE.top, width, SAFE_ZONE.top], {
        stroke: "#ff6b6b",
        strokeWidth: 2,
        strokeDasharray: [5, 5],
        selectable: false,
        evented: false,
        opacity: 0.5,
        isSafeZoneGuide: true,
      } as any);

      // Bottom safe zone line
      const bottomLine = new fabric.Line(
        [0, height - SAFE_ZONE.bottom, width, height - SAFE_ZONE.bottom],
        {
          stroke: "#ff6b6b",
          strokeWidth: 2,
          strokeDasharray: [5, 5],
          selectable: false,
          evented: false,
          opacity: 0.5,
          isSafeZoneGuide: true,
        } as any
      );

      canvas.add(topLine, bottomLine);
      canvas.sendToBack(topLine);
      canvas.sendToBack(bottomLine);
      canvas.renderAll();
    };

    drawSafeZones();
  }, [canvas, width, height]);

  return null;
};
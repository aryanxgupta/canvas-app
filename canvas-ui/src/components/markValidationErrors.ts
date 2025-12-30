import { fabric } from "fabric";

export function markValidationErrors(
  canvas: fabric.Canvas,
  errors: { id?: string }[]
) {
  // Clear previous error highlights
  canvas.getObjects().forEach((obj) => {
    obj.set({
      stroke: undefined,
      strokeWidth: 0,
    });
  });

  // Highlight invalid objects
  errors.forEach((err) => {
    if (!err.id) return;

    const obj = canvas.getObjects().find((o: any) => o.id === err.id);
    if (obj) {
      obj.set({
        stroke: "red",
        strokeWidth: 2,
      });
    }
  });

  canvas.renderAll();
}

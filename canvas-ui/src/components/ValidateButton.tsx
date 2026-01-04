import React from "react";
import { useEditorStore } from "../store/editorStore";
import { validateCanvas } from "./ValidateCanvas";
import { markValidationErrors } from "./markValidationErrors";

export const ValidateButton = () => {
  const { canvas, width, height } = useEditorStore();

  const handleValidate = () => {
    if (!canvas) return;

    const errors = validateCanvas(canvas, "social", width, height);

    if (errors.length > 0) {
      markValidationErrors(canvas, errors);

      alert(
        "Validation failed:\n" +
        errors.map(e => `• ${e.message}`).join("\n")
      );
    } else {
      alert("✅ Design is Tesco-compliant for Social Stories");
    }
  };

  return (
    <button
      onClick={handleValidate}
      style={{
        padding: "10px 16px",
        background: "#111",
        color: "#fff",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      Validate Design
    </button>
  );
};

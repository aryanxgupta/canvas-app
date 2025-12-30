import React, { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import { validateCanvas } from "./ValidateCanvas";
import { markValidationErrors } from "./markValidationErrors";
import { Check, X } from "lucide-react";

export const ValidateButton = () => {
  const { canvas, width, height } = useEditorStore();
  const [showModal, setShowModal] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    passed: boolean;
    errors: { id?: string; message: string }[];
    platform: string;
  } | null>(null);

  const getPlatform = () => {
    if (width === 1080 && height === 1920) return "social";
    if (width === 1080 && height === 1080) return "instagramPost";
    if (width === 1200 && height === 628) return "facebookAd";
    return "social";
  };

  const handleValidate = () => {
    if (!canvas) return;

    const platform = getPlatform();
    const errors = validateCanvas(canvas, platform as any, width, height);

    const result = {
      passed: errors.length === 0,
      errors,
      platform,
    };

    setValidationResult(result);
    setShowModal(true);

    if (errors.length > 0) {
      markValidationErrors(canvas, errors);
    }
  };

  const dismissErrors = () => {
    if (canvas) {
      canvas.getObjects().forEach((obj) => {
        obj.set({
          stroke: undefined,
          strokeWidth: 0,
        });
      });
      canvas.renderAll();
    }
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleValidate}
        style={{
          padding: "10px 16px",
          background: "#111",
          color: "#fff",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          transition: "all 0.3s ease",
          border: "1px solid #333",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1a1a1a";
          e.currentTarget.style.borderColor = "#666";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#111";
          e.currentTarget.style.borderColor = "#333";
        }}
      >
        ✓ Validate Design
      </button>

      {/* Validation Modal */}
      {showModal && validationResult && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={dismissErrors}
        >
          <div
            style={{
              background: "#111",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid #333",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {validationResult.passed ? (
                <Check size={28} color="#10b981" />
              ) : (
                <X size={28} color="#ef4444" />
              )}
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: validationResult.passed ? "#10b981" : "#ef4444",
                  margin: 0,
                }}
              >
                {validationResult.passed
                  ? "✅ Design is Valid"
                  : "❌ Validation Failed"}
              </h2>
            </div>

            {/* Platform Info */}
            <p
              style={{
                fontSize: "13px",
                color: "#aaa",
                margin: "0 0 16px 0",
                textTransform: "capitalize",
              }}
            >
              Platform: <strong>{validationResult.platform}</strong> ({width}x
              {height}px)
            </p>

            {/* Guidelines */}
            <div
              style={{
                background: "#1a1a1a",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "16px",
                fontSize: "12px",
                color: "#ccc",
                lineHeight: "1.6",
              }}
            >
              <strong style={{ color: "#fff" }}>Tesco Guidelines:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                {validationResult.platform === "social" && (
                  <>
                    <li>Canvas: 1080x1920px (9:16 ratio)</li>
                    <li>Safe zone: 200px from top, 250px from bottom</li>
                    <li>Minimum font size: 20px</li>
                  </>
                )}
                {validationResult.platform === "instagramPost" && (
                  <>
                    <li>Canvas: 1080x1080px (1:1 ratio)</li>
                    <li>Minimum font size: 20px</li>
                  </>
                )}
                {validationResult.platform === "facebookAd" && (
                  <>
                    <li>Canvas: 1200x628px (1.9:1 ratio)</li>
                    <li>Minimum font size: 20px</li>
                  </>
                )}
              </ul>
            </div>

            {/* Error List */}
            {validationResult.errors.length > 0 && (
              <div
                style={{
                  background: "#1a1a1a",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "20px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <strong style={{ color: "#ef4444", fontSize: "13px" }}>
                  Issues Found ({validationResult.errors.length}):
                </strong>
                <ul
                  style={{
                    margin: "8px 0 0 0",
                    paddingLeft: "20px",
                    fontSize: "12px",
                    color: "#ccc",
                  }}
                >
                  {validationResult.errors.map((err, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>
                      {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={dismissErrors}
                style={{
                  padding: "8px 16px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#333";
                }}
              >
                {validationResult.passed ? "Done" : "Fix Issues"}
              </button>

              {validationResult.passed && (
                <button
                  onClick={() => {
                    setShowModal(false);
                    // Trigger download or next action
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#059669";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#10b981";
                  }}
                >
                  Export Design
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
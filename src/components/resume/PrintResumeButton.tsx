"use client";

export function PrintResumeButton() {
  return (
    <button
      className="print-resume"
      type="button"
      onClick={() => window.print()}
    >
      Print / Save PDF
    </button>
  );
}

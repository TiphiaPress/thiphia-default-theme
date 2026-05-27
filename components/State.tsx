export function State({ text, tone }: { text: string; tone?: "error" }) {
  const isError = tone === "error";
  return (
    <div className={`state theme-state ${tone || ""}`} role={isError ? "alert" : "status"} aria-live="polite">
      {isError ? null : <span className="theme-state-spinner" aria-hidden="true" />}
      <span>{text}</span>
      {isError ? null : <span className="theme-state-line" aria-hidden="true" />}
    </div>
  );
}

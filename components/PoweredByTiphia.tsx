import { Github } from "lucide-react";

export function PoweredByTiphia() {
  return (
    <div className="theme-powered-by" data-safe-external="true">
      <a href="https://github.com/TiphiaPress/tiphia" target="_blank" rel="noreferrer">
        <span>Powered by</span>
        <strong>TiphiaPress</strong>
        <Github size={14} aria-hidden="true" />
      </a>
    </div>
  );
}

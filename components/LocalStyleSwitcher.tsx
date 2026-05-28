import { Monitor, Moon, Palette, RotateCcw, Sparkles, Sun } from "lucide-react";

export type LocalThemeAppearance = "system" | "light" | "dark";
export type LocalLiquidGlass = "on" | "off";

const APPEARANCE_KEY = "tiphia.defaultTheme.appearance";
const GLASS_KEY = "tiphia.defaultTheme.liquidGlass";
const ACCENT_KEY = "tiphia.defaultTheme.accent";
const DEFAULT_ACCENT = "#2563eb";

export interface LocalThemeStyle {
  appearance: LocalThemeAppearance;
  liquidGlass: boolean;
  accent: string;
  appearanceOverridden: boolean;
  glassOverridden: boolean;
  accentOverridden: boolean;
}

export function readLocalThemeStyle(
  fallbackAppearance: LocalThemeAppearance,
  fallbackLiquidGlass: boolean,
  fallbackAccent: string,
): LocalThemeStyle {
  if (typeof window === "undefined") {
    return {
      appearance: fallbackAppearance,
      liquidGlass: fallbackLiquidGlass,
      accent: fallbackAccent,
      appearanceOverridden: false,
      glassOverridden: false,
      accentOverridden: false,
    };
  }

  const appearance = normalizeAppearance(window.localStorage.getItem(APPEARANCE_KEY));
  const glass = normalizeGlass(window.localStorage.getItem(GLASS_KEY));
  const accent = normalizeAccent(window.localStorage.getItem(ACCENT_KEY));
  return {
    appearance: appearance ?? fallbackAppearance,
    liquidGlass: glass === "on" ? true : glass === "off" ? false : fallbackLiquidGlass,
    accent: accent ?? fallbackAccent,
    appearanceOverridden: appearance !== null,
    glassOverridden: glass !== null,
    accentOverridden: accent !== null,
  };
}

export function saveLocalThemeAppearance(value: LocalThemeAppearance | null) {
  if (value) {
    window.localStorage.setItem(APPEARANCE_KEY, value);
  } else {
    window.localStorage.removeItem(APPEARANCE_KEY);
  }
}

export function saveLocalLiquidGlass(value: LocalLiquidGlass | null) {
  if (value) {
    window.localStorage.setItem(GLASS_KEY, value);
  } else {
    window.localStorage.removeItem(GLASS_KEY);
  }
}

export function saveLocalAccent(value: string | null) {
  const accent = normalizeAccent(value);
  if (accent) {
    window.localStorage.setItem(ACCENT_KEY, accent);
  } else {
    window.localStorage.removeItem(ACCENT_KEY);
  }
}

export interface LocalStyleSwitcherProps {
  value: LocalThemeStyle;
  defaultAccent: string;
  onAppearanceChange: (value: LocalThemeAppearance | null) => void;
  onLiquidGlassChange: (value: LocalLiquidGlass | null) => void;
  onAccentChange: (value: string | null) => void;
}

export function LocalStyleSwitcher({ value, defaultAccent, onAppearanceChange, onLiquidGlassChange, onAccentChange }: LocalStyleSwitcherProps) {
  return (
    <section className="local-style-switcher" aria-label="本地主题样式">
      <details>
        <summary title="本地样式">
          <Palette size={18} aria-hidden="true" />
        </summary>
        <div className="local-style-panel">
          <div>
            <span className="local-style-label">外观</span>
            <div className="local-style-options" role="group" aria-label="外观模式">
              <button type="button" className={value.appearance === "system" ? "active" : ""} onClick={() => onAppearanceChange("system")}>
                <Monitor size={15} aria-hidden="true" />
                自适应
              </button>
              <button type="button" className={value.appearance === "light" ? "active" : ""} onClick={() => onAppearanceChange("light")}>
                <Sun size={15} aria-hidden="true" />
                浅色
              </button>
              <button type="button" className={value.appearance === "dark" ? "active" : ""} onClick={() => onAppearanceChange("dark")}>
                <Moon size={15} aria-hidden="true" />
                暗色
              </button>
            </div>
          </div>
          <div>
            <span className="local-style-label">液态玻璃</span>
            <div className="local-style-options" role="group" aria-label="液态玻璃">
              <button type="button" className={value.liquidGlass ? "active" : ""} onClick={() => onLiquidGlassChange("on")}>
                <Sparkles size={15} aria-hidden="true" />
                开启
              </button>
              <button type="button" className={!value.liquidGlass ? "active" : ""} onClick={() => onLiquidGlassChange("off")}>
                关闭
              </button>
            </div>
          </div>
          <label className="local-style-accent">
            <span className="local-style-label">强调色</span>
            <span className="local-style-color-row">
              <input type="color" value={value.accent} onChange={(event) => onAccentChange(event.target.value)} aria-label="强调色" />
              <span className="local-style-color-value">{value.accent}</span>
              <button type="button" title="恢复默认强调色" onClick={() => onAccentChange(null)} disabled={!value.accentOverridden && value.accent === defaultAccent}>
                <RotateCcw size={14} aria-hidden="true" />
              </button>
            </span>
          </label>
          <button type="button" className="local-style-reset" onClick={() => {
            onAppearanceChange(null);
            onLiquidGlassChange(null);
            onAccentChange(null);
          }}>
            恢复站点默认
          </button>
        </div>
      </details>
    </section>
  );
}

function normalizeAppearance(value: string | null): LocalThemeAppearance | null {
  return value === "system" || value === "light" || value === "dark" ? value : null;
}

function normalizeGlass(value: string | null): LocalLiquidGlass | null {
  return value === "on" || value === "off" ? value : null;
}

export function normalizeAccent(value: unknown) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : null;
}

export function themeAccent(config: Record<string, unknown>) {
  return normalizeAccent(config.accent) ?? DEFAULT_ACCENT;
}

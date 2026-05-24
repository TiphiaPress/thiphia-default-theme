import { Github, Home, Link as LinkIcon, Mail, Rss } from "lucide-react";

export type FooterItem = {
  label: string;
  href?: string;
  icon?: string;
};

export function ThemeFooterItems({ items }: { items: unknown }) {
  const parsed = readFooterItems(items);
  if (parsed.length === 0) {
    return null;
  }
  return (
    <div className="theme-footer-items">
      {parsed.map((item) => {
        const Icon = footerIcon(item.icon);
        const content = (
          <>
            <Icon size={15} />
            <span>{item.label}</span>
          </>
        );
        return item.href ? (
          <a key={`${item.label}:${item.href}`} href={item.href} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : (
          <span key={item.label}>{content}</span>
        );
      })}
    </div>
  );
}

function readFooterItems(value: unknown): FooterItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const raw = item as Record<string, unknown>;
    const label = typeof raw.label === "string" ? raw.label.trim() : "";
    const href = typeof raw.href === "string" ? raw.href.trim() : undefined;
    const icon = typeof raw.icon === "string" ? raw.icon.trim() : undefined;
    return label ? [{ label, href, icon }] : [];
  });
}

function footerIcon(icon?: string) {
  switch (icon) {
    case "github":
      return Github;
    case "home":
      return Home;
    case "mail":
      return Mail;
    case "rss":
      return Rss;
    default:
      return LinkIcon;
  }
}

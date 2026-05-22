import { Github, Home, Link as LinkIcon, Mail, Rss } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FrontendHookSlot, useFrontendHeadEffects } from "../../framework/plugin-hooks";
import { externalWarningPath, shouldWarnExternalLink } from "./externalLinks";
import type { TermResponse } from "../../blog/types";
import { SiteAvatar } from "../../blog/components/SiteAvatar";
import { TermLinks } from "../../blog/components/TermLinks";
import type { ThemeNavPage } from "../../blog/lib/theme";
import "./theme.css";

export interface DefaultThemeLayoutProps {
  title: string;
  description?: string | null;
  avatarUrl?: string | null;
  baseUrl?: string | null;
  registrationEnabled?: boolean;
  navPages: ThemeNavPage[];
  terms: TermResponse[];
  config?: Record<string, unknown>;
}

export function DefaultThemeLayout({
  title,
  description,
  avatarUrl,
  baseUrl,
  registrationEnabled,
  navPages,
  terms,
  config = {},
}: DefaultThemeLayoutProps) {
  const footerItems = config.footer_items;
  useFrontendHeadEffects({ title, description, baseUrl });

  return (
    <div
      className="site default-theme"
      onClick={(event) => {
        const anchor = (event.target as HTMLElement).closest("a");
        if (!anchor || event.defaultPrevented) {
          return;
        }
        if (shouldWarnExternalLink(anchor, baseUrl)) {
          event.preventDefault();
          window.location.assign(externalWarningPath(anchor.href));
        }
      }}
    >
      <FrontendHookSlot hook="blog.body.start" context={{ title }} />
      <FrontendHookSlot hook="blog.header.before" context={{ title }} />
      <header className="site-header">
        <Link to="/" className="site-title">
          <SiteAvatar avatarUrl={avatarUrl} baseUrl={baseUrl} title={title} size="small" />
          {title}
        </Link>
        <nav>
          <NavLink to="/categories">分类</NavLink>
          <NavLink to="/tags">标签</NavLink>
          <NavLink to="/timeline">时间线</NavLink>
          {registrationEnabled ? <NavLink to="/register">注册</NavLink> : null}
          {navPages.map((page) => (
            <NavLink key={page.slug} to={`/custom-pages/${page.slug}`}>
              {page.label}
            </NavLink>
          ))}
          <FrontendHookSlot hook="blog.nav.after" context={{ navPages }} />
        </nav>
      </header>
      <FrontendHookSlot hook="blog.header.after" context={{ title }} />
      <FrontendHookSlot hook="blog.main.before" context={{ title }} />
      <main>
        <Outlet />
      </main>
      <FrontendHookSlot hook="blog.sidebar" context={{ title }} />
      <FrontendHookSlot hook="blog.main.after" context={{ title }} />
      <footer>
        <FrontendHookSlot hook="blog.footer.before" context={{ title }} />
        <ThemeFooterItems items={footerItems} />
        <TermLinks terms={terms} showType />
        <FrontendHookSlot hook="blog.footer.filing" context={{ title }} />
        <FrontendHookSlot hook="blog.footer.after" context={{ title }} />
      </footer>
      <FrontendHookSlot hook="blog.body.end" context={{ title }} />
    </div>
  );
}


type FooterItem = {
  label: string;
  href?: string;
  icon?: string;
};

function ThemeFooterItems({ items }: { items: unknown }) {
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
export { FrontendHookSlot };

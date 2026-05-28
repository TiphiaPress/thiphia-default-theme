import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { FrontendHookSlot, useFrontendHeadEffects } from "../../framework/plugin-hooks";
import { externalWarningPath, shouldWarnExternalLink } from "./externalLinks";
import type { TermResponse } from "../../blog/types";
import { SiteAvatar } from "./components/SiteAvatar";
import { TermLinks } from "./components/TermLinks";
import { ThemeFooterItems } from "./components/ThemeFooterItems";
import { UpyunFooter } from "./components/UpyunFooter";
import { PoweredByTiphia } from "./components/PoweredByTiphia";
import { CookieNotice } from "./components/CookieNotice";
import { DefaultBootstrapLoading } from "./components/BootstrapLoading";
import { LocalStyleSwitcher, readLocalThemeStyle, saveLocalAccent, saveLocalLiquidGlass, saveLocalThemeAppearance, themeAccent } from "./components/LocalStyleSwitcher";
import { ScrollTools } from "./components/ScrollTools";
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
  const showUpyun = config.show_upyun === true;
  const fallbackAppearance = themeAppearance(config);
  const fallbackLiquidGlass = config.liquid_glass === true;
  const fallbackAccent = themeAccent(config);
  const [localStyle, setLocalStyle] = useState(() => readLocalThemeStyle(fallbackAppearance, fallbackLiquidGlass, fallbackAccent));
  const appearance = localStyle.appearance;
  useFrontendHeadEffects({ title, description, baseUrl });

  useEffect(() => {
    setLocalStyle((current) => {
      if (current.appearanceOverridden || current.glassOverridden || current.accentOverridden) {
        return current;
      }
      return readLocalThemeStyle(fallbackAppearance, fallbackLiquidGlass, fallbackAccent);
    });
  }, [fallbackAppearance, fallbackLiquidGlass, fallbackAccent]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-liquid-glass", localStyle.liquidGlass);
    root.style.setProperty("--accent", localStyle.accent);
  }, [localStyle.liquidGlass, localStyle.accent]);

  return (
    <div className={`site default-theme theme-appearance-${appearance}`} data-appearance={appearance} onClick={(event) => handleExternalLinkClick(event, baseUrl)}>
      <FrontendHookSlot hook="blog.body.start" context={{ title }} />
      <FrontendHookSlot hook="blog.header.before" context={{ title }} />
      <header className="site-header">
        <Link to="/" className="site-title">
          <SiteAvatar avatarUrl={avatarUrl} baseUrl={baseUrl} title={title} size="small" />
          {title}
        </Link>
        <nav>
          <NavLink to="/">首页</NavLink>
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
        <TermLinks terms={terms.filter((term) => term.term_type === "tag")} config={config} />
        <FrontendHookSlot hook="blog.footer.filing" context={{ title }} />
        <FrontendHookSlot hook="blog.footer.after" context={{ title }} />
        <PoweredByTiphia />
        {showUpyun ? <UpyunFooter /> : null}
        <div hidden><a href="https://2x.nz " target="_blank">二叉树树</a></div>
      </footer>
      <CookieNotice config={config} />
      <LocalStyleSwitcher
        value={localStyle}
        defaultAccent={fallbackAccent}
        onAppearanceChange={(value) => {
          saveLocalThemeAppearance(value);
          setLocalStyle(readLocalThemeStyle(fallbackAppearance, fallbackLiquidGlass, fallbackAccent));
        }}
        onLiquidGlassChange={(value) => {
          saveLocalLiquidGlass(value);
          setLocalStyle(readLocalThemeStyle(fallbackAppearance, fallbackLiquidGlass, fallbackAccent));
        }}
        onAccentChange={(value) => {
          saveLocalAccent(value);
          setLocalStyle(readLocalThemeStyle(fallbackAppearance, fallbackLiquidGlass, fallbackAccent));
        }}
      />
      <ScrollTools />
      <FrontendHookSlot hook="blog.body.end" context={{ title }} />
    </div>
  );
}

function themeAppearance(config: Record<string, unknown>) {
  const value = config.appearance;
  return value === "dark" || value === "light" || value === "system" ? value : "system";
}

function handleExternalLinkClick(event: React.MouseEvent<HTMLDivElement>, baseUrl?: string | null) {
  const anchor = (event.target as HTMLElement).closest("a");
  if (!anchor || event.defaultPrevented) {
    return;
  }
  if (shouldWarnExternalLink(anchor, baseUrl)) {
    event.preventDefault();
    window.location.assign(externalWarningPath(anchor.href));
  }
}

export { FrontendHookSlot };

import { DefaultThemeConfigPanel } from "./ThemeConfigPanel";
import defaultFaviconUrl from "./favicon.ico";
import { DefaultExternalWarningView } from "./ExternalWarningPage";
import { PostCard, PostStats } from "./components/PostCard";
import { State } from "./components/State";
import { PopularPosts, RecentComments } from "./components/Widgets";
import {
  DefaultArticleView,
  DefaultCommentFormView,
  DefaultCommentItemView,
  DefaultCommentsView,
  DefaultHomeView,
  DefaultPlainPageView,
  DefaultRegisterView,
  DefaultTermArchiveView,
  DefaultTermDirectoryView,
  DefaultTimelineView,
  DefaultNotFoundView,
} from "./views";
import type { BlogTheme } from "../types";

export const defaultTheme: BlogTheme = {
  name: "default",
  faviconUrl: defaultFaviconUrl,
  ConfigPanel: DefaultThemeConfigPanel,
  BootstrapLoading: DefaultBootstrapLoading,
  Layout: DefaultThemeLayout,
  views: {
    State,
    PostCard,
    PostStats,
    PopularPosts,
    RecentComments,
    Home: DefaultHomeView,
    Article: DefaultArticleView,
    PlainPage: DefaultPlainPageView,
    TermDirectory: DefaultTermDirectoryView,
    TermArchive: DefaultTermArchiveView,
    Timeline: DefaultTimelineView,
    Register: DefaultRegisterView,
    Comments: DefaultCommentsView,
    CommentItem: DefaultCommentItemView,
    ExternalWarning: DefaultExternalWarningView,
    NotFound: DefaultNotFoundView,
    CommentForm: DefaultCommentFormView,
  },
};

export default defaultTheme;






















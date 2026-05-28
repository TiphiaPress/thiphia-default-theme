import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { ThemeConfigPanelProps } from "../types";

interface NavPageForm {
  label: string;
  slug: string;
  display: "article" | "plain";
}

interface FooterItemForm {
  label: string;
  href: string;
  icon: string;
}

interface DefaultThemeConfigForm {
  accent: string;
  appearance: "system" | "light" | "dark";
  font_family: string;
  liquid_glass: boolean;
  posts_per_page: string;
  show_popular_posts: boolean;
  popular_posts_limit: string;
  show_recent_comments: boolean;
  recent_comments_limit: string;
  footer_tag_limit: string;
  show_upyun: boolean;
  announcement_enabled: boolean;
  announcement_title: string;
  announcement_content: string;
  announcement_url: string;
  announcement_link_text: string;
  cookie_notice: boolean;
  cookie_notice_text: string;
  cookie_notice_accept_text: string;
  cookie_notice_policy_url: string;
  pinned_post_ids: string;
  pinned_post_slugs: string;
  nav_pages: NavPageForm[];
  footer_items: FooterItemForm[];
  custom_css: string;
}

const emptyNavPage: NavPageForm = { label: "", slug: "", display: "article" };
const emptyFooterItem: FooterItemForm = { label: "", href: "", icon: "" };

export function DefaultThemeConfigPanel({ value, saving, error, onSubmit }: ThemeConfigPanelProps) {
  const [form, setForm] = useState<DefaultThemeConfigForm>(() => readConfig(value));

  useEffect(() => {
    setForm(readConfig(value));
  }, [value]);

  return (
    <form
      className="plugin-config-panel theme-config-panel"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(toConfig(form));
      }}
    >
      <div className="config-panel-header">
        <div>
          <h2>默认主题配置</h2>
          <p>通过主题自带面板调整首页、导航、页脚、置顶文章和视觉样式。</p>
        </div>
        <span className="badge approved">default</span>
      </div>

      <section className="editable-row">
        <h3>视觉</h3>
        <div className="config-grid">
          <label className="field">
            <span>强调色</span>
            <input type="color" value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} />
          </label>
          <label className="field">
            <span>主题模式</span>
            <select value={form.appearance} onChange={(event) => setForm({ ...form, appearance: event.target.value as DefaultThemeConfigForm["appearance"] })}>
              <option value="system">跟随浏览器</option>
              <option value="light">浅色模式</option>
              <option value="dark">暗黑模式</option>
            </select>
          </label>
          <label className="field">
            <span>字体</span>
            <input
              value={form.font_family}
              placeholder="Inter, system-ui, sans-serif"
              onChange={(event) => setForm({ ...form, font_family: event.target.value })}
            />
          </label>
        </div>
        <div className="check-list plain">
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.liquid_glass}
              onChange={(event) => setForm({ ...form, liquid_glass: event.target.checked })}
            />
            开启 Liquid Glass 样式
          </label>
        </div>
        <label className="field">
          <span>自定义 CSS</span>
          <textarea rows={5} value={form.custom_css} onChange={(event) => setForm({ ...form, custom_css: event.target.value })} />
          <small>仅作用于前台主题，适合少量视觉微调。</small>
        </label>
      </section>

      <section className="editable-row">
        <h3>首页与列表</h3>
        <div className="config-grid">
          <label className="field">
            <span>每页文章数</span>
            <input value={form.posts_per_page} onChange={(event) => setForm({ ...form, posts_per_page: event.target.value })} />
          </label>
          <label className="field">
            <span>页脚标签数量</span>
            <input value={form.footer_tag_limit} onChange={(event) => setForm({ ...form, footer_tag_limit: event.target.value })} />
          </label>
          <label className="field">
            <span>热门文章数量</span>
            <input value={form.popular_posts_limit} onChange={(event) => setForm({ ...form, popular_posts_limit: event.target.value })} />
          </label>
          <label className="field">
            <span>最新评论数量</span>
            <input value={form.recent_comments_limit} onChange={(event) => setForm({ ...form, recent_comments_limit: event.target.value })} />
          </label>
        </div>
        <div className="check-list plain">
          <label className="check-row">
            <input type="checkbox" checked={form.show_popular_posts} onChange={(event) => setForm({ ...form, show_popular_posts: event.target.checked })} />
            显示热门文章
          </label>
          <label className="check-row">
            <input type="checkbox" checked={form.show_recent_comments} onChange={(event) => setForm({ ...form, show_recent_comments: event.target.checked })} />
            显示最新评论
          </label>
          <label className="check-row">
            <input type="checkbox" checked={form.show_upyun} onChange={(event) => setForm({ ...form, show_upyun: event.target.checked })} />
            页脚展示又拍云联盟信息
          </label>
        </div>
      </section>

      <section className="editable-row">
        <h3>站点公告</h3>
        <div className="check-list plain">
          <label className="check-row">
            <input type="checkbox" checked={form.announcement_enabled} onChange={(event) => setForm({ ...form, announcement_enabled: event.target.checked })} />
            在首页展示公告
          </label>
        </div>
        <div className="config-grid">
          <label className="field">
            <span>公告标题</span>
            <input value={form.announcement_title} placeholder="站点公告" onChange={(event) => setForm({ ...form, announcement_title: event.target.value })} />
          </label>
          <label className="field">
            <span>链接文字</span>
            <input value={form.announcement_link_text} placeholder="查看详情" onChange={(event) => setForm({ ...form, announcement_link_text: event.target.value })} />
          </label>
        </div>
        <label className="field">
          <span>公告内容</span>
          <textarea rows={3} value={form.announcement_content} onChange={(event) => setForm({ ...form, announcement_content: event.target.value })} />
        </label>
        <label className="field">
          <span>公告链接 URL</span>
          <input value={form.announcement_url} placeholder="/posts/hello-world" onChange={(event) => setForm({ ...form, announcement_url: event.target.value })} />
          <small>可选，支持站内路径或外部链接。</small>
        </label>
      </section>
      <section className="editable-row">
        <h3>Cookie 提示</h3>
        <div className="check-list plain">
          <label className="check-row">
            <input type="checkbox" checked={form.cookie_notice} onChange={(event) => setForm({ ...form, cookie_notice: event.target.checked })} />
            首次访问时展示 Cookie 提示
          </label>
        </div>
        <label className="field">
          <span>提示文本</span>
          <textarea rows={3} value={form.cookie_notice_text} onChange={(event) => setForm({ ...form, cookie_notice_text: event.target.value })} />
        </label>
        <div className="config-grid">
          <label className="field">
            <span>按钮文字</span>
            <input value={form.cookie_notice_accept_text} onChange={(event) => setForm({ ...form, cookie_notice_accept_text: event.target.value })} />
          </label>
          <label className="field">
            <span>隐私说明 URL</span>
            <input value={form.cookie_notice_policy_url} placeholder="/pages/privacy" onChange={(event) => setForm({ ...form, cookie_notice_policy_url: event.target.value })} />
            <small>可选，填写后会显示“了解更多”链接。</small>
          </label>
        </div>
      </section>

      <section className="editable-row">
        <h3>置顶文章</h3>
        <div className="config-grid">
          <label className="field">
            <span>文章 ID</span>
            <input
              value={form.pinned_post_ids}
              placeholder="1, 2, 3"
              onChange={(event) => setForm({ ...form, pinned_post_ids: event.target.value })}
            />
          </label>
          <label className="field">
            <span>文章 Slug</span>
            <input
              value={form.pinned_post_slugs}
              placeholder="hello-world, about"
              onChange={(event) => setForm({ ...form, pinned_post_slugs: event.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="editable-row">
        <div className="row-footer compact">
          <h3>右上角页面导航</h3>
          <button type="button" className="button subtle" onClick={() => setForm({ ...form, nav_pages: [...form.nav_pages, emptyNavPage] })}>
            <Plus size={16} />
            添加页面
          </button>
        </div>
        {form.nav_pages.map((page, index) => (
          <div className="config-grid" key={index}>
            <label className="field">
              <span>名称</span>
              <input value={page.label} onChange={(event) => updateNavPage(index, { label: event.target.value })} />
            </label>
            <label className="field">
              <span>Slug</span>
              <input value={page.slug} onChange={(event) => updateNavPage(index, { slug: event.target.value })} />
            </label>
            <label className="field">
              <span>展示方式</span>
              <select value={page.display} onChange={(event) => updateNavPage(index, { display: event.target.value as NavPageForm["display"] })}>
                <option value="article">文章样式</option>
                <option value="plain">纯文本</option>
              </select>
            </label>
            <div className="field action-field">
              <span>&nbsp;</span>
              <button type="button" className="button danger" onClick={() => removeNavPage(index)}>
                <Trash2 size={16} />
                删除
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="editable-row">
        <div className="row-footer compact">
          <h3>页脚链接</h3>
          <button type="button" className="button subtle" onClick={() => setForm({ ...form, footer_items: [...form.footer_items, emptyFooterItem] })}>
            <Plus size={16} />
            添加链接
          </button>
        </div>
        {form.footer_items.map((item, index) => (
          <div className="config-grid" key={index}>
            <label className="field">
              <span>名称</span>
              <input value={item.label} onChange={(event) => updateFooterItem(index, { label: event.target.value })} />
            </label>
            <label className="field">
              <span>URL</span>
              <input value={item.href} onChange={(event) => updateFooterItem(index, { href: event.target.value })} />
            </label>
            <label className="field">
              <span>图标</span>
              <input value={item.icon} placeholder="github / rss / mail" onChange={(event) => updateFooterItem(index, { icon: event.target.value })} />
            </label>
            <div className="field action-field">
              <span>&nbsp;</span>
              <button type="button" className="button danger" onClick={() => removeFooterItem(index)}>
                <Trash2 size={16} />
                删除
              </button>
            </div>
          </div>
        ))}
      </section>

      {error instanceof Error ? <p className="error-text">{error.message}</p> : null}
      <div className="form-actions">
        <button type="submit" disabled={saving}>{saving ? "保存中..." : "保存配置"}</button>
      </div>
    </form>
  );

  function updateNavPage(index: number, patch: Partial<NavPageForm>) {
    setForm((current) => ({
      ...current,
      nav_pages: current.nav_pages.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function removeNavPage(index: number) {
    setForm((current) => ({ ...current, nav_pages: current.nav_pages.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateFooterItem(index: number, patch: Partial<FooterItemForm>) {
    setForm((current) => ({
      ...current,
      footer_items: current.footer_items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function removeFooterItem(index: number) {
    setForm((current) => ({ ...current, footer_items: current.footer_items.filter((_, itemIndex) => itemIndex !== index) }));
  }
}

function readConfig(value: Record<string, unknown>): DefaultThemeConfigForm {
  return {
    accent: stringValue(value.accent) || "#2563eb",
    appearance: appearanceValue(value.appearance),
    font_family: stringValue(value.font_family),
    liquid_glass: booleanValue(value.liquid_glass),
    posts_per_page: numberString(value.posts_per_page),
    show_popular_posts: booleanValue(value.show_popular_posts),
    popular_posts_limit: numberString(value.popular_posts_limit),
    show_recent_comments: booleanValue(value.show_recent_comments),
    recent_comments_limit: numberString(value.recent_comments_limit),
    footer_tag_limit: numberString(value.footer_tag_limit),
    show_upyun: booleanValue(value.show_upyun),
    announcement_enabled: booleanValue(value.announcement_enabled),
    announcement_title: stringValue(value.announcement_title),
    announcement_content: stringValue(value.announcement_content),
    announcement_url: stringValue(value.announcement_url),
    announcement_link_text: stringValue(value.announcement_link_text),
    cookie_notice: booleanValue(value.cookie_notice),
    cookie_notice_text: stringValue(value.cookie_notice_text),
    cookie_notice_accept_text: stringValue(value.cookie_notice_accept_text),
    cookie_notice_policy_url: stringValue(value.cookie_notice_policy_url),
    pinned_post_ids: arrayToText(value.pinned_post_ids),
    pinned_post_slugs: arrayToText(value.pinned_post_slugs),
    nav_pages: readNavPages(value.nav_pages),
    footer_items: readFooterItems(value.footer_items),
    custom_css: stringValue(value.custom_css),
  };
}

function toConfig(form: DefaultThemeConfigForm) {
  return compactRecord({
    accent: form.accent.trim() || "#2563eb",
    appearance: form.appearance,
    font_family: form.font_family.trim(),
    liquid_glass: form.liquid_glass,
    posts_per_page: positiveNumber(form.posts_per_page),
    show_popular_posts: form.show_popular_posts,
    popular_posts_limit: positiveNumber(form.popular_posts_limit),
    show_recent_comments: form.show_recent_comments,
    recent_comments_limit: positiveNumber(form.recent_comments_limit),
    footer_tag_limit: positiveNumber(form.footer_tag_limit),
    show_upyun: form.show_upyun,
    announcement_enabled: form.announcement_enabled,
    announcement_title: form.announcement_title.trim(),
    announcement_content: form.announcement_content.trim(),
    announcement_url: form.announcement_url.trim(),
    announcement_link_text: form.announcement_link_text.trim(),
    cookie_notice: form.cookie_notice,
    cookie_notice_text: form.cookie_notice_text.trim(),
    cookie_notice_accept_text: form.cookie_notice_accept_text.trim(),
    cookie_notice_policy_url: form.cookie_notice_policy_url.trim(),
    pinned_post_ids: numberList(form.pinned_post_ids),
    pinned_post_slugs: stringList(form.pinned_post_slugs),
    nav_pages: form.nav_pages
      .map((item) => ({ label: item.label.trim(), slug: item.slug.trim(), display: item.display }))
      .filter((item) => item.label && item.slug),
    footer_items: form.footer_items
      .map((item) => ({ label: item.label.trim(), href: item.href.trim(), icon: item.icon.trim() }))
      .filter((item) => item.label && item.href),
    custom_css: form.custom_css.trim(),
  });
}

function readNavPages(value: unknown): NavPageForm[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const label = stringValue(item.label);
    const slug = stringValue(item.slug);
    if (!label && !slug) {
      return [];
    }
    return [{ label, slug, display: item.display === "plain" ? "plain" : "article" }];
  });
}

function readFooterItems(value: unknown): FooterItemForm[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const label = stringValue(item.label);
    const href = stringValue(item.href);
    if (!label && !href) {
      return [];
    }
    return [{ label, href, icon: stringValue(item.icon) }];
  });
}

function compactRecord(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === "" || item === null || item === undefined) {
        return false;
      }
      if (Array.isArray(item) && item.length === 0) {
        return false;
      }
      return true;
    }),
  );
}

function appearanceValue(value: unknown): DefaultThemeConfigForm["appearance"] {
  return value === "dark" || value === "light" || value === "system" ? value : "system";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function booleanValue(value: unknown) {
  return value === true;
}

function numberString(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : stringValue(value);
}

function positiveNumber(value: string) {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
}

function arrayToText(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function numberList(value: string) {
  return value
    .split(/[，,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function stringList(value: string) {
  return value
    .split(/[，,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}










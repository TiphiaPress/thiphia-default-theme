import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FrontendHookSlot, type FrontendHook } from "../../../framework/plugin-hooks";
import { stripHtml } from "../../../blog/lib/text";
import type { ThemeNavPage } from "../../../blog/lib/theme";
import type { PostResponse } from "../../../blog/types";
import { PostStats } from "../components/PostCard";
import { ArrowLeft } from "lucide-react";

export function DefaultArticleView({
  post,
  showComments,
  comments,
  customPage,
}: {
  post: PostResponse;
  showComments?: boolean;
  comments?: ReactNode;
  customPage?: { slug: string; navPage?: ThemeNavPage };
}) {
  return (
    <article className="article">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> 返回首页</Link>
      <h1>{post.title}</h1>
      <time>{new Date(post.published_at || post.created_at).toLocaleString()}</time>
      <PostStats post={post} />
      <FrontendHookSlot hook="blog.post.content.before" context={{ post }} />
      <div className="content" dangerouslySetInnerHTML={{ __html: enhanceImageCaptions(post.html) }} />
      {customPage ? (
        <>
          <FrontendHookSlot hook="blog.custom-page.after" context={{ post, ...customPage }} />
          <FrontendHookSlot hook={customPageHook(customPage.slug)} context={{ post, ...customPage }} />
        </>
      ) : null}
      <FrontendHookSlot hook="blog.post.content.after" context={{ post }} />
      {showComments ? comments : null}
    </article>
  );
}

export function DefaultPlainPageView({ post, slug, navPage }: { post: PostResponse; slug: string; navPage?: ThemeNavPage }) {
  return (
    <article className="article theme-page plain">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> 返回首页</Link>
      <h1>{post.title}</h1>
      <div className="content">{stripHtml(post.html)}</div>
      <FrontendHookSlot hook="blog.custom-page.after" context={{ post, slug, navPage }} />
      <FrontendHookSlot hook={customPageHook(slug)} context={{ post, slug, navPage }} />
    </article>
  );
}

function enhanceImageCaptions(html: string) {
  if (typeof window === "undefined" || !html.includes("<img")) {
    return html;
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("img[alt]").forEach((image) => {
    const alt = image.getAttribute("alt")?.trim();
    if (!alt || image.closest("figure")) {
      return;
    }

    const figure = document.createElement("figure");
    figure.className = "theme-image-figure";
    const caption = document.createElement("figcaption");
    caption.textContent = alt;

    image.replaceWith(figure);
    figure.append(image, caption);
  });

  return template.innerHTML;
}
function customPageHook(slug: string): FrontendHook {
  return ("blog.custom-page." + slug) as FrontendHook;
}




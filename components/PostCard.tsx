import { Link } from "react-router-dom";
import { FrontendHookSlot } from "../../../framework/plugin-hooks";
import { stripHtml } from "../../../blog/lib/text";
import type { PostResponse } from "../../../blog/types";

export function PostCard({ post, pinned = false }: { post: PostResponse; pinned?: boolean }) {
  return (
    <article className="post-card">
      <FrontendHookSlot hook="blog.post.card.before" context={{ post }} />
      <div className="post-card-meta-line">
        <time>{new Date(post.published_at || post.created_at).toLocaleDateString()}</time>
        {pinned ? <span className="pinned-badge">置顶</span> : null}
      </div>
      <h2>
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <PostStats post={post} />
      <p>{post.excerpt || stripHtml(post.html).slice(0, 180)}</p>
      <FrontendHookSlot hook="blog.post.card.after" context={{ post }} />
    </article>
  );
}

export function PostStats({ post }: { post: PostResponse }) {
  return (
    <div className="post-stats">
      <span>{post.view_count} 次浏览</span>
      <span>{post.comment_count} 条评论</span>
      <FrontendHookSlot hook="blog.post.meta.after" context={{ post }} />
    </div>
  );
}
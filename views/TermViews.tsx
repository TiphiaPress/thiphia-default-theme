import { Link } from "react-router-dom";
import type { Page, PostResponse, TermResponse } from "../../../blog/types";
import { PostCard } from "../components/PostCard";
import { State } from "../components/State";
import { Pagination } from "./Pagination";

export function DefaultTermDirectoryView({ type, terms }: { type: "category" | "tag"; terms: TermResponse[] }) {
  const title = type === "category" ? "分类" : "标签";
  const description = type === "category" ? "按主题浏览文章集合" : "按关键词发现相关内容";
  return (
    <section className="directory">
      <div className="hero compact-hero">
        <Link className="back-link" to="/">返回首页</Link>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {terms.length ? (
        <div className="term-grid">
          {terms.map((term) => (
            <Link key={term.id} className="term-tile" to={"/terms/" + term.id}>
              <span>{term.name}</span>
              <small>{term.description || term.slug}</small>
              <strong>{term.post_count} 篇文章</strong>
            </Link>
          ))}
        </div>
      ) : (
        <State text={"还没有" + title} />
      )}
    </section>
  );
}

export function DefaultTermArchiveView({
  term,
  termId,
  posts,
  onPageChange,
}: {
  term?: TermResponse;
  termId: number;
  posts: Page<PostResponse>;
  pinnedPosts?: PostResponse[];
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="post-list">
      <div className="hero compact-hero">
        <Link className="back-link" to="/">返回首页</Link>
        <div className="term-heading">
          <span>{term?.term_type === "tag" ? "标签" : "分类"}</span>
          <h1>{term?.name || "归档 #" + termId}</h1>
        </div>
        <p>{term?.description || "按分类或标签浏览文章"}</p>
      </div>
      {posts.data.length ? (
        <>
          {posts.data.map((post) => <PostCard key={post.id} post={post} />)}
          <Pagination page={posts.meta.page} totalPages={posts.meta.total_pages} onPageChange={onPageChange} />
        </>
      ) : (
        <State text="这个归档下还没有公开文章" />
      )}
    </section>
  );
}

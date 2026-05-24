import { Link } from "react-router-dom";
import type { PostResponse } from "../../../blog/types";
import { State } from "../components/State";

export function DefaultTimelineView({ groups }: { groups: Array<{ key: string; label: string; posts: PostResponse[] }> }) {
  return (
    <section className="timeline">
      <div className="hero compact-hero">
        <Link className="back-link" to="/">返回首页</Link>
        <h1>时间线</h1>
        <p>按发布时间回看所有公开文章</p>
      </div>
      {groups.length ? (
        <div className="timeline-list">
          {groups.map((group) => (
            <section key={group.key} className="timeline-group">
              <h2>{group.label}</h2>
              <div>
                {group.posts.map((post) => (
                  <Link key={post.id} className="timeline-item" to={"/posts/" + post.slug}>
                    <time>{new Date(post.published_at || post.created_at).toLocaleDateString()}</time>
                    <span>{post.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <State text="还没有公开文章" />
      )}
    </section>
  );
}



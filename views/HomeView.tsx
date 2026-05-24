import { FrontendHookSlot } from "../../../framework/plugin-hooks";
import type { Page, PostResponse, RecentComment, SiteSettings } from "../../../blog/types";
import { SiteAvatar } from "../components/SiteAvatar";
import { PostCard } from "../components/PostCard";
import { PopularPosts, RecentComments } from "../components/Widgets";
import { State } from "../components/State";
import { Pagination } from "./Pagination";
import { isPinnedPost, mergePinnedPosts } from "./pinnedPosts";

export function DefaultHomeView({
  settings,
  q,
  onQueryChange,
  onSearch,
  posts,
  pinnedPosts = [],
  onPageChange,
  showPopularPosts,
  showRecentComments,
  popularPosts,
  recentComments,
  popularPostsLoading,
  recentCommentsLoading,
}: {
  settings?: SiteSettings;
  q: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  posts: Page<PostResponse>;
  pinnedPosts?: PostResponse[];
  page: number;
  onPageChange: (page: number) => void;
  showPopularPosts: boolean;
  showRecentComments: boolean;
  popularPosts: PostResponse[];
  recentComments: RecentComment[];
  popularPostsLoading: boolean;
  recentCommentsLoading: boolean;
}) {
  const orderedPosts = mergePinnedPosts(posts.data, pinnedPosts, settings?.theme.config || {});

  return (
    <section className="post-list">
      <FrontendHookSlot hook="blog.home.before" context={{ settings }} />
      <div className="hero">
        <SiteAvatar avatarUrl={settings?.avatar_url} baseUrl={settings?.base_url} title={settings?.title || "Tiphia"} />
        <h1>{settings?.title || "Tiphia"}</h1>
        <p>{settings?.description || "A Rust blog powered by Tiphia."}</p>
      </div>
      <FrontendHookSlot hook="blog.home.hero.after" context={{ settings }} />
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <input placeholder="搜索文章" value={q} onChange={(event) => onQueryChange(event.target.value)} />
        <button type="submit">搜索</button>
      </form>
      <FrontendHookSlot hook="blog.search.after" context={{ q }} />
      {showPopularPosts || showRecentComments ? (
        <aside className="home-widgets">
          {showPopularPosts ? <PopularPosts posts={popularPosts} loading={popularPostsLoading} /> : null}
          {showRecentComments ? <RecentComments comments={recentComments} loading={recentCommentsLoading} /> : null}
        </aside>
      ) : null}
      {posts.data.length ? (
        <>
          <FrontendHookSlot hook="blog.post.list.before" context={{ posts: posts.data }} />
          {orderedPosts.map((post) => <PostCard key={post.id} post={post} pinned={isPinnedPost(post, settings?.theme.config || {})} />)}
          <FrontendHookSlot hook="blog.post.list.after" context={{ posts: posts.data }} />
          <Pagination page={posts.meta.page} totalPages={posts.meta.total_pages} onPageChange={onPageChange} />
        </>
      ) : (
        <State text="还没有公开文章" />
      )}
      <FrontendHookSlot hook="blog.home.after" context={{ settings }} />
    </section>
  );
}


import type { PostResponse } from "../../../blog/types";

export function mergePinnedPosts(posts: PostResponse[], pinnedPosts: PostResponse[], config: Record<string, unknown>) {
  const merged = new Map<number, PostResponse>();
  orderPostsByPin(pinnedPosts, config).forEach((post) => merged.set(post.id, post));
  posts.forEach((post) => merged.set(post.id, post));
  return orderPostsByPin(Array.from(merged.values()), config);
}

export function orderPostsByPin(posts: PostResponse[], config: Record<string, unknown>) {
  const pinnedIds = readPinnedIds(config.pinned_post_ids);
  const pinnedSlugs = readPinnedSlugs(config.pinned_post_slugs);
  if (pinnedIds.length === 0 && pinnedSlugs.length === 0) {
    return posts;
  }
  return [...posts].sort((left, right) => pinRank(left, pinnedIds, pinnedSlugs) - pinRank(right, pinnedIds, pinnedSlugs));
}

export function isPinnedPost(post: PostResponse, config: Record<string, unknown>) {
  return pinRank(post, readPinnedIds(config.pinned_post_ids), readPinnedSlugs(config.pinned_post_slugs)) < Number.MAX_SAFE_INTEGER;
}

function pinRank(post: PostResponse, ids: number[], slugs: string[]) {
  const idIndex = ids.indexOf(post.id);
  if (idIndex >= 0) {
    return idIndex;
  }
  const slugIndex = slugs.indexOf(post.slug);
  return slugIndex >= 0 ? ids.length + slugIndex : Number.MAX_SAFE_INTEGER;
}

function readPinnedIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    const id = typeof item === "number" ? item : typeof item === "string" ? Number(item) : NaN;
    return Number.isInteger(id) && id > 0 ? [id] : [];
  });
}

function readPinnedSlugs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim()] : []));
}

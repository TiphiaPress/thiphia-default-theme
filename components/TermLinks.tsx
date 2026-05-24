import { Link } from "react-router-dom";
import type { TermResponse } from "../../../blog/types";

const DEFAULT_FOOTER_TAG_LIMIT = 18;

export function TermLinks({ terms, config = {} }: { terms: TermResponse[]; config?: Record<string, unknown> }) {
  const visibleTerms = selectFooterTerms(terms, config);
  if (visibleTerms.length === 0) {
    return null;
  }

  return (
    <div className="term-cloud">
      {visibleTerms.map((term) => (
        <Link key={term.id} to={`/terms/${term.id}`}>
          {term.name}
          <span>{term.post_count}</span>
        </Link>
      ))}
    </div>
  );
}

function selectFooterTerms(terms: TermResponse[], config: Record<string, unknown>) {
  const limit = readPositiveInteger(config.footer_tag_limit, DEFAULT_FOOTER_TAG_LIMIT, 6, 60);
  const usefulTerms = terms.filter((term) => term.post_count > 0);
  const popularCount = Math.max(1, Math.ceil(limit * 0.7));
  const popular = [...usefulTerms]
    .sort((left, right) => right.post_count - left.post_count || newestFirst(left, right))
    .slice(0, popularCount);
  const recent = [...usefulTerms]
    .sort(newestFirst)
    .slice(0, limit - popular.length + 4);

  const byId = new Map<number, TermResponse>();
  [...popular, ...recent].forEach((term) => byId.set(term.id, term));
  return Array.from(byId.values())
    .sort((left, right) => right.post_count - left.post_count || newestFirst(left, right))
    .slice(0, limit);
}

function newestFirst(left: TermResponse, right: TermResponse) {
  return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
}

function readPositiveInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
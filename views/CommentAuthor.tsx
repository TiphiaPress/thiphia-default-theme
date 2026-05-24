import type { CommentNode } from "../../../blog/types";
import { normalizedHttpUrl } from "../../../blog/lib/url";
import { gravatarUrl } from "../gravatar";

export function CommentAuthor({ comment, gravatarBaseUrl }: { comment: CommentNode; gravatarBaseUrl?: string | null }) {
  const href = normalizedHttpUrl(comment.author_url);
  const avatar = gravatarUrl(comment.author_email, gravatarBaseUrl);
  const name = href ? (
    <a className="comment-author" href={href} target="_blank" rel="noreferrer noopener">{comment.author_name}</a>
  ) : (
    <strong className="comment-author-name">{comment.author_name}</strong>
  );
  return (
    <div className="comment-author-row">
      {avatar ? <img className="comment-avatar" src={avatar} alt="" loading="lazy" /> : <span className="comment-avatar fallback" />}
      {name}
    </div>
  );
}



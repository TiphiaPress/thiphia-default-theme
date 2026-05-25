import type { FormEvent, ReactNode } from "react";
import { FrontendHookSlot } from "../../../framework/plugin-hooks";
import type { CommentFormState } from "../../../blog/hooks/useRememberedCommentForm";
import type { CommentNode } from "../../../blog/types";
import { CommentAuthor } from "./CommentAuthor";

export function DefaultCommentsView({ postId, comments, children, form }: { postId: number; comments: CommentNode[]; children: ReactNode; form: ReactNode }) {
  return (
    <section className="comments">
      <h2>评论</h2>
      <FrontendHookSlot hook="blog.comment.list.before" context={{ postId, comments }} />
      {comments.length ? children : <p>暂无评论</p>}
      <FrontendHookSlot hook="blog.comment.list.after" context={{ postId, comments }} />
      {form}
    </section>
  );
}

export function DefaultCommentItemView({ comment, replying, onToggleReply, replyForm, children, depth = 1, gravatarBaseUrl }: {
  comment: CommentNode;
  replying: boolean;
  onToggleReply: () => void;
  replyForm?: ReactNode;
  children?: ReactNode;
  depth?: number;
  gravatarBaseUrl?: string | null;
}) {
  return (
    <div className={"comment comment-depth-" + depth}>
      <CommentAuthor comment={comment} gravatarBaseUrl={gravatarBaseUrl} />
      <p>{comment.content}</p>
      <button className="text-button" type="button" onClick={onToggleReply}>{replying ? "取消回复" : "回复"}</button>
      {replying ? replyForm : null}
      {children ? <div className="comment-children">{children}</div> : null}
    </div>
  );
}

export function DefaultCommentFormView({ title, form, pending, error, successText, captchaRequired, captcha, onCaptcha, onFormChange, onSubmit }: {
  title: string;
  form: CommentFormState;
  pending: boolean;
  error: unknown;
  successText: string;
  captchaRequired: boolean;
  captcha?: Record<string, unknown> | null;
  onCaptcha?: (value: Record<string, unknown> | null) => void;
  onFormChange: (form: CommentFormState) => void;
  onSubmit: () => void;
}) {
  return (
    <form className="comment-form" onSubmit={(event: FormEvent) => { event.preventDefault(); onSubmit(); }}>
      <h3>{title}</h3>
      <FrontendHookSlot hook="blog.comment.form.before" context={{ title, form }} />
      <div className="form-row">
        <input placeholder="昵称" value={form.author_name} onChange={(event) => onFormChange({ ...form, author_name: event.target.value })} />
        <input placeholder="邮箱" type="email" value={form.author_email} onChange={(event) => onFormChange({ ...form, author_email: event.target.value })} />
      </div>
      <input placeholder="网址，可选" value={form.author_url} onChange={(event) => onFormChange({ ...form, author_url: event.target.value })} />
      <textarea placeholder="写下你的评论" rows={5} value={form.content} onChange={(event) => onFormChange({ ...form, content: event.target.value })} />
      {captchaRequired ? <FrontendHookSlot hook="blog.comment.captcha" context={{ mode: "comment", title, form, onVerify: onCaptcha }} /> : null}
      {error ? <p className="error-text">{error instanceof Error ? error.message : "评论提交失败"}</p> : null}
      {successText ? <p className="success-text">{successText}</p> : null}
      <FrontendHookSlot hook="blog.comment.form.after" context={{ title, form }} />
      <button type="submit" disabled={pending}>{pending ? "提交中..." : "提交评论"}</button>
    </form>
  );
}





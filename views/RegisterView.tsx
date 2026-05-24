import { Link } from "react-router-dom";
import { FrontendHookSlot } from "../../../framework/plugin-hooks";
import { State } from "../components/State";

interface RegisterFormState {
  username: string;
  email: string;
  display_name: string;
  password: string;
}

export function DefaultRegisterView({
  registrationEnabled,
  form,
  onFormChange,
  onSubmit,
  pending,
  error,
  success,
  captchaRequired,
  captcha,
  onCaptcha,
}: {
  registrationEnabled?: boolean;
  form: RegisterFormState;
  onFormChange: (form: RegisterFormState) => void;
  onSubmit: () => void;
  pending: boolean;
  error?: Error | null;
  success: boolean;
  captchaRequired: boolean;
  captcha: Record<string, unknown> | null;
  onCaptcha: (value: Record<string, unknown> | null) => void;
}) {
  return (
    <section className="auth-page">
      <div className="hero compact-hero">
        <Link className="back-link" to="/">返回首页</Link>
        <h1>注册</h1>
        <p>{registrationEnabled ? "创建一个新的站点账号" : "当前站点未开放公开注册"}</p>
      </div>
      {registrationEnabled === undefined ? (
        <State text="读取注册状态中..." />
      ) : !registrationEnabled ? (
        <State text="当前站点未开放公开注册，请联系站点管理员。" />
      ) : (
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label><span>账号</span><input autoComplete="username" value={form.username} onChange={(event) => onFormChange({ ...form, username: event.target.value })} /></label>
          <label><span>邮箱</span><input type="email" autoComplete="email" value={form.email} onChange={(event) => onFormChange({ ...form, email: event.target.value })} /></label>
          <label><span>显示名</span><input autoComplete="name" value={form.display_name} onChange={(event) => onFormChange({ ...form, display_name: event.target.value })} /></label>
          <label><span>密码</span><input type="password" autoComplete="new-password" value={form.password} onChange={(event) => onFormChange({ ...form, password: event.target.value })} /></label>
          <FrontendHookSlot hook="blog.auth.register.captcha" context={{ mode: "register", onVerify: onCaptcha }} />
          {captchaRequired && !captcha ? <p className="muted">请先完成验证码。</p> : null}
          {error ? <p className="error-text">{error.message}</p> : null}
          {success ? <p className="success-text">注册成功，请前往管理后台登录。</p> : null}
          <button type="submit" disabled={pending}>{pending ? "提交中..." : "注册"}</button>
        </form>
      )}
    </section>
  );
}


import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { FrontendHookSlot } from "../../../framework/plugin-hooks";

export function DefaultNotFoundView({ path }: { path: string }) {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-panel">
        <span className="not-found-kicker">404</span>
        <div className="not-found-icon" aria-hidden="true">
          <Compass size={34} />
        </div>
        <h1 id="not-found-title">页面不存在</h1>
        <p>你访问的页面可能已经移动、删除，或者地址输入有误。</p>
        {path ? <code>{path}</code> : null}
        <FrontendHookSlot hook="blog.not-found" context={{ path }} />
        <div className="not-found-actions">
          <Link to="/" className="button not-found-primary">
            <ArrowLeft size={16} />
            返回首页
          </Link>
          <Link to="/timeline" className="button subtle">
            查看时间线
          </Link>
        </div>
      </div>
    </section>
  );
}

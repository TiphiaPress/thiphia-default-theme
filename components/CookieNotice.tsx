import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "tiphia.default.cookie_notice.accepted";

interface CookieNoticeConfig {
  enabled: boolean;
  text: string;
  acceptText: string;
  policyUrl: string;
}

export function CookieNotice({ config }: { config?: Record<string, unknown> }) {
  const notice = useMemo(() => readCookieNoticeConfig(config || {}), [config]);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    if (!notice.enabled) {
      setAccepted(true);
      return;
    }
    setAccepted(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, [notice.enabled]);

  if (!notice.enabled || accepted) {
    return null;
  }

  return (
    <aside className="cookie-notice" role="region" aria-label="Cookie 提示">
      <p>{notice.text}</p>
      <div className="cookie-notice-actions">
        {notice.policyUrl ? (
          <a href={notice.policyUrl} data-safe-external>
            了解更多
          </a>
        ) : null}
        <button type="button" onClick={() => accept()}>
          {notice.acceptText}
        </button>
      </div>
    </aside>
  );

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setAccepted(true);
  }
}

function readCookieNoticeConfig(config: Record<string, unknown>): CookieNoticeConfig {
  return {
    enabled: config.cookie_notice === true,
    text: stringValue(config.cookie_notice_text) || "本站会使用 Cookie 或本地存储来保存登录状态、评论表单和偏好设置。继续浏览即表示你了解这些基础功能所需的数据存储。",
    acceptText: stringValue(config.cookie_notice_accept_text) || "知道了",
    policyUrl: stringValue(config.cookie_notice_policy_url),
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

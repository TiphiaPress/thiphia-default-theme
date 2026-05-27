interface AnnouncementConfig {
  enabled: boolean;
  title: string;
  content: string;
  url: string;
  linkText: string;
}

export function Announcement({ config }: { config?: Record<string, unknown> }) {
  const announcement = readAnnouncementConfig(config || {});

  if (!announcement.enabled || (!announcement.title && !announcement.content)) {
    return null;
  }

  return (
    <aside className="theme-announcement" aria-label="站点公告">
      <span className="theme-announcement-label">公告</span>
      <div className="theme-announcement-content">
        {announcement.title ? <h2>{announcement.title}</h2> : null}
        {announcement.content ? <p>{announcement.content}</p> : null}
      </div>
      {announcement.url ? (
        <a className="theme-announcement-link" href={announcement.url} data-safe-external>
          {announcement.linkText || "查看详情"}
        </a>
      ) : null}
    </aside>
  );
}

function readAnnouncementConfig(config: Record<string, unknown>): AnnouncementConfig {
  return {
    enabled: config.announcement_enabled === true,
    title: stringValue(config.announcement_title),
    content: stringValue(config.announcement_content),
    url: stringValue(config.announcement_url),
    linkText: stringValue(config.announcement_link_text),
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

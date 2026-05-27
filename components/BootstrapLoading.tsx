function SkeletonLine({ width }: { width?: string }) {
  return <span className="theme-loading-line" style={{ width }} />;
}

function SkeletonPost({ compact }: { compact?: boolean }) {
  return (
    <article className="theme-loading-card">
      <SkeletonLine width="96px" />
      <SkeletonLine width={compact ? "58%" : "76%"} />
      <SkeletonLine width="92%" />
      <SkeletonLine width="64%" />
      <div className="theme-loading-meta">
        <SkeletonLine width="76px" />
        <SkeletonLine width="88px" />
      </div>
    </article>
  );
}

export function DefaultBootstrapLoading() {
  return (
    <div className="site default-theme theme-bootstrap-loading" aria-busy="true" aria-live="polite">
      <header className="theme-loading-shell theme-loading-header">
        <div className="theme-loading-brand">
          <span className="theme-loading-avatar" />
          <div>
            <SkeletonLine width="132px" />
            <SkeletonLine width="96px" />
          </div>
        </div>
        <nav className="theme-loading-nav" aria-hidden="true">
          <SkeletonLine width="48px" />
          <SkeletonLine width="48px" />
          <SkeletonLine width="58px" />
          <SkeletonLine width="68px" />
        </nav>
      </header>
      <main className="theme-loading-shell">
        <section className="theme-loading-hero">
          <span className="theme-loading-avatar large" />
          <SkeletonLine width="46%" />
          <SkeletonLine width="62%" />
        </section>
        <section className="theme-loading-search">
          <SkeletonLine width="100%" />
          <SkeletonLine width="82px" />
        </section>
        <section className="theme-loading-grid">
          <div className="theme-loading-posts">
            <SkeletonPost />
            <SkeletonPost compact />
            <SkeletonPost />
          </div>
          <aside className="theme-loading-side">
            <SkeletonLine width="42%" />
            <SkeletonLine width="88%" />
            <SkeletonLine width="74%" />
            <SkeletonLine width="80%" />
          </aside>
        </section>
      </main>
    </div>
  );
}

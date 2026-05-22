# Tiphia Default Theme

This repository contains the default public blog theme for TiphiaPress. It is designed to be copied or linked into `tiphia-frontend/src/themes/default`.

## Documentation

Full documentation:

https://tiphiapress.github.io/

Useful sections:

- Theme development: https://tiphiapress.github.io/#/themes
- Frontend hooks: https://tiphiapress.github.io/#/frontend-hooks
- API reference: https://tiphiapress.github.io/#/api

## Repository Role

The theme owns public blog layout and decides where frontend plugin Hook slots are rendered. The frontend shell provides data and runtime APIs; the theme provides presentation.

Typical target path inside the frontend repository:

```text
tiphia-frontend/src/themes/default/
  index.tsx
  theme.css
  externalLinks.ts
  ExternalWarningPage.tsx
  README.md
```

Static theme assets should be placed in the frontend public directory:

```text
tiphia-frontend/public/themes/default/favicon.ico
```

The frontend automatically reads the browser tab icon from:

```text
/themes/default/favicon.ico
```

No theme JSON option is required for favicon.

## Supported Hook Slots

The default theme renders these frontend hooks:

- `blog.body.start`
- `blog.body.end`
- `blog.header.before`
- `blog.header.after`
- `blog.nav.after`
- `blog.sidebar`
- `blog.main.before`
- `blog.main.after`
- `blog.footer.before`
- `blog.footer.filing`
- `blog.footer.after`
- `blog.home.hero.after`
- `blog.post.content.before`
- `blog.post.content.after`
- `blog.comment.captcha`
- `blog.comment.form.before`
- `blog.comment.form.after`

## Theme Configuration

The default theme accepts free-form JSON from site settings. Common fields include:

```json
{
  "accent": "#2563eb",
  "font_family": "Inter, system-ui, sans-serif",
  "posts_per_page": 10,
  "show_popular_posts": true,
  "popular_posts_limit": 5,
  "show_recent_comments": true,
  "recent_comments_limit": 5,
  "footer_items": [
    { "label": "GitHub", "href": "https://github.com/TiphiaPress/tiphia", "icon": "github" },
    { "label": "RSS", "href": "/feed.xml", "icon": "rss" }
  ],
  "nav_pages": [
    { "label": "About", "slug": "about", "display": "article" },
    { "label": "Links", "slug": "links", "display": "article" }
  ]
}
```

`footer_items` currently supports `github`, `home`, `mail`, and `rss`; unknown icons fall back to a link icon.

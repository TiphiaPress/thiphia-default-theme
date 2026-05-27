# Default Theme

The default theme owns public blog rendering and chooses where plugin hook slots are rendered. All theme-owned files stay inside this theme package:

```text
src/themes/default/
  index.tsx
  views.tsx
  theme.css
  favicon.ico
  components/
```

The browser tab icon is imported from this directory's `favicon.ico` by the theme registry. Do not put theme assets in `public/`.

Available slots used by this theme:

- `blog.header.before`
- `blog.header.after`
- `blog.nav.after`
- `blog.main.before`
- `blog.main.after`
- `blog.footer.before`
- `blog.footer.after`
- `blog.home.hero.after`
- `blog.post.content.after`
- `blog.comment.form.before`
- `blog.comment.form.after`

Theme authors can add or remove slots in their own theme. The frontend skeleton defines the hook interface; plugins decide what to register into each slot.

## Theme Configuration

The default theme reads free-form JSON from the active theme configuration. Example:

```json
{
  "show_upyun": true,
  "footer_items": [
    { "label": "GitHub", "href": "https://github.com/TiphiaPress/tiphia", "icon": "github" }
  ]
}
```

`show_upyun` controls the Upyun alliance footer. It is hidden unless the value is exactly `true`.

`announcement_enabled` controls the homepage announcement banner. It is hidden unless the value is exactly `true` and either title or content is provided.

`cookie_notice` controls the first-visit cookie notice. It is hidden by default unless the value is exactly `true`. `cookie_notice_text`, `cookie_notice_accept_text`, and `cookie_notice_policy_url` customize the message, button, and optional privacy link.

## Admin Configuration Panel

Default theme provides `ThemeConfigPanel.tsx` and registers it through `ConfigPanel` in `src/themes/index.ts`.
The admin theme page loads this component directly, so users configure the theme through a form instead of editing raw JSON.

A third-party theme can expose the same capability by exporting a React component that matches `ThemeConfigPanelProps` from `src/themes/types.ts`, then registering it on the theme object:

```ts
const myTheme: BlogTheme = {
  name: "my-theme",
  ConfigPanel: MyThemeConfigPanel,
  Layout: MyLayout,
  views,
};
```

The panel receives current config, saving state, error, and an `onSubmit(config)` callback. The submitted object is saved as the theme config in site settings.



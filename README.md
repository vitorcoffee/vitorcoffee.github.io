# Vitor's Notes

Personal site built with [Hugo](https://gohugo.io) and the
[Blowfish](https://blowfish.page) theme. Hosted on GitHub Pages at
<https://vitorcoffee.github.io/>.

## Structure

- `config/_default/` — site configuration (`hugo.toml`, `languages.en.toml`,
  `menus.en.toml`, `markup.toml`, `params.toml`).
- `content/` — Markdown content. New posts go under `content/posts/`.
- `archetypes/` — frontmatter templates for `hugo new`.
- `themes/blowfish/` — Blowfish theme, added as a git submodule.
- `.github/workflows/hugo.yml` — build + deploy workflow.

## Editing

1. Add or edit Markdown files under `content/posts/`.
2. Commit and push to `main`. The workflow will build and deploy.

## Upgrading the theme

```bash
git submodule update --remote --merge
git add themes/blowfish
git commit -m "chore: bump blowfish"
git push
```

## Local preview (optional)

```bash
brew install hugo   # or your platform's package manager
git submodule update --init --recursive
hugo server -D
```

> Local preview is optional — the GitHub Actions workflow builds the site on
> every push to `main`.

---
title: "Shortcodes in Blowfish"
date: 2026-03-02
draft: false
description: "Badges, buttons, icons and the icon-card grid, all without writing HTML."
summary: "A grab bag of the shortcodes that are useful day-to-day."
tags: ["shortcodes", "blowfish"]
categories: ["engineering"]
showHero: false
---

Blowfish ships a small set of opinionated shortcodes. Here are the ones I reach
for first.

## Badges

{{< badge >}}info{{< /badge >}}
{{< badge >}}new{{< /badge >}}
{{< badge >}}deprecated{{< /badge >}}

## Buttons

{{< button href="https://github.com/vitorcoffee" target="_blank" >}}
View on GitHub
{{< /button >}}

{{< button href="/about/" >}}
About this site
{{< /button >}}

## Icons and the lead block

Blowfish's lead paragraph pulls icon-supported emphasis. Pick an icon from the
[FontAwesome 6 set](https://fontawesome.com/icons):

> {{< icon "github" >}} Source code on
> [github.com/vitorcoffee](https://github.com/vitorcoffee).

## Article callouts

The `article` shortcode renders a card linking to another post. The full
syntax is documented on the
[shortcodes reference page](https://blowfish.page/docs/shortcodes/#article).

## Mermaid diagrams

Blowfish renders Mermaid blocks server-side, so the diagram appears as inline
SVG (no JS runtime needed):

```mermaid
flowchart LR
    A[Client] -->|HTTP request| B[API gateway]
    B --> C{Auth}
    C -->|valid| D[Service]
    C -->|invalid| E[401]
```

That's enough to get started. The full list is in the
[shortcodes reference](https://blowfish.page/docs/shortcodes/).

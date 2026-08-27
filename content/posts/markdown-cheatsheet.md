---
title: "Markdown Cheatsheet"
date: 2026-02-14
draft: false
description: "A quick tour of the Markdown features Blowfish renders natively."
summary: "Headings, lists, tables, alerts, and code blocks — what works out of the box."
tags: ["markdown", "writing"]
categories: ["writing"]
showHero: false
---

This post exercises the Markdown features that ship with the Blowfish theme.
Nothing fancy — just to confirm the renderer is happy.

## Headings

Three levels work, deeper levels are folded in the table of contents by default.

## Lists

- One
- Two
  - Nested
  - Nested
- Three

1. First
2. Second
3. Third

## Tables

| Method | Path     | Auth | Notes          |
| ------ | -------- | ---- | -------------- |
| `GET`  | `/items` | No   | List endpoint  |
| `POST` | `/items` | Yes  | Create         |
| `GET`  | `/items/:id` | No | Read one      |

## GitHub alerts

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Code

```go
package main

import "fmt"

func main() {
    greeting := greet("Vitor")
    fmt.Println(greeting)
}

func greet(name string) string {
    return "Hello, " + name
}
```

That's the tour. Replace this file with your real content when you're ready.

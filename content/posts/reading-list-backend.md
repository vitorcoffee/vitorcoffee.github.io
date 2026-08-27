---
title: "Reading List: Backend Engineering"
date: 2026-04-10
draft: false
description: "A running list of papers and posts I keep coming back to."
summary: "Papers, posts, and talks on distributed systems, databases, and operability."
tags: ["reading", "backend", "distributed-systems"]
categories: ["reading"]
series: ["reading-list"]
showHero: false
---

This is part of a running series. I'll update it as I find new material worth
recommending.

## Foundations

- **[Dynamo: Amazon's Highly Available Key-value Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)**
  Still the cleanest write-up of "AP over CP" trade-offs and how a real
  production system picks.
- **[The Log: What every software engineer should know about real-time data's unifying abstraction](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying-abstraction)**
  Jay Kreps's essay on why logs are the substrate for stream processing, CDC,
  and event sourcing.

## Operability

- **[The Twelve-Factor App](https://12factor.net/)** — short, opinionated,
  every clause still earns its place.
- **[How Complex Systems Fail](https://how.complexsystems.fail/)** — eighteen
  short paragraphs. Read it once a year.
- **[Production-Oriented Development](https://danluu.com/posts/production-dev/)**
  The framing that "works on my machine" is the failure mode, not the goal.

## Performance

- **[Designing Data-Intensive Applications](https://dataintensive.net/)**
  Martin Kleppmann. The book that should be on every backend engineer's desk.
- **[A Decade of Database Advancements](https://db.cs.cmu.edu/papers/2024/p14-pavlo-decade-of-data-systems.pdf)** —
  Andy Pavlo's retrospective. Good map of where the field has gone and where
  it's stuck.

I'll add more over time — and call out which ones turned out to be
overhyped.

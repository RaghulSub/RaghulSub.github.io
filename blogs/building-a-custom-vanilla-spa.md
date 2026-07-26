---
title: "Building a Custom Vanilla SPA from Scratch"
author: "Raghul Subramanian"
date: "2026-04-18"
description: "Why I decided to build my portfolio using a custom Vanilla TypeScript single-page application router instead of relying on mainstream frameworks like React."
tags: ["TypeScript", "Architecture", "Web"]
---

When deciding how to build my personal portfolio website, the initial reflex—like most web developers today—was to reach for Next.js, React, or Vue. They're powerful, fast to set up, and they have an ecosystem for literally anything you'd ever need. 

But I hesitated. A portfolio isn't a massive dynamic dashboard with real-time sockets or complex state management. It's essentially a document that occasionally navigates between a few simple views. Importing Megabytes of JavaScript framework overhead for something that fundamentally requires a few kilobytes of logic felt like an absolute overkill.

So, I decided to take a completely different path: **Build it from scratch using Vanilla TypeScript.** No React, no Vue, no bloated package dependencies. Just the bare web APIs, string templates, and a bit of custom logic.

## The Architecture of Simplicity

The core of this application revolves around an incredibly straightforward file structure. Let me break down the critical pieces that make it function like a seamless single-page application (SPA):

### 1. The Router

The router is perhaps the most crucial piece of any SPA. Frameworks make routing seem like magic, but under the hood, it's just listening to URL changes. 

In my vanilla setup, I rely entirely on hash-based routing. The `hashchange` event listener does the heavy lifting:

```typescript
window.addEventListener('hashchange', handleRoute);
```

Whenever the `#` changes in the URL, my `handleRoute` function parses the path, matches it against a registered object mapping URLs to Component rendering functions, and injects the resulting HTML string into a root `#app` div. 

It handles dynamic parameters too (like `/blogs/:slug` or `/works/:slug`) using simple regex replacements. No massive context providers required.

### 2. State and Data Fetching

State management is practically non-existent. Instead of Redux or Zustand, the app relies purely on one global `AppData` object fetched at the very beginning of the initialization cycle.

When you hit the page, `src/main.ts` asynchronously invokes `loadData()`, which parallel fetches small, static JSON files like `site.json`, `works.json`, and `blogs.json`.

```typescript
const [site, home, works, projects, blogs] = await Promise.all([
  fetch('/data/site.json').then(r => r.json()),
  fetch('/data/home.json').then(r => r.json()),
  // ...
]);
```

Once that data loads, the entire app renders synchronously based on that cached data. It's shockingly fast because it leverages native browser caching.

### 3. Component Rendering

This is the part that usually scares people away from Vanilla JS. Without JSX or Vue templates, how do you write UI without losing your mind to `document.createElement()`?

The answer: **Template Literals**. 

Each component is simply a pure function that takes in props (data) and returns a string of HTML. 

```typescript
export function Tag(label: string): string {
  return `<span class="simple-tag">#${label}</span>`;
}
```

Since modern IDEs handle string templates flawlessly, the development experience feels almost identical to writing JSX, just with native JavaScript strings.

### 4. The Blog Parser

If I'm not using a static site generator like Astro or Gatsby, how do I render these markdown blog posts?

I wrote a tiny, 80-line regex-based Markdown parser. It fetches raw `.md` files via the browser's `fetch` API, splits the YAML frontmatter from the markdown body, and aggressively replaces standard markdown patterns (like `## Headers` and `[Links]()`) with their HTML equivalents. 

It handles code blocks, images, lists, and basic text formatting—everything I need to write comfortably.

## Why This Approach Won Out

Building this vanilla SPA taught me an invaluable lesson about modern web development: **we abstract away far too quickly.**

1. **Performance:** The resulting bundle size is minuscule. A few KB of JavaScript parses almost instantaneously on any mobile device.
2. **Control:** I understand every single line of code executing on this page. There are no hidden library lifecycles or mysterious re-renders. 
3. **Fun:** Frankly, writing pure TypeScript and interacting directly with the DOM is refreshing. It's a fantastic exercise in engineering fundamentals.

If you're building a static or mildly dynamic content site, I heavily urge you to consider shedding the frameworks. You might be surprised at how capable the raw browser API truly is.

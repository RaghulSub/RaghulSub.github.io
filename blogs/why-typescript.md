---
title: "Why TypeScript is Non-Negotiable"
author: "Raghul Subramanian"
date: "2025-10-12"
description: "A quick look at why I use TypeScript for every new project and why you probably should too."
tags: ["TypeScript", "Productivity"]
---

JavaScript is a wildly expressive language. You can do practically anything you want, incredibly quickly. 

But as soon as a project crosses a thousand lines of code, the cognitive load required to understand what variables exist, what methods a class has, or what an API response looks like becomes overwhelming.

This is where **TypeScript** steps in.

I used to build small projects in plain JavaScript, thinking TypeScript was an enterprise-only necessity. But today, even for a one-off script, I initialize it with `tsc --init`.

## 1. The IDE is Your Best Friend

When you define your data structures—like an `interface Work` for a portfolio—your editor (VS Code, Cursor, WebStorm) immediately understands your entire application.

If you type `item.`, you instantly see autocomplete suggestions for `.title`, `.slug`, and `.tags`. You never have to open the file where the variable was defined to guess its shape.

## 2. Refactoring Without Fear

When I changed my portfolio from a card layout to a minimalist list, I altered the `Work` type. Immediately, TypeScript highlighted exactly 4 different files where I was using old properties.

If I had used JavaScript, I would have had to rely entirely on `Cmd + F` search, hoping I didn't miss anything, or wait for the application to throw a runtime error in the browser.

## 3. Self-Documenting Code

The types act as living documentation. I don't need to write long JSDoc comments explaining what a function expects. `function processData(input: string[]): number` tells me everything I need to know.

If you haven't switched yet, trust me—the initial learning curve of TypeScript is entirely worth the peace of mind.

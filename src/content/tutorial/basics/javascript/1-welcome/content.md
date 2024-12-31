---
type: lesson
title: Javascript for popover
focus: /index.html
---

## What is Popover API in Javascript

:::info
This is a tutorial for popover
:::

Popover API is new addition to CSS and it solve the issue of opening modal with css only; no js required.

below is HTML code which works

```html title="index.html" add=/popovertarget/ "data" add=/\bpopover\b/ "id="data"" collapse={2-3}
<main>
  <button class="parent" popovertarget="data">button</button>
  <div class="popover__content" id="data" popover>this is pop over content</div>
</main>
```

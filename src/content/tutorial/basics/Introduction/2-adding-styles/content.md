---
type: lesson
title: Adding Styles
focus: /index.html
---

## Adding Style

Popover API is new addition to CSS and it solve the issue of opening modal with css only; no js required.

below is CSS code which works

```html title="index.html" add={1-5}
<style>
  [popover] {
    background-color: silver;
  }
</style>
<main>
  <button class="parent" popovertarget="data">button</button>
  <div class="popover__content" id="data" popover>this is pop over content</div>
</main>
```

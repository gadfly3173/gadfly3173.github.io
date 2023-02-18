---
title: 使用 TypeScript 的仅类型导入和导出
layout: post
typora-root-url: ..
date: 2022-03-03 09:37:40
categories:
tags:
permalink:
hide_post_info: false
---
解决类型被作为值导入导出引发的警告

<!-- More -->

如果在 ts 文件中导出一个类型（type），那么在另一个 ts 文件中导入时，webpack 会报如下警告：

```bash
  WARNING Compiled with 1 warning

  warning in ./src/component/vue-tabs-chrome/index.ts

  export 'Tab' (reexported as 'Tab') was not found in './vue-tabs-chrome.vue' (possible exports: default)
```

为了解决这样的问题，TypeScript 提供了一个特性，叫做类型导入（type import），它可以让你在一个文件中导出一个类型，并且可以在另一个文件中导入这个类型。

```typescript
// type
export interface Tab {
  /** 显示名称 */
  label: string
  /** 唯一 key */
  key: string
  favico?: string
  /**
   * 是否可关闭
   */
  closable?: boolean
  /**
   * 是否可被交换
   */
  swappable?: boolean
  /**
   * 是否可拖拽
   */
  dragable?: boolean
  $el?: HTMLElement
  // eslint-disable-next-line
  _instance?: any
  _x?: number
}

// origin
import VueTabsChrome, { Tab } from './vue-tabs-chrome.vue'

export { VueTabsChrome, Tab }

// changed
import VueTabsChrome from './vue-tabs-chrome.vue'
import type { Tab } from './vue-tabs-chrome.vue'

export { VueTabsChrome, Tab }
```

references: [Leveraging Type-Only imports and exports with TypeScript 3.8](https://javascript.plainenglish.io/leveraging-type-only-imports-and-exports-with-typescript-3-8-5c1be8bd17fb)

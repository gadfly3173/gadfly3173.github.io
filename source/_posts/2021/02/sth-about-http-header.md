---
title: 关于 HTTP Header 的碎碎念
layout: post
date: 2021-02-21 03:15:35
categories: 开发
tags:
- java
- spring
- 后端
- HTTP
permalink:
hide_post_info: false
---
关于 HTTP Header，网上找到的大部分教程，设置 header 都是非常简单粗暴的 new 一个`HttpHeaders()`，然后直接 add 的形式（甚至连 StackOverflow 上也有很多回答是这么做的），如：

```java
public ResponseEntity<FileSystemResource> export(File file) {
    if (file == null) {
        return null;
    }
    HttpHeaders headers = new HttpHeaders();
    headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.add("Content-Disposition", "attachment; filename=" + System.currentTimeMillis() + ".xls");
    headers.add("Pragma", "no-cache");
    headers.add("Expires", "0");
    headers.add("Last-Modified", new Date().toString());
    headers.add("ETag", String.valueOf(System.currentTimeMillis()));

    return ResponseEntity
            .ok()
            .headers(headers)
            .contentLength(file.length())
            .contentType(MediaType.parseMediaType("application/octet-stream"))
            .body(new FileSystemResource(file));
}
```

但是这样代码里会有很多魔法值，而对于`Content-Disposition`这样的 header 中，filename 如果直接把中文填进去还会导致乱码，对它进行转码就又要多写几行。其实 Spring 本身对于 header 就提供了很多简单的设置方法，可以有效提高代码的可读性。

将上面的代码用 Spring 中提供了方法改写的话，可以写成：

```java
private ResponseEntity<FileSystemResource> export(File file) {
    if (file == null) {
        return null;
    }
    HttpHeaders headers = new HttpHeaders();
    headers.setCacheControl(CacheControl.noStore().mustRevalidate());
    headers.setContentDisposition(ContentDisposition.attachment().filename(file.getName(), StandardCharsets.UTF_8).build());
    headers.setPragma("no-cache");
    headers.setExpires(0L);
    headers.setLastModified(System.currentTimeMillis());
    headers.setETag(String.valueOf(System.currentTimeMillis()));
    return ResponseEntity
            .ok()
            .headers(headers)
            .contentLength(file.length())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(new FileSystemResource(file));
}
```

这样编码的转换也不需要自己写了，也可以很简单设置 header，不会有打错字的困扰（雾

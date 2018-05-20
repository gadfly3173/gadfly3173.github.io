---
title: 在首页隐藏文章
layout: post
date: 2018-05-20 21:57:55
categories: 建站
tags:
- HTML
- EJS
- Hexo
permalink:
visible:
---
你看不见我！看不见我！略略略
<!--More-->
最近开始在博客上写日记，我希望它们可以在首页不显示，但是在归档里还能找到，研究了几篇文章之后，我做了如下改动：
index.ejs中
```
    <!-- Normal Post -->
    <% page.posts.each(function(post) { %>
        <% if(!((typeof hasposttop === 'function') && post.top)) { %>
            <% if ( !( (post.visible === 'hide') && (page.path === "index.html") ) )   { %>
            
                <% if(theme.scheme === 'Paradox') { %>
                
                    <!-- Paradox Thumbnail -->
                    <%- partial('_partial/Paradox-post_entry', { post: post, index: true, pin: false }) %>
                
                <% } %>
                <% if(theme.scheme === 'Isolation') { %>
                    <!-- Isolation Thumbnail -->
                    <%- partial('_partial/Isolation-post_entry', { post: post, index: true, pin: false }) %>
                <% } %>
            <% } else { %>
                <div class="post_entry-module mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col fadepost_entry-module mdl-card mdl-shadow--2dp mdl-cell mdl-color-text--grey-600 mdl-card__supporting-text" style="text-indent: 1.5em">这里有一篇文章藏起来了哟！</div>
            <% } %>
        <% } %>
    <% }); %>
```
else后面的部分用来表示这里少了一篇文章，以免发生因为连发了十篇隐藏文章，而导致首页空白的情况。
post.md中
```markdown
---
title: {{ title }}
date: {{ date }}
categories:
tags:
permalink:
layout: post
visible: 
---
```
visible属性只有在为``hide``的时候才会使文章在首页不可见，其他时候均为可见状态。
参考资料：1、<https://github.com/viosey/hexo-theme-material/issues/483>
　　　　　2、<https://forwardkth.github.io/2016/05/08/next-theme-post-visibility/>
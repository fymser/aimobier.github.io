---
categories: 博客历程
title: hexo SEO 优化
tags:
  - 博客美化
  - hexo
date: 2018-01-17 19:41:00
---

我们写了博客，当然希望搜索引擎将我们收录更好了。在我朋友的建议下，我来看看这个关于Hexo的优化吧

### 关于 Https
好吧，我真的特别喜欢那些绿色的小锁，以及前面的一些字 比如 'Apple Inc.[US]' 日日！  好帅啊！       
好吧，最后实现了，虽然没有那些字，毕竟是免费的不计较的了。

`CloudFlare` 好吧 就是他，他其实也没有给你证书，只是给你做了一层 DNS 代理，这样子的话，你访问的时候会带上人家的 https 证书，当然你要是愿意支付每个月 5 美元的钱的话，是可以加小字的。。。没钱。。。

<!-- more -->

设置 page rules 可以将所有的 http 请求转换为 https。

另外其实还是有不少免费证书申请的，但是无奈，我没有自己的服务器，所以只能，这样子了。

### SEO 优化

增加 mate 属性一些值

````ejs
<% if (config.keywords){ %>
  <meta name="keywords" content="<%= config.keywords %>">
<%} %>
<% if (config.author){ %>
  <meta name="author" content="<%= config.author %>">
<%} %>
<% if (config.description){ %>
  <meta name="description" content="<%= config.description %>">
<%} %>
````

### 减少url的层数

减少 html url 的层数,在根目录下的 `_config.yml`,配置一下代码。

````yml
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://blog.msiter.com/
root: /
# permalink: :year/:month/:day/:title/
permalink: :title-:year:month:day.html
permalink_defaults:
````

### 增加 sitmap

Sitemap 可方便网站管理员通知搜索引擎他们网站上有哪些可供抓取的网页。最简单的 Sitemap 形式，就是XML 文件，在其中列出网站中的网址以及关于每个网址的其他元数据（上次更新的时间、更改的频率以及相对于网站上其他网址的重要程度为何等），以便搜索引擎可以更加智能地抓取网站。

````shell
"hexo-generator-sitemap": "",
````
安装 组建，在config 配置如下。
````yml
# sitemap
## SEO
sitemap:
    path: sitemap.xml
baidusitemap:
    path: baidusitemap.xml
````

### url地址不要有中文

这个优化方式会在下一片博文中提到

### 向百度提交链接

百度，，，，不做评价

爱咱们每一个页面都加入一个百度提供的js方法。
````js
<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
</script>
````
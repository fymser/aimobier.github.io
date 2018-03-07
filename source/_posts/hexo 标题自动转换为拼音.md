---
categories: 博客历程
title: hexo SEO 优化
tags:
  - 博客美化
  - hexo
date: 2018-01-17 21:41:00
---

在上篇文章中，我们提到了SEO，其中还有一个是在url中尽量不存在中文。这里我们就来完成这个操作。

## 中文转换

在这里，我们可以根据时间，或者直接将标题生成为 散列值。随便的hash算法都可以实现，但是默写时候还是希望可以标题可以某些方面反映出来我们的内容。所以有两种方式，转换为英文，或者转换为拼音。当然为了防止重复的问题，我们可以增加一个时间戳或者时间的格式字符串来进行区分

### 转换为英文

首先，尝试转换标题为英文，毕竟显得高大上很多。 我们在 [Hexo Plugins](https://hexo.io/plugins/),搜索到了一个插件 [hexo-translate-title](https://github.com/cometlj/hexo-translate-title). 哎呀，这多好啊，直接省略了所有的步骤，也不用开发轮子了。

当然机智的你，也发现了，要是这样就停止了，我们就不会有这么长的博文了。

好吧，毕竟现在的翻译不能保证都可以成功...所以还是放弃了，最终

<!-- more -->

### 转换为拼音

作为小学的语言，还是很亲近的，虽然某些方面看着不是很高大上…… 不影响 不影响～～

首先我么要找到一个转换拼音的框架，，好吧，中间找了不少的框架，其中很多都是有问题的。这里只说我找到的，并且已经在使用的框架吧

[pinyin](https://github.com/hotoo/pinyin)

* 根据词组智能匹配最正确的拼音。
* 支持多音字。
* 简单的繁体支持。
* 支持多种不同拼音风格

好了既然都找到了框架了，那我们就来写入博客开发里吧。

## 自定义博客文件名称

很多个类似的框架，都是拦截的 `before_post_render` 方法，并且将修改完成的数据，需要重新格式化后，写入 `.md` 。这样才可以实现，但是问题也很明显，就是在于正在运行的服务器时候，写文章会出现，由于文章重新写入了文章，可能会导致文章写作出现内容刚刚输入的消失的问题。

咱们接下来就选择一个方法吧。

### 更换方法 post_permalink

````js
hexo.extend.filter.register('post_permalink', function(data){
  // ...
});
````

我们可以在这里查看到官方的[post_permalink](https://hexo.io/zh-cn/api/filter.html#post-permalink)API 介绍，用来决定文章的永久链接。好吧原来这个才是官方推荐的。

### 使用pinyin转换中文
接下来就让我们使用咱们的第三方框架`pinyin`来吧我们文章的标题转换为中文吧

````js
const final_title_str = pinyin(data.title, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true})
````

其中关于转换的细节，我就不具体讲了，在pinyin的GitHub 主页有详细的文档。我这里使用的是首字母。之后咱们使用 `join` 来拼接字符串
````js
const final_title_str = pinyin(data.title, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true}).join("")
````

但是这个时候就出现了一些问题，就是这些数据在有关于特殊字符的时候会引发sitmap的问题。所以我们使用替换字符串的方式替换一下特殊字符
````js
var final_title_str = pinyin(data.title, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true}).join("");
final_title_str = final_title_str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
final_title_str = final_title_str.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/, "");
return final_title_str+".html"
````
### SHA256
其实在另一个方式来说的话
````js
const secret = "suibian"
const hash = crypto.createHmac('sha256',secret).update(data.title).digest("hex");
return hash+".html";
````

这个时候就完成了 SHA256的方式，，，，但是 标题好长啊...

## 完整代码

接下来就是咱们的完整的代码，如下所示:

````js
var hexo = hexo || {};
var config = hexo.config;

const pinyin = require("pinyin");
const crypto = require('crypto');

const permalink = require('hexo/lib/plugins/filter/post_permalink')
hexo.extend.filter.unregister('post_permalink', permalink);

hexo.extend.filter.register('post_permalink', function(data){

    /// 如果是将文章转换为 pinyin
    if(config.transform.toLowerCase() === "pinyin"){
        var final_title_str = pinyin(data.title, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true}).join("");
        final_title_str = final_title_str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
        final_title_str = final_title_str.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/, "");
        return final_title_str+".html"
    }

    if(config.transform.toLowerCase() === "sha256"){
        const secret = "suibian"
        const hash = crypto.createHmac('sha256',secret).update(data.title).digest("hex");
        return hash+".html";
    }

    return permalink.apply(this, [data])
});
````
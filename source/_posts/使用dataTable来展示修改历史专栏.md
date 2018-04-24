---
categories: 博客历程
title: 使用DataTable来展示修改历史
tags:
  - 博客美化
  - hexo
date: 2018-04-24 10:41:00
---

昨天在整理博客的时候，发现还是存在一些问题的，比如搜素时候貌似中文搜索不出来？还有就是我的修改历史存在如果修改历史过多，内容会过于向下，导致内容出现乱掉的情况。

今天我就打算使用DataTable修复这个问题，当然是通过分页的方式，你可以使用任意一种分页的方式解决这个问题。

<!-- more -->

## DataTables

DataTables 是一个非常好的插件，包含非常多的功能，并且官方的教程非常的完备，让你学习起来不会有太大的阻碍。

哎哟.... 我发觉的 Datatable 主页改版了.... [DataTables | Table plug-in for jQuery](https://www.datatables.net/)

这比以前的那个样子好看多了... 以前让人觉的是真的技术人员写的网页，现在看起来就大气多了...

好了，废话不多说，这里我也不想多多介绍Datatables .. 具体的话 我会考虑会面出一篇文章来讲解一下这个插件

## 修复 UI 层面的问题

接下来，我们会一步步的记录我所遇到的问题以及解决方法。

### 创建Datatable

首先，我是用的是 [HTML (DOM) sourced data](https://www.datatables.net/examples/data_sources/dom.html)方式，直接创建的table,这种方式是说，首先创建一个完善的 Table ，之后在使用 DataTable 方法进行一些配置。

在我们上一篇讲解到如何请求 commit ，我们请求完成之后，生成了的是 li 标签，这里我们把他们包围在 `tr td` 中，之后填充到 `tbody` 中，再调用 Datatable 就可以看到效果了。

````js
$("#commit-history-new-body").html(liRes.join(""));

$('#commit-history-new').DataTable();
````
至此，我们已经可以看到，我们的内容展示在Datatable了。但是我们也发现又很多我们不需要的内容。比如 选择器，分页，搜索，信息之类的。

### 隐藏一些内容

````js
$("#commit-history-new-body").html(liRes.join(""));

$('#commit-history-new').DataTable({
  autoWidth: false,
  ordering: false,
  searching: false,
  lengthChange: false,
  pageLength: 2,
  info: false
});
````

修改配置，我们可以看到，我们的排序，搜索，每页展示2个，结果信息也隐藏了。

### 配置 pager

接下来我们来进行分页的配置

````js
$('#commit-history-new').DataTable({
  data: datas,
  autoWidth: false,
  ordering: false,
  searching: false,
  lengthChange: false,
  pageLength: 4,
  info: false,
  pagingType: "cutsomPage"
});
````

我们之前的配置，放上之后，发现了一个问题，我们的搜索和修改内容却出现了冲突，接下来我们修改分页器

#### 点击分页器置顶问题

我们之前的分页器，使用的`<a>`标签的 `href` 为 `#` ，这样带来的问题会导致我们点击超链接的时候，会跳转到顶部。有两种方法可以解决这个问题。

````js
function NextConMethod(){
  var resString = '\
                <li class="list-inline-item float-sm-right">\
                  <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-16" aria-label="Next">\
                    <span aria-hidden="true">\
                      下一页\
                      <i class="fa fa-angle-right g-ml-5"></i>\
                    </span>\
                    <span class="sr-only">Next</span>\
                  </a>\
                </li>\
                '; // 直接删除 href 属性
    return resString;
};
function NormalNumberConMethod(number){
  var resString = '\
              <li class="list-inline-item g-hidden-sm-down hidden-all-list-li-link-elment">\
                <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-14" href="javascript:void(0)">'+number+'</a>\
              </li>'; //  javascript:void(0) 解决该问题
  return resString;
};
````

1. 直接删除 href 属性
2. javascript:void(0) 解决该问题

#### 分页器的扩展性

在共同使用的时候，由于我们之前很多属性修改的选择器都是使用的ID，导致我们在进行两个视图同时存在的时候会出现问题。

````js
const selectorStr = oSettings.oInstance.selector+'_paginate'; // 通过该方法 可以获取到 分页器的id 并且完成获取Element 的操作
````

我们通过  `oSettings.oInstance.selector` 可以获取到分页器所服务器的ID，我们通过选择器，添加 `_paginate`获取到分页器。

````js
if (oSettings._iCurrentPage === 1) {
    $(selectorStr+' a[aria-label="Previous"]').addClass("u-pagination-v1__item--disabled");
} else {
    $(selectorStr+' a[aria-label="Previous"]').removeClass("u-pagination-v1__item--disabled");
}

if (oSettings._iTotalPages === 0 || oSettings._iCurrentPage === oSettings._iTotalPages) {
    $(selectorStr+' a[aria-label="Next"]').addClass("u-pagination-v1__item--disabled");
} else {
    $(selectorStr+' a[aria-label="Next"]').removeClass("u-pagination-v1__item--disabled");
}

/// OR ->>>>>>>>>

var i, oNumber, oNumbers = $(selectorStr+" ul[class='list-inline']");

$(selectorStr+" .hidden-all-list-li-link-elment").remove();
````

#### 页码展示问题修复

我们之前的分页器有默认配置的 `iShowPages` 为3

第三个问题， 配饰 `iShowPages` ，在之前我们设置了为三个，但是由于之前的代码为

````js
var iShowPages = oSettings.oInit.iShowPages || this.default.iShowPages,
````
导致即使我们想不显示页码也会不得不显示3个，所以我们作出一下修改

````js
var iShowPages = oSettings.oInit.iShowPages;
````

并且在下方生成 页码的方法中增加判断方法，不需要展示的时候直接返回。

````js
if (!oSettings._iShowPages) {
  return;
}
````

## 安全访问属性问题

之前没有遇到过这个问题，现在遇到了js访问属性的空值问题。

比如 `a.b.c.d` 其中，b不存在，那么会报错。

这个在Swift中还是很好解决的 `a?.b?.c?.d` 就可以解决了。但是貌似js没有这个东西，目前好像还在开发中。

那么我们就是用如下方法

以下内容是 Twitter引用，需要翻墙查阅

<center >
<blockquote handle='nohandle' class="twitter-tweet" data-lang="zh-cn"><p lang="en" dir="ltr">In case you need a idx function.<br>const idx = (p, o) =&gt; p.reduce((xs, x) =&gt; (xs &amp;&amp; xs[x]) ? xs[x] : null, o)<br>Access deeply nested values... <a href="https://t.co/lyoUIZudF7">pic.twitter.com/lyoUIZudF7</a></p>&mdash; A. Sharif (@sharifsbeat) <a href="https://twitter.com/sharifsbeat/status/843187365367767046?ref_src=twsrc%5Etfw">2017年3月18日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>


````js
const get = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : undefined, o)

// const commit = safe(comm);
const date = new Date(commit.commit.committer.date);

commit_commit_message = (get(['commit','message'],commit) || "no message").replace(/\n/g, "<br>")

commit_sha = get(['sha'],commit) || "";
commit_author_html_url = get(['author','html_url'],commit) || "";
commit_author_avatar_url = get(['author','avatar_url'],commit) || "" ;
commit_html_url = get(['html_url'],commit) || "";
commit_author_login = get(['author','login'],commit) || "";

````

至此所有问题就都解决了。

所有涉及到的代码，都可以在本篇文章提交的commit中查看。

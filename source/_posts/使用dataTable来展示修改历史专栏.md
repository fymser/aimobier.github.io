---
categories: 博客历程
title: 使用DataTable来展示修改历史
tags:
  - 博客美化
  - hexo
date: 2018-04-24 10:41:00
---

昨天在整理博客的时候，发现还是存在一些问题的，比如搜素时候貌似中文搜索不出来？

还有我的修改历史虽然是做出来了，但是貌似如果是以前很久的文章的话，会因为太多修改历史而导致超出很多部分而展示的很奇怪。

今天我就打算使用DataTable修复这个问题。

<!-- more -->

## DataTables

哎哟.... 我发觉的 Datatable 主页改版了.... [DataTables | Table plug-in for jQuery](https://www.datatables.net/)

这比以前的那个样子好看多了... 以前让人觉的是真的技术人员写的网页，现在看起来就大气多了...

好了，废话不多说，这里我也不想介绍Datatables ..

## 修复 UI 层面的问题

接下来，我们会一步步的记录我所遇到的问题以及解决方法。

### 创建Datatable
首先，我是用的是 HTML (DOM) sourced data方式，直接创建的table

当我请求完成之后，拼接完成Html字符串直接写入tbody中，之后在完成datatable配置方法。

````js
$("#commit-history-new-body").html(liRes.join(""));

$('#commit-history-new').DataTable({
  autoWidth: false,
  ordering: false,
  searching: false,
  lengthChange: false,
  pageLength: 2,
  iShowPages: false,
  info: false,
  pagingType: "cutsomPage",
  footerCallback: function(tfoot, data, start, end, display) {
    var title = "共" + data.length + "个修改历史";
    $("#history_infomessagelabel").html(title);
  }
});
````

### 修改Pager

之前我们就自定义过一次Datatable的分页器了，现在我们继续完善几个点。

第一个就是，我们之前是创建的a标签，其中href设置的为`#` ，这样带来的问题就是我们点击超链接的时候，会跳转到顶部。我们两种方法解决这个问题
````js
/// 上一页 Elemnt 生成代码
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

/// 上一页 Elemnt 生成代码
function NormalNumberConMethod(number){

  var resString = '\
              <li class="list-inline-item g-hidden-sm-down hidden-all-list-li-link-elment">\
                <a class="u-pagination-v1__item u-pagination-v1-4 g-rounded-50 g-pa-7-14" href="javascript:void(0)">'+number+'</a>\
              </li>'; //  javascript:void(0) 解决该问题

              return resString;
};
````

第二个问题，解决共同使用的问题，之前我们创建了一个分页，导致我们之前使用id，创建的专属分页器，在这里就不再使用，所以我们就使用如下方法完成修改。

````js

        const selectorStr = oSettings.oInstance.selector+'_paginate'; // 通过该方法 可以获取到 分页器的id 并且完成获取Element 的操作
````

第三个问题， 配饰 `iShowPages` ，在之前我们设置了为三个，但是由于之前的代码为
````js
        var iShowPages = oSettings.oInit.iShowPages || this.default.iShowPages,
````
导致即使我们想不显示nuber也会不得不显示3个，所以我们作出一下修改
````js
var iShowPages = oSettings.oInit.iShowPages;
````
并且在下方生成 number的方法中增加判断方法
````js
if (!oSettings._iShowPages) {
  return;
}
````

## 安全访问属性问题

之前没有遇到过这个问题，现在遇到了js访问属性的空值问题。比如 `a.b.c.d` 其中，b不存在，那么会报错。

这个在Swift中还是很好解决的 `a?.b?.c?.d` 就可以解决了。但是貌似js没有这个东西，目前好像还在开发中。

那么我们就是用如下方法

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

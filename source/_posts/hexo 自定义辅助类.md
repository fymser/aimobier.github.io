---
categories: 博客历程
title: hexo 自定义辅助类
tags:
  - 博客美化
  - hexo
date: 2018-01-17 22:41:00
---

在做模块的时候，一般情况下我们都可以直接使用提供的变量以及一些方法完成整个博客的开发，当时当我们真的遇到比如我们需要修改我们的Table的样式的时候怎么办呢？

难道每次都等到页面加载完成之后，使用 js/Jquery 方式修改Class,接下来我们来整理几个我在项目中使用到的几个辅助类

### 修改TABLE && IMG样式

````js
hexo.extend.filter.register('after_post_render', function(data){

    data.content = data.content.replace(/<table>/, '<table class = "table table-bordered">');
    data.content = data.content.replace(/<img/, '<img class = "g-pl-90" ');

    return data;
});
````

<!-- more -->

这个方法很简单的使用了文字替换的方式，修复了表格和图片的样式。

### 创建辅助函数

在实际项目中，我需要获取到文章的第一张图片，因为文章有了图片会显的很好看，但是有些文章第一张图片在很后面的地方，会导致展示上很麻烦，所以现在咱们创建一个函数来完称这个功能

````js
/// 创建一个 pfi 辅助函数 用来获取文章中的第一个图片
hexo.extend.helper.register('ph', function(content) {

  if (!cheerio) cheerio = require('cheerio');

   ....
});

````

咱们首先获取一个 cheerio 对象，使用这个对象类似于 jquery 可以操作 elemnt 对象

#### 调整UL

````js
function ulliHandle($){

  $("ul").each(function(){

    $(this).addClass("g-list-style-circle");
  });
}
````

在这个方法中，我们把每个 `ul` 都增加 class

#### 代码预览视图

````js
/// 代码 处理方法
function codeHandle($){

  $("pre").each(function(){

    if (!$(this).attr("class")) {

        $(this).addClass('line-numbers language-txt');

        $(this).find("code").addClass('language-txt')
    }
        $(this).addClass("g-mb-30");
  });
}
````

#### 引用文章的修改

````js
// 引用 内容的配置
function blockquoteHandle($){

  $("blockquote").each(function(){

    var content = $(this).html();

    var replaceString = '\
    <!-- Taglines Bordered -->\
    <div class="g-brd-around g-brd-gray-light-v4 g-brd-2 g-brd-red-left g-line-height-1_8 g-pa-30 g-mb-30">\
      <em style="padding:0px;margin:0px;">'+content+'</em>\
    </div>\
    <!-- End Taglines Bordered -->\
    ';

    $(this).replaceWith($(replaceString));
  });
}
````

#### 图片的处理

````js
/// 图片的处理
function imageHandle($){

  $("img").each(function(){

    var url = $(this).attr("src");
    var title = $(this).attr("title");

    var replaceString = '\
      <figure class="mb-4 text-center">\
\
      <a class="js-fancybox-thumbs" href="'+url+'" title="Lightbox Gallery" data-fancybox-gallery="lightbox-gallery-2" data-fancybox-speed="500" data-fancybox-slide-speed="1000">\
            <br/><img class="img-fluid g-brd-around g-brd-gray-light-v2 g-rounded-3" src="'+url+'" alt="Image Description">\
          </a>';

      if (title) {
        replaceString += '<figcaption class="figure-caption g-font-size-12 g-color-gray-dark-v4 g-mt-5 text-center">\
        '+title+'</figcaption>';
      }

    replaceString += '</figure>';

    $(this).replaceWith($(replaceString));
  });
}

````

### 自定义分页器

在这个时候，我们可以需要配置分页，我们可以简单的配置成

````
<- ->
````
只有一个前一页 后一页的方式。

当然我们真的喜欢的就是
````
<- 1 2 3 ... 7 8 9 ->
````

默认的话，其实Hexo 已经有默认的方式

````
<%- paginator(options) %>

````

插入分页链接。

我们使用该方法，重写他，自定义，来进行分页的处理
````js
function paginatorHelper(options) {
  options = options || {};

  var current = options.current || this.page.current || 0;
  var total = options.total || this.page.total || 1;
  var endSize = options.hasOwnProperty('end_size') ? +options.end_size : 1;
  var midSize = options.hasOwnProperty('mid_size') ? +options.mid_size : 2;
  var space = options.hasOwnProperty('space') ? options.space : '&hellip;';
  var base = options.base || this.page.base || '';
  var format = options.format || this.config.pagination_dir + '/%d/';
  var prevText = options.prev_text || 'Prev';
  var nextText = options.next_text || 'Next';
  var prevNext = options.hasOwnProperty('prev_next') ? options.prev_next : true;
  var transform = options.transform;
  var self = this;
  var result = '';
  var i;

  if (!current) return '';

  var currentPage = '<li class="list-inline-item">\
    <a class="active u-pagination-v1__item g-width-30 g-height-30 g-brd-secondary-light-v2 g-brd-primary--active g-color-white g-bg-primary--active g-font-size-12 rounded g-pa-5" >'+(transform ? transform(current) : current)+'</a>\
  </li>';

  function link(i) {
    return self.url_for(i === 1 ? base : base + format.replace('%d', i));
  }

  function pageLink(i) {



    return '            <li class="list-inline-item">\
                  <a class="u-pagination-v1__item g-width-30 g-height-30 g-brd-transparent g-brd-primary--hover g-brd-primary--active g-color-secondary-dark-v1 g-bg-primary--active g-font-size-12 rounded g-pa-5" href="' + link(i) + '">' +(transform ? transform(i) : i) +'</a>\
                </li>';
  }

  // Display the link to the previous page
  if (prevNext && current > 1) {

    result += '<li class="list-inline-item">\
      <a class="u-pagination-v1__item g-brd-secondary-light-v2 g-brd-primary--hover g-color-gray-dark-v5 g-color-primary--hover g-font-size-12 rounded g-px-15 g-py-5 g-ml-15" href="' + link(current - 1) + '" aria-label="Previous">\
        <span aria-hidden="true">\
          <i class="mr-2 fa fa-angle-left"></i>\
            ' + prevText + '\
        </span>\
        <span class="sr-only">' + prevText + '</span>\
      </a>\
    </li>'
  }

  if (options.show_all) {
    // Display pages on the left side of the current page
    for (i = 1; i < current; i++) {
      result += pageLink(i);
    }

    // Display the current page
    result += currentPage;

    // Display pages on the right side of the current page
    for (i = current + 1; i <= total; i++) {
      result += pageLink(i);
    }
  } else {
    // It's too complicated. May need refactor.
    var leftEnd = current <= endSize ? current - 1 : endSize;
    var rightEnd = total - current <= endSize ? current + 1 : total - endSize + 1;
    var leftMid = current - midSize <= endSize ? current - midSize + endSize : current - midSize;
    var rightMid = current + midSize + endSize > total ? current + midSize - endSize : current + midSize;
    var spaceHtml = '            <li class="list-inline-item">\
                  <span class="g-width-30 g-height-30 g-color-gray-dark-v5 g-font-size-12 rounded g-pa-5">'+space+'</span>\
                </li>';

    // Display pages on the left edge
    for (i = 1; i <= leftEnd; i++) {
      result += pageLink(i);
    }

    // Display spaces between edges and middle pages
    if (space && current - endSize - midSize > 1) {
      result += spaceHtml;
    }

    // Display left middle pages
    if (leftMid > leftEnd) {
      for (i = leftMid; i < current; i++) {
        result += pageLink(i);
      }
    }

    // Display the current page
    result += currentPage;

    // Display right middle pages
    if (rightMid < rightEnd) {
      for (i = current + 1; i <= rightMid; i++) {
        result += pageLink(i);
      }
    }

    // Display spaces between edges and middle pages
    if (space && total - endSize - midSize > current) {
      result += spaceHtml;
    }

    // Dispaly pages on the right edge
    for (i = rightEnd; i <= total; i++) {
      result += pageLink(i);
    }
  }

  // Display the link to the next page
  if (prevNext && current < total) {



    result += '            <li class="list-inline-item">\
                  <a class="u-pagination-v1__item g-brd-secondary-light-v2 g-brd-primary--hover g-color-gray-dark-v5 g-color-primary--hover g-font-size-12 rounded g-px-15 g-py-5 g-ml-15" href="' + link(current + 1) + '" aria-label="Next">\
                    <span aria-hidden="true">\
                      ' + nextText + '\
                      <i class="ml-2 fa fa-angle-right"></i>\
                    </span>\
                    <span class="sr-only">' + nextText + '</span>\
                  </a>\
                </li>';
  }



  return '<!-- Pagination -->\
  <div class="container g-pb-100">\
    <nav aria-label="Page Navigation">\
      <ul class="list-inline text-center mb-0">\
        '+result+'\
      </ul>\
    </nav>\
  </div>\
  <!-- End Pagination -->';
};

/// 生成 Page Number
hexo.extend.helper.register('pgn', paginatorHelper);

````

在咱们需要插入分页控件的地方使用
````
<%- pgn() %>
````

### 更多

更多的辅助函数都可以自己查看，可以在官方网站 [HEXO](hexo.io)查看文档
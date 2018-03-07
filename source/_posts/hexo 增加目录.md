---
categories: 博客历程
title: hexo 增加目录
tags:
  - 博客美化
  - hexo
date: 2018-03-01 22:41:00
---

一直都想给自己的也看增加一个目录，默认的hexo是有默认的目录登记的

## 官方示例 - toc

解析内容中的标题标签 (h1~h6) 并插入目录。

Hexo博客系统的核心支持生成目录（Table of Contents）,生成目录之后，由于没有配置的时候，如果文章目录结构很大的话会出现问题。所以我希望增加一个滑动的时候，展开和隐藏目录结构的方法。这样也会显的非常酷炫=

接下来的代码多半都是在 NEXT HEXO THEME中获得的，在这里非常感谢作者，毕竟我第一个博客主题就是用的NEXT，只是又一次作者的某个版本修改的非常多，导致我的博客挂掉了... 我就决定要自己写一个模版，至少不要因为主题升级版本博客死掉了。

<!-- more -->

````ejs
<%- toc(str, [options]) %>
````

| 参数 | 描述 | 默认值 |
| - | :-: | :-: |
| class | Class 名称 | toc |
| list_number | 显示编号 | true |

### 示例

````ejs
<%- toc(page.content) %>
````

## 自定义 自己的目录结构

接下来我们会一步步的完成咱们的目录结构以及动画

### 生成目录

````
  <div class="g-mb-40">

    <div class="g-mb-40 post-toc">
      <div class="u-heading-v3-1 g-mb-30">
        <h2 class="h5 u-heading-v3__title g-color-gray-dark-v1 text-uppercase g-brd-primary">目录</h2>
      </div>

      <%- toc(page.content,{"class":"post-nav"})%>

    </div>
  </div>
````

### 增加CSS

````css

<style>
  .post-toc {
    overflow: auto;
  }

  .post-toc ol {
    margin: 0;
    padding: 0 2px 5px 10px;
    text-align: left;
    list-style: none;
    font-size: 14px;
  }

  .post-toc ol>ol {
    padding-left: 0;
  }

  .post-toc ol a {
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: 0s;
    transition-property: all;
    color: #111;
    border-bottom-color: #555;
  }

  .post-toc ol a:hover {
    color: #4f72c1;
    border-bottom-color: #ccc;
  }

  .post-toc .post-nav-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.8;
  }

  .post-toc .post-nav .post-nav-child {
    display: none;
  }

  .post-toc .post-nav .active>.post-nav-child {
    display: block;
  }

  .post-toc .post-nav .active-current>.post-nav-child {
    display: block;
  }

  .post-toc .post-nav .active-current>.post-nav-child>.post-nav-item {
    display: block;
  }

  .post-toc .post-nav .active>a {
    color: #6281c8;
    border-bottom-color: #87daff;
  }

  .post-toc .post-nav .active-current>a {
    color: #6281c8;
  }

  .post-toc .post-nav .active-current>a:hover {
    color: #87daff;
  }
</style>

````

### 增加js方法实现
````js
<script type="text/javascript">
  function escapeSelector(selector) {
    return selector.replace(/[!"$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
  }

  +
  function($) {
    'use strict';

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
      this.$body = $(document.body)
      this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
      this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
      this.selector = (this.options.target || '') + ' .post-nav li > a'
      this.offsets = []
      this.targets = []
      this.activeTarget = null
      this.scrollHeight = 0

      this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
      this.refresh()
      this.process()
    }

    ScrollSpy.VERSION = '3.3.2'

    ScrollSpy.DEFAULTS = {
      offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function() {
      return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function() {
      var that = this
      var offsetMethod = 'offset'
      var offsetBase = 0

      this.offsets = []
      this.targets = []
      this.scrollHeight = this.getScrollHeight()

      if (!$.isWindow(this.$scrollElement[0])) {
        offsetMethod = 'position'
        offsetBase = this.$scrollElement.scrollTop()
      }

      this.$body
        .find(this.selector)
        .map(function() {
          var $el = $(this)
          var href = $el.data('target') || $el.attr('href')
          var $href = /^#./.test(href) && $(escapeSelector(href)) // Need to escape selector.

          return ($href &&
            $href.length &&
            $href.is(':visible') && [
              [$href[offsetMethod]().top + offsetBase, href]
            ]) || null
        })
        .sort(function(a, b) {
          return a[0] - b[0]
        })
        .each(function() {
          that.offsets.push(this[0])
          that.targets.push(this[1])
        })


    }

    ScrollSpy.prototype.process = function() {
      var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
      var scrollHeight = this.getScrollHeight()
      var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
      var offsets = this.offsets
      var targets = this.targets
      var activeTarget = this.activeTarget
      var i

      if (this.scrollHeight != scrollHeight) {
        this.refresh()
      }

      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
      }

      if (activeTarget && scrollTop < offsets[0]) {
        $(this.selector).trigger('clear.bs.scrollspy') // Add a custom event.
        this.activeTarget = null
        return this.clear()
      }

      for (i = offsets.length; i--;) {
        activeTarget != targets[i] &&
          scrollTop >= offsets[i] &&
          (!offsets[i + 1] || scrollTop <= offsets[i + 1]) &&
          this.activate(targets[i])
      }
    }

    ScrollSpy.prototype.activate = function(target) {
      this.activeTarget = target

      this.clear()

      var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

      var active = $(selector)
        .parents('li')
        .addClass('active')

      if (active.parent('.dropdown-menu').length) {
        active = active
          .closest('li.dropdown')
          .addClass('active')
      }

      active.trigger('activate.bs.scrollspy')
    }

    ScrollSpy.prototype.clear = function() {
      $(this.selector)
        .parentsUntil(this.options.target, '.active')
        .removeClass('active')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
      return this.each(function() {
        var $this = $(this)
        var data = $this.data('bs.scrollspy')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function() {
      $.fn.scrollspy = old
      return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function() {
      $('[data-spy="scroll"]').each(function() {
        var $spy = $(this)
        Plugin.call($spy, $spy.data())
      })
    })

  }(jQuery);
</script>

````

## 完成

这个时候我们已经完成了目录，多层目录，滑动时候就可以看到展开和合并效果了。

### 需要注意的问题

我们的目录结构，必须是大小嵌套的

````
这种方式是正确的
#
##
###
###

这种发式就是错误的
##
#
###
##

````

### 没有完成的问题

如果某个层级的目录过多，会导致目录视图超出视图范围，这个问题，暂时还没考虑好如何解决，只能以后写文章的时候注意不要过多的某个层级的目录

在移动模式的状态下，其实是不用展示的，但是现在因为技术能力问题，隐藏不了...先这样吧
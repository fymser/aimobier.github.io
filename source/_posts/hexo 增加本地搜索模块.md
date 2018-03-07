---
categories: 博客历程
title: hexo 增加本地搜索模块
tags:
  - 博客美化
  - hexo
date: 2018-01-17 18:41:00
---

马上要下班了,【笔芯】。

一直想做一个博客的搜索，拖了很久，本来看别人用 Swifty搜索之类的，都开始收费了！  日日！  作为一个穷屌，我认为只要是涉及到收费，就一定不是好公司！！手动 doge～

好吧，那咱们就自己LocalSearch吧。这个博客的本地搜索，我做了一天半才做完，本来不是很难的功能，因为本身人家的搜索的数据都给你了。你就是负责一个显示怎么就这么难？

好吧，确实好难啊，，，，我这个博客用的是 unify 的 HTML 模版，本身他没有搜索结果展示的相关的，我得自己想如何展示，一点点的抠出来了。接下来我主要来讲解一下我如何做的吧。

<!--more-->

### 生成 Search.xml

好吧，search 是 Hexo 的 `hexo-generator-search`插件生成的，具体我没有去研究，但是我认为他提供的内容太少了，连文章时间都没有提供！不五星好评，有时间重新写一下，写成json的～         
首先我我们需要在项目中引入这个插件。

1. 在package.json 中引入 `hexo-generator-search` 依赖
2. 或者直接运行 `npm install hexo-generator-search` 命令

完成之后，配置 博客的 `_config.yml` 在任意位置添加该配置

````yml
# Search
## search some post in our blog
search:
  path: search.xml
  field: all
````

之后使用 ` hexo clean && hexo g && hexo s` 查看 public 文件夹下是不是出现了 `search.xml`，如果出现。OK 你的第一步已经完成了。如果没有，大兄弟～  重新看看 再来一遍～

### 产生搜索内容
好吧，之后的步骤其实就是 ajax 请求这个xml 之后解析该文件获取里面的标题，内容以及url
````js
var search_path = "<%= config.search.path %>";
if (search_path.length == 0) {
  search_path = "search.xml";
}
var path = "<%= config.root %>" + search_path;
$.ajax({
  url: path,
  dataType: "xml",
  success: function(xmlResponse) {
    // get the contents from search data
    var datas = $("entry", xmlResponse).map(function() {
      return {
        title: $("title", this).text(),
        content: $("content", this).text(),
        url: $("url", this).text()
      };
    }).get();

    // 此处的 data 就是你需要的东西，你可以自己查看 xml 内的构成 在 上方的 datas 生成方法哪修改你需要的东西
  }
});
````

获取到了我们需要的数据之后，我们就需要筛选内容了。
````js
datas.forEach(function(data) {

  // ata.title 文章标题
  // ata.content 文章内容
  // ata.url 文章地址
  data_title.indexOf(keyword);
  data_content.indexOf(keyword);
  /// 这个时候就可以判断 这个内容是不是 存在 关键字了

});
````

咱们在获取到第一个 index 之后其实就可以停止了。接下来我们获取到这个第一个 index 作为 String .subStr 第一个参数。如何获取第二个参数呢？100个200个都行的，自己决定，但是为了防止截取字符串的时候出现问题，我们需要判断，咱们的 start + 咱们详解去的长度 是不是尝过了 整篇内容的长度，如果是 那么 end index 就是本片篇文章的 长度-1。

咱们有时候还需要高亮 关键字，这个很简单，当我们按照以上方法，截取完成字符串之后

````js
  var regS = new RegExp(keyword, "gi");
  content = content.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
````
之后我们设置  search-keyword 的calss 就可以了～

### 使用 Datatables 分页展示内容
到了以上其实就已经可以了,你只需要找到自己的需要的筛选结果显示器就可以了的。但是无奈我用的这套模版没有只能自己开发了。而且还遇到了一个问题。在小屏幕的时候显示的很差强人意.. 目前因为不熟悉 html 前端的开发，先放弃了。     
首先来说我们做这个显示结果总结的一些知识点吧。

#### DataTable JavaScript DataSource Refresh

关于这个筛选出来结果之后重新复制到 DataTables 出现了一个不可以重新 init 的问题，所以在查找了一些资料之后，发现了解决办法。

````js
var SearchDataTablesElment;
if (!SearchDataTablesElment) {
  SearchDataTablesElment = $("#PostSearchResults").DataTable({
    data: datas
  );
} else {
  SearchDataTablesElment.clear().rows.add(datas).draw();
}
````
我们可以通过判断 Table 是否存在，之后来觉的是生成还是重新绘制行。

#### DataTables 一些配置
关于 这个控件如果熟悉的话 就不需要继续看了，，我这是以前用过，但是现在许久没用了，自然就需要重新看了。。。
````js
{
  data: datas,
  autoWidth: false,
  ordering: false,
  searching: false,
  lengthChange: false,
  pageLength: 4,
  info: false,
  pagingType: "cutsomPage",
  footerCallback: function(tfoot, data, start, end, display) {

    var keyWorkd = "<span style='color: #6281c8;font-weight: bold;'>" + $("#PostSearchInput").val() + "</span>";

    var title = "查询[" + keyWorkd + "]结果共" + data.length + "个,总耗时" + times / 1000 + "秒";

    $("#infomessagelabel").html(title);
  },
  columns: [{
    title: ""
  }]
}
````
这是我的一些配置。在[这里查看更多的API](https://datatables.net/reference/option/)

#### Custom DataTables pagingType

这里真的是好麻烦的，，差了好多资料，大多都是一些修改 分页器的 Class这些东西的。涉及到其他的话就看不到了。最后终于还是在(官方网站)[https://datatables.net/plug-ins/pagination/]找到了方法。        
你也可以查看我的(自定义方法)[/assets/js/helpers/hs.pages.table.js]，我这里设置到了一些创建 包裹 控件的方法。

还有一些其他的东西，比如 监听 ecs 以及 左右键位来换页。代码如下。当然你也可以自己在这个HTML中查找，当时没有c抽象成js文件，直接就是写在这里面的。
````js

  function WatchLeftAndRightKeyWork() {

    $(document).keydown(function(event) {

      var pointEvent = event.which == 37 || event.which == 39 || event.which == 27 || event.which == 96;

      var pointStatus = $('#searchdownview').css('display') != 'none' || $("#PostSearchInput").is(':focus') || $("#PostSearchInput").val().length > 0;

      if (pointEvent && pointStatus) {
        $("#PostSearchInput").blur(); // 失去焦点
        event.preventDefault(); // 组织键盘
        switch (event.which) { //判断按键;
          case 37: // 上一页
            SearchDataTablesElment.page('previous').draw('page');
            break;
          case 39: // 下一页
            SearchDataTablesElment.page('next').draw('page');
            break;
          case 27:
          case 96:
            $("#PostSearchInput").val("");
            $("#PostSearchInput").trigger("input");
            break;
          default:
            break;
        }
      }
    });
  }
````

#### 关于TableView中有些内容会超出div的情况
在这个问题上，我偶尔发现当我搜索结果出现大段的英文的时候，不会出现折行而是超出父控件。

````css

  #searchdownview table {
    table-layout: fixed;
  }

  #searchdownview td {

    word-break: break-all;
    word-wrap: break-word;
  }
````

#### 关闭搜索输入框搜索历史

另外 关于搜索输入框偶尔展示输入记录。`autocomplete="off"`.... 博大... 程序员 没有google 百度，，，难以想象。。。

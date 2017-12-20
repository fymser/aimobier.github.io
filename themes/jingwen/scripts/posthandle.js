var cheerio;

/// 创建一个 pfi 辅助函数 用来获取文章中的第一个图片
hexo.extend.helper.register('ph', function(content) {

  if (!cheerio) cheerio = require('cheerio');

  var $ = cheerio.load(content);

  ulliHandle($);
  codeHandle($);
  imageHandle($);
  blockquoteHandle($);

  return $.html();
});

function ulliHandle($){

  $("ul").each(function(){

    $(this).addClass("g-list-style-circle");
  });
}

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

/// 图片的处理
function imageHandle($){

  $("img").each(function(){

    var url = $(this).attr("src");
    var title = $(this).attr("title");

    var replaceString = '\
      <figure class="mb-4">\
\
      <a class="js-fancybox-thumbs" href="'+url+'" title="Lightbox Gallery" data-fancybox-gallery="lightbox-gallery-2" data-fancybox-speed="500" data-fancybox-slide-speed="1000">\
            <img class="img-fluid" src="'+url+'" alt="Image Description">\
          </a>';

      if (title) {
        replaceString += '<figcaption class="figure-caption g-font-size-12 g-color-gray-dark-v4 g-mt-5 text-center">\
        '+title+'</figcaption>';
      }

    replaceString += '</figure>';

    $(this).replaceWith($(replaceString));
  });
}

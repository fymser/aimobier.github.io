/**
 * Created by jingwenzheng on 2018/3/8.
 */
var cheerio;

hexo.extend.filter.register('after_post_render', function(data){

    if (!cheerio) cheerio = require('cheerio');

    var $ = cheerio.load(data.content);

    ulliHandle($);
    codeHandle($);
    imageHandle($);
    blockquoteHandle($);
    handleTable($);

    data.content = $.html();

    return data;
});


function handleTable($){

    $("table").each(function () {
        let content = $(this).html();
        let replaceString = ' \
            <div class="card g-brd-bluegray rounded-0 g-mb-30">\
                <h3 class="card-header g-bg-linkedin g-brd-transparent g-color-white g-font-size-13 rounded-0 mb-0"><i class="fa fa-table g-mr-5"></i>我就一展示数据的表格 </h3>\
                <div class="table-responsive">\
                    <table class="table table-striped u-table--v1 mb-0">'+content+'\
                    </table>\
                </div>\
            </div>';
        $(this).replaceWith($(replaceString));
    })
}

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
                                <div class="g-brd-around g-brd-gray-light-v4 g-brd-2 g-brd-red-left g-line-height-1_8 g-pa-30 g-mb-30">\
                                  <em style="padding:0px;margin:0px;">'+content+'</em>\
                                </div>\
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
           <figure class="mb-4 text-center">\
              <a class="js-fancybox-thumbs" href="'+url+'" title="Lightbox Gallery" data-fancybox-gallery="lightbox-gallery-2" data-fancybox-speed="500" data-fancybox-slide-speed="1000">\
                <br/><img class="img-fluid g-brd-around g-brd-gray-light-v2 g-rounded-3 g-pl-90" src="'+url+'" alt="Image Description">\
              </a>';
        if (title) {
            replaceString += '<figcaption class="figure-caption g-font-size-12 g-color-gray-dark-v4 g-mt-5 text-center">'+title+'</figcaption>';
        }
        replaceString += '</figure>';
        $(this).replaceWith($(replaceString));
    });
}

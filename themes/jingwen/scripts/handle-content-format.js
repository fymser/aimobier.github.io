/**
 * Created by jingwenzheng on 2018/3/8.
 */
var cheerio;

hexo.extend.filter.register('after_post_render', function(data){

    const appendHtmlString = '\
    <p hidden id="CurrentFileName">'+data.full_source.split("/").slice(-1)[0]+'</p>\
    ';

    data.content += appendHtmlString;

    if (!cheerio) cheerio = require('cheerio');

    var $ = cheerio.load(data.content, {decodeEntities: false});

    ulliHandle($);
    codeHandle($);
    imageHandle($);
    blockquoteHandle($);
    handleTable($);

    handleTitle($); 

    data.content = $.html();

    return data;
});

/// handle 任意标签 都可以增加概述行
/// handle = "nohandle" 表示为 不需要处理

function handleTable($){

    $("table[handle!='nohandle']").each(function () {
        let content = $(this).html();
        let replaceString = ' \
            <div class="card g-brd-bluegray rounded-0 g-mb-30">\
                <strong class="card-header g-bg-linkedin g-brd-transparent g-color-white g-font-size-13 rounded-0 mb-0"><i class="fa fa-table g-mr-5"></i>我就一展示数据的表格 </strong>\
                <div class="table-responsive">\
                    <table class="table table-striped u-table--v1 mb-0">'+content+'\
                    </table>\
                </div>\
            </div>';
        $(this).replaceWith($(replaceString));
    })
}

function ulliHandle($){

    $("ul[handle!='nohandle']").each(function(){
        $(this).addClass("g-list-style-circle");
    });
}

/// 代码 处理方法
function codeHandle($){
    $("pre[handle!='nohandle']").each(function(){
        if (!$(this).attr("class")) {
            $(this).addClass('line-numbers language-txt');
            $(this).find("code").addClass('language-txt')
        }
        $(this).addClass("g-mb-30");
    });
}

// 引用 内容的配置
function blockquoteHandle($){

    $("blockquote[handle!='nohandle']").each(function(){
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

    $("img[handle!='nohandle']").each(function(){

        var url = $(this).attr("src");
        var title = $(this).attr("title");


      // <figure class="mb-4 text-center ">
      //   <img class="img-fluid g-brd-around g-brd-gray-light-v4 g-line-height-2" src="<%- name.src %>">
      //   <% if (name.title){ %>
      //     <figcaption class="figure-caption g-font-size-12 g-color-gray-dark-v4 g-mt-5 text-center">
      //       <%- name.title %>
      //     </figcaption>
      //     <%}%>
      // </figure>

        var replaceString = '\
           <figure class="mb-4 text-center">\
              <a class="js-fancybox-thumbs" href="'+url+'" title="Lightbox Gallery" data-fancybox-gallery="lightbox-gallery-2" data-fancybox-speed="500" data-fancybox-slide-speed="1000">\
                <br/><img class="img-fluid g-brd-around g-brd-gray-light-v4 g-line-height-2" src="'+url+'" alt="Image Description">\
              </a>';
        if (title) {
            replaceString += '<figcaption class="figure-caption g-font-size-12 g-color-gray-dark-v4 g-mt-5 text-center">'+title+'</figcaption>';
        }
        replaceString += '</figure>';
        $(this).replaceWith($(replaceString));
    });
}

function handleTitle($){
    ["H1","H2","H3","H4","H5","H6"].forEach(function(tagStr){
        let content = "<br/><span class='g-font-size-14 g-color-gray-dark-v4'>"+tagStr+"   </span>"
        $(tagStr).each(function(){
            $(this).css('display','inline');
            $(this).before(content);
        });
    });
}

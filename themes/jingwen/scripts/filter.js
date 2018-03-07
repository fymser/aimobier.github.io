hexo.extend.filter.register('after_post_render', function(data){

    const prefix = '<div class="card g-brd-bluegray rounded-0 g-mb-30">\
        <h3 class="card-header g-bg-linkedin g-brd-transparent g-color-white g-font-size-13 rounded-0 mb-0">\
        <i class="fa fa-table g-mr-5"></i>\
我就一展示数据的表格\
        </h3>\
        <div class="table-responsive">\
        <table class="table table-striped u-table--v1 mb-0">';

    const after = '</table>\
        </div>\
        </div>';

    data.content = data.content.replace(/<table>/, prefix);
    data.content = data.content.replace(/<\/table>/, after);
    data.content = data.content.replace(/<img/, '<img class = "g-pl-90" ');

    return data;
});

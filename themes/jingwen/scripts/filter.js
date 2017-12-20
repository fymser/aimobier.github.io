hexo.extend.filter.register('after_post_render', function(data){

    data.content = data.content.replace(/<table>/, '<table class = "table table-bordered">');
        data.content = data.content.replace(/<img/, '<img class = "g-pl-90" ');

    return data;
});

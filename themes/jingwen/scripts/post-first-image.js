var cheerio;


/// 创建一个 pfi 辅助函数 用来获取文章中的第一个图片
hexo.extend.helper.register('pfi', function(content) {

  if (!cheerio) cheerio = require('cheerio');

  var $ = cheerio.load(content);

  return {
    "src": $("img").first().attr("src"),
    "title": $("img").first().attr("title"),
    "alt": $("img").first().attr("alt")
  };
});


/// 获取文章简介的text方法
hexo.extend.helper.register('pet', function(content) {

  if (!cheerio) cheerio = require('cheerio');

  var $ = cheerio.load(content);

  $("img").remove();

  return $.html();
});

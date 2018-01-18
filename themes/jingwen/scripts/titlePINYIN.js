var hexo = hexo || {};
var config = hexo.config;

var fs = require('hexo-fs');
var pinyin = require("pinyin");
var front = require('hexo-front-matter');



hexo.extend.filter.register('before_post_render', function(data) {
  if (!config.transform || !config.url || data.layout !== 'post') {
    return data;
  }
  let tmpPost = front.parse(data.raw);
  let title = data.title;
  var final_title_str = "";
  pinyin(title, { style: pinyin.STYLE_FIRST_LETTER, heteronym: true }).forEach(function(value,index,array){
    final_title_str += value[0];
  });
  final_title_str=final_title_str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
  final_title_str = final_title_str.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/,"");
  tmpPost.permalink = final_title_str;
  // console.log(final_title_str);
  let postStr = front.stringify(tmpPost);
  postStr = '---\n' + postStr;
  fs.writeFileSync(data.full_source, postStr, 'utf-8');

  return data;
});

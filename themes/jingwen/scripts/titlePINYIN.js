var hexo = hexo || {};
var config = hexo.config;

const pinyin = require("pinyin");
const crypto = require('crypto');

const permalink = require('hexo/lib/plugins/filter/post_permalink')
hexo.extend.filter.unregister('post_permalink', permalink);

hexo.extend.filter.register('post_permalink', function(data){

    /// 如果是将文章转换为 pinyin
    if(config.transform.toLowerCase() === "pinyin"){
        var final_title_str = pinyin(data.title, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true}).join("");
        final_title_str = final_title_str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
        final_title_str = final_title_str.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/, "");
        return final_title_str+".html"
    }

    if(config.transform.toLowerCase() === "sha256"){
        const secret = "suibian"
        const hash = crypto.createHmac('sha256',secret).update(data.title).digest("hex");
        return hash+".html";
    }

    return permalink.apply(this, [data])
});
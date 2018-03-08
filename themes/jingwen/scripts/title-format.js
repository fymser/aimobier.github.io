
var hexo = hexo || {};
var config = hexo.config;

var _ = require('lodash');
var util = require('hexo-util');
var pathFn = require('path');
var Permalink = util.Permalink;
var permalink;

const post_permalink = require('hexo/lib/plugins/filter/post_permalink');
hexo.extend.filter.unregister('post_permalink', post_permalink);
hexo.extend.filter.register('post_permalink', function(data){

    var meta = metah({
        id: data.id || data._id,
        title: data.slug,
        name: typeof data.slug === 'string' ? pathFn.basename(data.slug) : '',
        post_title: util.slugize(data.title, {transform: 1}),
        year: data.date.format('YYYY'),
        month: data.date.format('MM'),
        day: data.date.format('DD'),
        i_month: data.date.format('M'),
        i_day: data.date.format('D')
    });

    if (!permalink || permalink.rule !== config.permalink) {
        permalink = new Permalink(config.permalink);
    }

    var categories = data.categories;

    if (categories.length) {
        meta.category = categories.last().slug;
    } else {
        meta.category = config.default_category;
    }

    var keys = Object.keys(data);
    var key = '';

    for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        if (meta.hasOwnProperty(key)) continue;

        // Use Object.getOwnPropertyDescriptor to copy getters to avoid "Maximum call
        // stack size exceeded" error
        Object.defineProperty(meta, key, Object.getOwnPropertyDescriptor(data, key));
    }

    return permalink.stringify(_.defaults(meta, config.permalink_defaults));
});


function metah(meta) {

    if (typeof config.transform !== "string"){
        return meta
    }

    const pinyin = require("pinyin");
    const crypto = require('crypto');

    /// 如果是将文章转换为 pinyin
    if(config.transform.toLowerCase() === "pinyin"){
        meta.title = pinyin(meta.name, {style: pinyin.STYLE_FIRST_LETTER, heteronym: true}).join("");
    }else if(config.transform.toLowerCase() === "sha256"){
        meta.title = crypto.createHmac('sha256',"suibian").update(data.id).digest("hex");
    }else if(config.transform.toLowerCase() === "id"){
        meta.title = meta.id;
    }

    return meta
}
---
categories: IOS
title: WKWebView IOS8 下 loadHtmlString错误
tags:
  - WKWebView
  - Systematic distinction
date: 2017-05-17 14:40:00
---

![](/publicFiles/images/stock-photo/stock-photo-212184725.jpg "不是现实支撑的梦想，而是梦想支撑了现实。——星空日记")

<!-- more -->

做项目的时候，需要展示新闻详情。经过一系列的调研，最终选定为使用 webview。
因为需要支持ios7，所以我在详情页就需要同时具备 UIWebView 和 WKWebView，两种。           
由于IOS8才开始出现的WKWebView，所以自然而然的我当然想从ios8就是用WkwebVIew。毕竟性能好，，，各种夸       
但是很快就遇见一个问题，本来呢，在ios9，ios10 ，我直接调用方法就可以。

````objectivec
[_wkWebView loadHTMLString:htmlStr baseURL:[NSBundle oddity_shareBundle].bundleURL];
````
在htmlStr 里面，我有设置的 本地图片，本地js，本地css。在 ios9-10 一切OK。但是偏偏ios8不行，加载出来本地图片，但是本地js本地css加载不出来……      

一顿谷歌，没找到……  最终心思，那成，放弃吧……  直接ios7-8 都是用 UIWebView吧。

找到了一些[参考](http://stackoverflow.com/questions/24882834/wkwebview-not-loading-local-files-under-ios-8)

但是，后来有次无聊的时候，想到了，把js和css全部放在html字符串不就好了吗？

于是乎，有了这样子的一段代码

````objectivec
if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0 && [[[UIDevice currentDevice] systemVersion] floatValue] < 9.0) {

        NSString *file1 =  [[NSBundle oddity_shareBundle] pathForResource:@"jquery" ofType:@"js"];
        NSString *file2 =  [[NSBundle oddity_shareBundle] pathForResource:@"bootstrap.min" ofType:@"css"];
        NSString *file3 =  [[NSBundle oddity_shareBundle] pathForResource:@"content" ofType:@"css"];
        if (file1 && file2 && file3) {

            NSString *fileStr1 = [NSString stringWithContentsOfFile:file1 encoding:(NSUTF8StringEncoding) error:nil];
            NSString *fileStr2 = [NSString stringWithContentsOfFile:file2 encoding:(NSUTF8StringEncoding) error:nil];
            NSString *fileStr3 = [NSString stringWithContentsOfFile:file3 encoding:(NSUTF8StringEncoding) error:nil];

            topHeader = [NSString stringWithFormat:@"<script type=\"text/javascript\">%@</script><style type=\"text/css\">%@</style><style type=\"text/css\">%@</style>",fileStr1,fileStr2,fileStr3];
        }
    }

````

其实还可以优化的，比如这个文件其实礼物上只需要读取一次就可以的，但是我现在会每次都读取，这个时候就可以做一个缓存。或者其他云云。

我这里只是提供一个思路。。。

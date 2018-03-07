---
categories: IOS
title: WKWebView 制作详情页的一些经验
tags:
  - swift
  - WKWebView
date: 2016-09-21 03:25:00
---

## Hello World

好久好久没有更新过博客了，今天去面试了一家公司。被询问到关于资讯类App的详情页问题，想到了很多之前做详情页时候遇见的问题和解决的问题，所以心血来潮的想记录下来。

![](/publicFiles/images/stock-photo/stock-photo-184033745.jpg "只有一种英雄主义，就是在认清这个世界之后依然热爱他。 ——罗曼罗兰。")

<!-- more -->

## 如何去展示一个详情页呢

那么废话少说，亮剑吧！

### 如何去显示一个WKWebView呢

其实怎么说呢，我觉的其实吧。每个人都大同小异。无非就是如何将数据转换成Html并且将字符串传递给WebView。之后展示出来而已。那么我们很快就会遇到第一个问题。如何将数据转换成Html格式的字符串呢？

#### 搞定我们的模板君

我不清楚其他开发者们遇见的数据结构，但是我的数据结构如下/

````swift
//
//  NewContent.swift
//  Journalism
//
//  Created by Mister on 16/5/30.
//  Copyright © 2016年 aimobier. All rights reserved.
//

import RealmSwift

///  频道的数据模型
open class Content: Object {

    /// 用于获取评论的 docid
    dynamic var txt: String? = nil

    /// 新闻Url
    dynamic var img: String? = nil

    /// 新闻标题
    dynamic var vid: String? = nil
}

///  频道的数据模型
open class NewContent: Object {
    /// 新闻ID
    dynamic var nid = 1
    // 新闻的详情
    let content = List<Content>() // Should be declared with `let`
    // More ……
}
````

详情页对象包含三个字段 `img`,`txt`,`vid`。也就是图片，文字，视频三种类型。
那这样就简单了。把他们拼装成一个Html 还不简单~  

````

String += String // ?????  这样子？  我是拒绝的……

````

之后想起来之前做服务的时候 jsq，ejs… 这些视图模板都是可以完成现在的需求的，不知道IOS 有没有呢？

所以说！  废话！  当然有啊！ [MGTemplateEngine](https://github.com/mattgemmell/MGTemplateEngine)

这就是了~  但是！！！  问题这个大神没有使用那个第三方的管理插件来让别人导入自己的框架~  难道我又要回归到 之前那段 被拖拽引入所支配的恐惧吗？

````
???? 我还是拒绝的~~~
````

那么接下来就有两种方式来引入这个框架了~  当然了 全都是 Cocoapods的……

第一种使用 本地引入的方式：

如果你想本地引入的话，那很简单的

在你的项目根目录下建立一个文件夹 取名字呢~  就叫做 MGTemplateEngine ，之后 把 clone 下来的 MGTemplateEngine 项目放入一个新建的Classes 目录下。之后再classes 同级目录中新建一个 文件 `MGTemplateEngine.podspec`

里面的代码呢，大概写成这样子

````ruby
#
# Be sure to run `pod lib lint SwaggerClient.podspec' to ensure this is a
# valid spec and remove all comments before submitting the spec.
#
# Any lines starting with a # are optional, but encouraged
#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
    s.name             = "MGTemplateEngine"
    s.version          = "1.0.0"

    s.summary          = "奇点资讯"
    s.description      = <<-DESC
                        if you～  Shabi Boom Sha Ga la ga
                         DESC

    s.platform     = :ios, '7.0'
    s.requires_arc = true

    s.framework    = 'SystemConfiguration'

    s.homepage     = "https://github.com/swagger-api/swagger-codegen"
    s.license      = "MIT"
    s.source       = { :git => "https://github.com/swagger-api/swagger-codegen.git", :tag => "#{s.version}" }
    s.author       = { "Swagger" => "apiteam@swagger.io" }

    s.source_files = 'Classes/**/*'
    s.public_header_files = 'Classes/**/*.h'
end

````

所有说大概的目录分布呢~  是这个样子的~

````
── 项目根目录
 ├ MGTemplateEngine
 ├──────├ MGTemplateEngine.podspec
 ├──────├ Classes
 │      └──── MGTemplateEngine 所有的文件
 └ 你的其他文件
````

之后呢，在你项目中的Podfile 写下这样的代码~

````ruby
    pod 'MGTemplateEngine', :path => 'MGTemplateEngine/'     ## MGTemplateEngine组件
````

运行完成 pod install~  Woooooo~ 搞定~

第二种呢

````ruby
    pod 'JMGTemplateEngine'    
````

这个东西是我自己做的为了方便………………

运行完成 pod install~  Woooooo~ 搞定~

#### 显示出来我们的详情吧~

没什么好说的直接上代码吧

````swift
import MGTemplateEngine

extension MGTemplateEngine{

    static var shareTemplateEngine:MGTemplateEngine!{

        let templateEngine = MGTemplateEngine()

        templateEngine.matcher = ICUTemplateMatcher(templateEngine: templateEngine)

        return templateEngine
    }
}

func getHtmlResourcesString() -> String{

        let variables = ["title":self.title,"source":self.pname,"ptime":self.ptime,"theme":"normal","body":body]

        let result = MGTemplateEngine.shareTemplateEngine.processTemplateInFile(atPath: templatePath, withVariables: variables)

        return result!
    }
````

这样子我们就得到了Html 的String 对象，在这个时候，我们只要 使用WkWebView的 `loadHTMLString` 方法就OK了啊～

是的我们很快的就发现了～　　我们真的可以展示了～　　

但是，行高怎么办呢？　　那我们很快就遇到了我们的几个坎


## 遇到的坎坷

虽然展示完成了，但是接下来我们就遇到了几个问题。

接下来针对这几个问题，我来给你说说，我是怎么解决的


### WebView和JS的交互

在看接下来的之前咱们需要知道一个知识点就是WKWebVIew和js的交互

````swift
       let configuration = WKWebViewConfiguration()
       configuration.userContentController.add(self, name: "JSBridge")
       self.webView = WKWebView(frame: CGRect(origin: CGPoint.zero, size: CGSize(width: 600, height: 1000)), configuration: configuration)
````

这个`JSBridge`就是我们自定义的桥连对象，使用这个桥连对象就可以实现交互了

WKWebView -> javaScript的操作
````swift
self.webView.evaluateJavaScript("js 语句") { (data, _) in
  // data 就是反回的数据
}
````

javaScript --> WKWebView的操作
````javascript
var message = {
            "type": 0
        }
window.webkit.messageHandlers.JSBridge.postMessage(message);
````
之后再咱们的项目中实现`WKScriptMessageHandler`代理方法

````swift
public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {

       guard let bodyData = message.body as? Dictionary<String,AnyObject> else { return }

       /// bodyDaya 就是咱们的传入的对象 这里根据自己传入的类型机型 options 判断即可
   }
````

其中JSBridge 对象就是咱们的自定义桥连对象

这样就可以实现交互了

### 高度的计算问题

相信很朋友也都查阅了很多东西，知道了 调用 JS的 高度计算方法 .       

`document.getElementById('section').offsetHeight`

我的主要内容都是显示在一个 section的Div里的，你们各位也请进行自己的计算。

那好吧，我们就来做吧~~~

首先我们先监听 WebView 加载完成页面之后的事件，那么我们先实现它的Delegate吧。

````swift

/// 加载完成
public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {

  // 执行方法
  self.webView.evaluateJavaScript("document.getElementById('section').offsetHeight") { (data, _) in

              if let height = data as? CGFloat{

                  if self.webView.frame.size.height != height+35 {

                      self.webView.layoutIfNeeded()
                      self.webView.frame.size.height = height+35
                      self.tableView.tableHeaderView = self.webView
                  }
              }
          }
}
````

这样我们会发觉，好了啊~  那么接下来咱们就遇到了，咱们的第二个坎


### 图片LazyLoad的问题

可能在这里很多用户就会察觉到这个，当咱们的新闻详情很多图片的时候，咱们就会出现加载时间巨长的问题。主要是因为Html界面呢，他不是咱们的tableView,ios的加载机制，是快要显示了开始准备渲染Cell，而Html是全部渲染完成，之后你爱怎么滑怎么滑。所以当图片过大的时候。就会出现加载时间很长的问题了
那么自然而然的想到了使用咱们的lazyload。也就是俗称的 懒加载。

现在世面上的懒加载，都是一个样子的，给你提供一个自定义的额属性。比如`lazysrc`，设置成咱们需要加载的网络图片，而`src`设置成咱们的没有加载出来的占位图片。之后检测页面的滑动情况，当检测到快或者需要显示`<img>`标签的时候，进行吧 `lazysrc`赋值`src`的这么一个操作。

````html
<script src="jquery-1.11.0.min.js"></script>
<script src="jquery.lazyload.js?v=1.9.1"></script>
````
在网上随便找了一个测试发觉没用还是慢啊，之后抓包，发现图片还是一起加载的。即使没有滑动……

这是怎么回事儿呢？

其实不难理解，咱们的懒加载计算的是通过偏移位置来计算的，什么事偏移位置呢。。其实这个地方用图的方式更好，但是我不知道用什么画……

那么咱们给webView的设置的就是咱们的所有的html的高度，他根本就不需要偏移就可以显示所有的内容了，这也就是我们的lazyload.js 没有效果的原因了。
那么我们怎么解决这个问题呢？

我是这样做的，因为我的WebView是tableView的表视图，那么我就实现了 scrollView的代理方法

````swift
/**
  主要是为了针对于党图片延时加载之后的webvView高度问题

  - parameter scrollView: 滑动视图
  */
 public func scrollViewDidScroll(_ scrollView: UIScrollView) {

     let height = UIScreen.main.bounds.height+scrollView.contentOffset.y

     self.webView.evaluateJavaScript("scrollMethod(\(height))", completionHandler: nil)

     self.adaptionWebViewHeightMethod()
 }
````

通过这个方法不断检测页面的偏移量

````javascript
function scrollMethod(offesty) {

    $("img").each(function(index, img) {

        // <!-- 更多的操作>
    })
}
````

在这个操作里进行图片的循环跟我们传入的便宜量对比，如果快要展示了，那么咱们就把咱们设置的 属性替换成图片的src ，这个子就实现了图片的懒加载了

### 关于图片点击问题

这个点击问题，相信大家看到这里就应该已经知道该怎么做了。对了…………

当然是使用js方法桥连了

````javascript
$("#body_section img").click(function() {
       var index = $("img").index(this);
       window.webkit.messageHandlers.JSBridge.postMessage({
           "type": 1,
           "index": index
       });
   })
````


````swift
public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {

    guard let bodyData = message.body as? Dictionary<String,AnyObject> else { return }

    guard let type = bodyData["type"] as? Int else{return}

           if type == 1 {

               /// 图片展示
           }
}

````

但是这就又有了一个问题，就是咱们的webview和咱们的图片展示VC的图片加载的方式是不一样的。我这里先讲讲我的，之前找到使用 webview的缓存？还是什么的，还没有研究……


### 关于图片重复加载的问题。

其实这里的问题，就难点了，我是想了很久，该怎么解决，因为这样还涉及到一个问题，就是给图片添加进度条的问题。

先说说解决办法吧，心路历程就不说了。首先咱们的不是可以控制图片的何时加载了吗？那么咱们可不可以更厉害一点呢？让我们的图片该要加载的时候把请求链接传给我们，我们进行我们的缓存策略。`SD` `PIN` 随便了就。

答案是肯定的。

````js
$("img").each(function(index, img) {

        var datasrc = $(this).attr("data-src")

        if ($(this).offset().top < offesty + 200 && ajaxUrl.indexOf(index) == -1) {

            ajaxUrl.push(index)

            window.webkit.messageHandlers.JSBridge.postMessage({
                "type": 3,
                "index": index,
                "url": datasrc
            });
        }
    })
````

其中 ajaxurl存储了已经添加的 index 如果，没有这个东西的话，我们只要一滑动，那就蹭蹭蹭的传递给我们url，我们就有的加载了……   这可不是我们想要的。

那么在我们接收到URL的加载的请求，那么我们就开始加载吧~~

````swift
fileprivate func HandlePinDownLoadResult(_ finish:@escaping (String) -> Void,result:PINRemoteImageManagerResult){

    /// 含有静态图片
    if let img = result.image ,let base64 = UIImageJPEGRepresentation(img, 0.9)?.base64EncodedString(options: NSData.Base64EncodingOptions.init(rawValue: 0)){

        DispatchQueue.global(qos: .background).async {

            let string = "data:image/jpeg;base64,\(base64)".replaceRegex("<", with: "").replaceRegex(">", with: "")

            DispatchQueue.main.async(execute: {

                finish(string)
            })
        }
    }

    /// 含有动态图片
    if let img = result.animatedImage {

        DispatchQueue.global(qos: DispatchQoS.QoSClass.background).async {

            let base64 = img.data.base64EncodedString(options: NSData.Base64EncodingOptions.init(rawValue: 0))

            let string = "data:image/gif;base64,\(base64)".replaceRegex("<", with: "").replaceRegex(">", with: "")

            DispatchQueue.main.async(execute: {

                finish(string)
            })
        }
    }
}
````

这样我们就实现了图片的本地缓存策略了~但是问题又来了……  首先就是遇到大的图片尤其是gif那个base64解析真是慢啊…… 而且每次重新打开 webview 就算是已经下载好了，光是base64解析也要小一会儿了……

### base64的问题

那还真没好的办法，，缓存吧………………

````swift


fileprivate func DownloadImageByUrl(_ progress:@escaping (Int) -> Void,finish:@escaping (String) -> Void){

    /// 先读缓存 没有咱们再进行后续工作
    if let str = PINCache.shared().object(forKey: "hanle\(self)") as? String {

        return finish(str)
    }

    guard let url = URL(string: self) else { return }

    PINRemoteImageManager.shared().downloadImage(with: url, options: PINRemoteImageManagerDownloadOptions(), { (result) in

        self.HandlePinDownLoadResult(finish,result:result)
    }
}

/**
 处理PINRemoteImage下载完成的结果哦

 - parameter finish: 处理完成化后的回调
 - parameter result: Result to PINRemoteImageManagerResult
 */
fileprivate func HandlePinDownLoadResult(_ finish:@escaping (String) -> Void,result:PINRemoteImageManagerResult){

    /// 含有静态图片
    if let img = result.image ,let base64 = UIImageJPEGRepresentation(img, 0.9)?.base64EncodedString(options: NSData.Base64EncodingOptions.init(rawValue: 0)){

        DispatchQueue.global(qos: .background).async {

            let string = "data:image/jpeg;base64,\(base64)".replaceRegex("<", with: "").replaceRegex(">", with: "")

            DispatchQueue.main.async(execute: {

                finish(string)

                PINCache.shared().setObject(string as NSCoding, forKey: "hanle\(self)") /// 缓存
            })
        }
    }

    /// 含有动态图片
    if let img = result.animatedImage {

        DispatchQueue.global(qos: DispatchQoS.QoSClass.background).async {

            let base64 = img.data.base64EncodedString(options: NSData.Base64EncodingOptions.init(rawValue: 0))

            let string = "data:image/gif;base64,\(base64)".replaceRegex("<", with: "").replaceRegex(">", with: "")

            DispatchQueue.main.async(execute: {

                finish(string)

                PINCache.shared().setObject(string as NSCoding, forKey: "hanle\(self)") /// 缓存
            })
        }
    }
}

````

### 图片加载进度条

这个需要html配合，首先咱们每个图片也就是`<img>`标签上都生成一个进度条。无论什么样子的都行。反正你得保证我把进度传递回去了，你找的到你的空间，那么唯一标识是。index还是其他的随你了。

````swift
fileprivate func DownloadImageByUrl(_ progress:@escaping (Int) -> Void,finish:@escaping (String) -> Void){

    if let str = PINCache.shared().object(forKey: "hanle\(self)") as? String {

        return finish(str)
    }

    guard let url = URL(string: self) else { return }

    PINRemoteImageManager.shared().downloadImage(with: url, options: PINRemoteImageManagerDownloadOptions(), progressDownload: { (min, max) in

        if url.absoluteString.hasSuffix(".gif") {

            let process = Int(CGFloat(min)/CGFloat(max)*100)
            progress((process-5 < 0 ? 0 : process-5))
        }

    }) { (result) in

        self.HandlePinDownLoadResult(finish,result:result)
    }
}

````

这样咱们就获取到了进度了。

````swift
/**
    根据提供的 URL 和 需要加载完成的 Index

    - parameter url:   图片URL
    - parameter index: 图片所在的Index
    */
   fileprivate func HandleUrlAndIndex(_ url:String,index:Int){

       url.DownloadImageByUrl({ (pro) in

           DispatchQueue.main.async(execute: {

               let jsStr = "$(\"div .customProgressBar\").eq(\(index)).css(\"width\",\"\(pro)%\")"

               self.webView.evaluateJavaScript(jsStr, completionHandler: nil)
           })

           }, finish: { (base64) in

               let jsStr = "$(\"img\").eq(\(index)).attr(\"src\",\"\(base64)\")"

               self.webView.evaluateJavaScript(jsStr, completionHandler: nil)

               if url.hasSuffix(".gif") {

                   let display = "$(\"div .progress\").eq(\(index)).css(\"visibility\",\"hidden\")"

                   self.webView.evaluateJavaScript(display, completionHandler: nil)
               }
       })
   }
````

我的进度条class都叫做customProgressBar，之后我根据 index 进行的唯一性标识。
之后传入过去进度条。进行进度条的显示。

对了提醒一句 进度条特别占内存。咱们还是只给 gif 做做就算了，其他的没必要啊…………

谢谢

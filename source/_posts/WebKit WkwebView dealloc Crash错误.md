---
categories: IOS
title: WebKit WkwebView dealloc Crash错误
tags:
  - WebKit
  - Systematic distinction
date: 2017-05-17 14:19:00
---

![](/publicFiles/images/stock-photo/stock-photo-212206847.jpg "生活总是让我们遍体鳞伤，但到后来，那些受伤的地方一定会成为我们最强壮的地方。——海明威")

<!-- more -->


今天遇到一个奇怪的问题，在我 dismiss UIViewController后，我的UIViewController没有销毁，这导致内存在慢慢的增长，没有销毁。         
查了一会儿，把问题锁定在了 WKWebView上了，我开始慢慢的注释，调试，最后发现。是我的以下代码的问题。

````objectivec
self.configuration = [[WKWebViewConfiguration alloc] init];
[self.configuration.userContentController addScriptMessageHandler:self name: OddityWkWebViewConfiguration];
_wkWebView = [[OddityCustomWkWebView alloc]initWithFrame:(CGRectZero) configuration:self.configuration];
````       

在我注释了，`addScriptMessageHandler`方法之后，dealloc调用了。        
那么就知道了问题了。在 ViewDidDisapper 方法，`removeScriptMessageHandlerForName` 就好了

````objectivec
-(void)viewDidDisappear:(BOOL)animated{

    [super viewDidDisappear:animated];

    [self.configuration.userContentController removeScriptMessageHandlerForName: OddityWkWebViewConfiguration];
}
````

再后来我发现在ios的测试机上，我推出去之后会直接崩溃。控制台打印出，野指针的问题，最后确认为野指针就是 WkWebView。
后来在 [stackoverflow](http://stackoverflow.com/questions/35529080/wkwebview-crashes-on-deinit)找到了这个问题的解决。最后更新为

````objectivec

-(void)viewDidDisappear:(BOOL)animated{

    [super viewDidDisappear:animated];

    self.wkWebView.scrollView.delegate = nil;

    [self.configuration.userContentController removeScriptMessageHandlerForName: OddityWkWebViewConfiguration];
}
````


好了，不崩溃了。

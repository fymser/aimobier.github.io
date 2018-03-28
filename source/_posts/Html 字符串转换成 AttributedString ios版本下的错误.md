---
categories: IOS
title: Html 字符串转换成 AttributedString ios版本下的错误
tags:
  - AttributedString
  - iOS8 html2AttributedString error
date: 2017-05-17 14:31:00
---

在ios中想要把html字符串转换成 AttributedString ，需要使用以下方法

![](/publicFiles/images/stock-photo/stock-photo-212192603.jpg "请勇敢地向黑夜里走去<br/><br/>虽然你没有什么成功的机会，虽然你刚上路便可能横死<br/><br/>但我依然祝福你，并诅咒你。——猫腻")

<!-- more -->

````objectivec
NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithData:[title dataUsingEncoding:NSUnicodeStringEncoding]  options:@{ NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType } documentAttributes:nil error:nil];
````

这样子的话,html字符串就可以转换为 `NSMutableAttributedString` 对象，可以展示在可以展示 AttributedString的空间上，但是这个东西是有一定时间的耗时的。      
尤其是在 tableview上会消耗很大的计算时间，使滑动出现问题。那么我们就需要进行一个一步计算，并且为了更好的节省性能，我们最好做一个缓存。接下来就是我的制作方式

````objectivec
@interface OddityHtmlTitleCache()
@property(nonatomic,strong)  NSCache *sharedCache;

@end

@implementation OddityHtmlTitleCache

// 创建一个 单利的 管理器
+(OddityHtmlTitleCache *)sharedCache{

    static OddityHtmlTitleCache *sharedManager;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedManager = [[OddityHtmlTitleCache alloc]init];

        sharedManager.sharedCache = [[NSCache alloc] init];;
    });
    return sharedManager;
}

 // 根据 html字符串获取  NSAttributedString
-(NSAttributedString *)htmlTitleByString:(NSString *)title{

    // 在cache 提取
    id viewController = [self.sharedCache objectForKey:title];
    if ( viewController) {
        return viewController;
    }

    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithData:[title dataUsingEncoding:NSUnicodeStringEncoding]  options:@{ NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType } documentAttributes:nil error:nil];

    [attributedString addAttributes:@{
                                      NSFontAttributeName:[UIFont oddity_font3],
                                      } range:[attributedString.string fullRange]];

    if (attributedString) {

        [self.sharedCache setObject:attributedString forKey:title];
    }
    return attributedString;
}

@end

````

最开始，我是在ios10，测试的，没有问题，但是我的同时反馈给我。他有崩溃。        
最终我查到了,在[stackoverflow](http://stackoverflow.com/questions/28915954/nsattributedstring-initwithdata-and-nshtmltextdocumenttype-crash-if-not-on-main)，这个转的方法，在ios9.2之前，异步执行该方法都会错误的。       
且行且珍惜把……

---
categories: IOS
title: IOS10前 UITextFiled 的 placeholder 的问题
tags:
  - IOS
date: 2017-11-16 01:16:00
---

> The styled string that is displayed when there is no other text in the text field.
> This property is nil by default. If set, the placeholder string is drawn using system-defined color and the remaining style information (except the text color) of the attributed string. Assigning a new value to this property also replaces the value of the placeholder property with the same string data, albeit without any formatting information. Assigning a new value to this property does not affect any other style-related properties of the text field

这是官方的一片解释，看着都很不错的～

<!-- more -->

然而

今天我们的巨头设计师来找我，说我的输入框不居中.我不以为然，怎么可能～因为我的设备上是好的
拿来手机一看，还真是，，，好吧 赶紧找原因吧，因为我的设备是IOS11 所以我怀疑是不是IOS10的问题。
之后找了一些资料发现

> [Vertically centering a UITextField's attributedPlaceholder](https://stackoverflow.com/questions/28677519/vertically-centering-a-uitextfields-attributedplaceholder)
> [uitextfield attributedplaceholder center Google](https://www.google.com.hk/search?safe=strict&ei=WB8NWvSGG8LNmQHB0q2oBw&q=uitextfield+attributedplaceholder+center&oq=uitextfield+attributedplaceholder+c&gs_l=psy-ab.3.0.0i203k1.98408.107770.0.109474.25.19.0.0.0.0.469.2569.2-6j1j1.8.0....0...1.1j4.64.psy-ab..18.7.2272...0j0i10i203k1j0i10k1j0i10i30k1j35i39k1j0i67k1j0i30k1j0i8i30k1.0.n33G4smHqp4)

发觉这个问题还是普遍存在的 有不少人给处理自己的做法比如：

[kean](https://stackoverflow.com/users/1486308/kean)在 Stackflow中的回答

````objectivec
NSMutableParagraphStyle *style = [self.addressBar.defaultTextAttributes[NSParagraphStyleAttributeName] mutableCopy];
style.minimumLineHeight = self.addressBar.font.lineHeight - (self.addressBar.font.lineHeight - [UIFont fontWithName:@"Gotham-BookItalic" size:14.0].lineHeight) / 2.0;

self.addressBar.attributedPlaceholder = [[NSAttributedString alloc] initWithString:@"Placeholder text"
                            attributes:@{
                                         NSForegroundColorAttributeName: [UIColor colorWithRed:79/255.0f green:79/255.0f blue:79/255.0f alpha:0.5f],
                                         NSFontAttributeName : [UIFont fontWithName:@"Gotham-BookItalic" size:14.0],
                                         NSParagraphStyleAttributeName : style
                                         }
 ];
````

另外他也给出了另一种方法

>You could also override a `- (CGRect)placeholderRectForBounds:(CGRect)bounds;` method in UITextField subclass.
>
>It's messy, but it works :)

还有很多搜到的方法 我就不一一赘述了。他们的方法或多或少的都没很麻烦，而且需要进行适配，比如这种调整位置的是可以的。但是IOS11 位置又好了怎么办呢？
最终找到如下的方法，特此记录一下

````objectivec

- (CGRect)placeholderRectForBounds:(CGRect)bounds {

    return CGRectMake(0, 0 , self.bounds.size.width, self.bounds.size.height);
}

- (void)drawPlaceholderInRect:(CGRect)rect {

    [super drawPlaceholderInRect:CGRectMake(0, 0 , self.bounds.size.width, self.bounds.size.height)];
}
````

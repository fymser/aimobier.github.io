---
categories: IOS
title: WebView 与 Html Input File 以及 Upload File 出现的问题
tags:
  - WebView
  - WKWebView
  - UIWebView
  - Input
  - File
  - Bug
date: 2017-10-26 04:10:00
---

在项目中使用了WebView来显示一些内容，之后就遇到了一些问题。总结了一下

![一杯敬自由，一杯敬死亡](/publicFiles/images/stock-photo/stock-photo-233150091.jpg "你还很年轻,将来你会遇到很多人,经历很多事,得到很多,也会失去很多<br/><br/>但无论如何,有两样东西,你绝不能丢弃,一个叫良心,另一个叫理想")

<!-- more -->

## 遇到 Input File 出现的 崩溃问题

这个问题其实还是比较好解决 无非就是权限问题 具体的key值

请直接访问 [Cocoa Keys](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html)

## Model 的ViewController 在上传文件后 会直接 dismiss掉

解决办法 在 Model 出来的 ViewController 加入 UINavigationController

之后重写 UINavigationController 的方法

````objectivec
-(void)dismissViewControllerAnimated:(BOOL)flag completion:(void (^)(void))completion{

    if (self.presentedViewController) {

        [super dismissViewControllerAnimated:flag completion:completion];
    }
}
````

### 自己重写pan dismiss 方法的障碍解决

在我们想重写dismiss的方法时，会绑定一个手势。但是在 WebView中已经存在了很多手势了。
其中就包括 两个 `UIScreenEdgePanGestureRecognizer`，一个进行前进操作 一个进行后退操作

我们想重写pan方法进行前进后退dismiss的话，暂时只有两种办法，接下来我们看看那种方法可以使用吧

#### 第一种 自己去写 WebView 中的 pan 手势

首先想到的就是这个方法，因为这个方法很省事儿，可定义程度高，当然这是可行的情况下

事实证明，我们在第一个问题就被拌住了，我们没有办法去渐进式的 前进网页 和 后退 所以这个问题不得不放弃

#### 第二种 使用 UIGestureRecognizerDelegate 来暂时关闭 webview中的手势

这个方法最终实践是可以的

首先我们获取到 后退的手势 在创建 WebView 之后，我们这样获取

##### 获取到 手势 并且设置 delegate

````objectivec
for (UIGestureRecognizer *reconizer in self.wkWebView.gestureRecognizers) {

        /// 如果获取的 手势 类型是 ScreenEdgePanGestureRecognizer 类型
        if ([reconizer isKindOfClass:UIScreenEdgePanGestureRecognizer.class] ) {

            /// 如果手势对象是 返回的收视对象 作出以下处理
            if (((UIScreenEdgePanGestureRecognizer*)reconizer).edges == UIRectEdgeLeft) {

                reconizer.delegate = self;
            }

            /// 该手势就是 前进手势
            if (((UIScreenEdgePanGestureRecognizer*)reconizer).edges == UIRectEdgeRight) {

            }
        }
    }
````

##### 根据WebView 是否可以返回 控制手势是否可用

获取到 delegate之后我们就可以进行操作了 接下来实现 delegate 的方法

````objectivec

/// 当WebView 不可以返回到时候，我们不让该手势触发
-(BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer{

    return self.wkWebView.canGoBack;
}
````

##### 写 推出视图的方法

````objectivec
-(instancetype)initWithRootViewController:(UIViewController *)rootViewController{

    self = [super initWithRootViewController:rootViewController];

    if (self) {

        _presentdAnimation = [[BaseViewControllerPresentdAnimation alloc] init];
        _dismissedAnimation = [[BaseViewControllerDismissedAnimation alloc] init];
        _interactiveTransitioning = [[BasePresentdAnimationInteractiveTransition alloc]init];

        self.navigationBarHidden = true;

        self.transitioningDelegate = self;
        self.modalPresentationCapturesStatusBarAppearance = true;

        /// 在获取到 RootViewController 完成 手势的绑定 这样在 Wkwebview 手势不可用的时候 该手势就可以使用了
        _panGestureRecognizer = [[UIScreenEdgePanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePanGestureRecognizerMethod:)];
        _panGestureRecognizer.edges = UIRectEdgeLeft;
        [rootViewController.view addGestureRecognizer:_panGestureRecognizer];
    }

    return self;
}

-(id<UIViewControllerAnimatedTransitioning>)animationControllerForPresentedController:(UIViewController *)presented presentingController:(UIViewController *)presenting sourceController:(UIViewController *)source{

    return _presentdAnimation ;
}

-(id<UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed{

    return _dismissedAnimation;
}

-(id<UIViewControllerInteractiveTransitioning>)interactionControllerForDismissal:(id<UIViewControllerAnimatedTransitioning>)animator{

    if (_dismissedAnimation.isInteraction) {

        return _interactiveTransitioning;
    }
    return nil;
}

-(void)handlePanGestureRecognizerMethod:(UIPanGestureRecognizer *)pan{

    CGPoint point = [pan translationInView:self.view];

    switch (pan.state) {

        case UIGestureRecognizerStateBegan:

            self.dismissedAnimation.isInteraction = true;

            [self.viewControllers.firstObject dismissViewControllerAnimated:true completion:nil];
            break;

        case UIGestureRecognizerStateChanged:

            [_interactiveTransitioning updateInteractiveTransition: (CGFloat)point.x/CGRectGetWidth(self.view.frame)];
            break;
        default:

            _dismissedAnimation.isInteraction = false;

            CGFloat locationX = ABS(point.x);
            CGFloat velocityX = [pan velocityInView:self.view].x;

            if (velocityX >= 500 || locationX >= CGRectGetWidth(self.view.frame)/2) {

                [_interactiveTransitioning finishInteractiveTransition];
            }else{

                [_interactiveTransitioning cancelInteractiveTransition];
            }
            break;
    }
}
````

效果如下：

![](/publicFiles/images/stock-photo/wkwebview-screen-pan-cancel.gif)

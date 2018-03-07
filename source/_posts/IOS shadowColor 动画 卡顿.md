---
categories: IOS
title: IOS shadowColor 动画 卡顿
tags:
  - Objective-C
  - ios
date: 2017-10-12 18:00:00
---

最近开发的时候遇见了一件怪事儿，做了一个 `UIViewControllerContextTransitioning`,在同事的手机上跳转会卡顿。在此之前写的跳转动画都没有卡顿的现象。
最终终于发现了问题的所在在于 shadowColor ，在跳转的时候我设置了一个阴影增加层级层次效果。
<!-- more -->

````objectivec
@implementation BaseViewControllerPresentdAnimation

-(NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext {

    return 0.5;
}

-(void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext{

    UIViewController *toViewController = [transitionContext viewControllerForKey:(UITransitionContextToViewControllerKey)];
    UIView *containerView = [transitionContext containerView];

    UIView *coverView = [UIView.alloc initWithFrame:containerView.bounds];
    coverView.backgroundColor = [UIColor.blackColor colorWithAlphaComponent:0];
    [containerView addSubview:coverView];

    toViewController.view.transform = CGAffineTransformTranslate(toViewController.view.transform, CGRectGetWidth(toViewController.view.frame), 0);

    [containerView addSubview:toViewController.view];

    [self makeShadowMethod:toViewController];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{

        toViewController.view.transform = CGAffineTransformIdentity;

        coverView.backgroundColor = [UIColor.blackColor colorWithAlphaComponent:0.3];

    } completion:^(BOOL finished) {

        [coverView removeFromSuperview];

        [transitionContext completeTransition:true];
    }];
}

-(void)makeShadowMethod:(UIViewController *)toViewController{


    toViewController.view.clipsToBounds = false;

    /// 需要添加这句话，可以使动画不再卡顿
    toViewController.view.layer.shadowPath = [UIBezierPath bezierPathWithRect:toViewController.view.bounds].CGPath;
    toViewController.view.layer.shadowRadius = 2;
    toViewController.view.layer.shadowColor = [UIColor.blackColor colorWithAlphaComponent:0.4].CGColor;
    toViewController.view.layer.shadowOffset = CGSizeMake(-3.0f,0);
    toViewController.view.layer.shadowOpacity = 0.4;
}

@end
````

知道这个解决方案是看到了 [Lu_Ca的博客](http://blog.csdn.net/Lu_Ca/article/details/47422913)

之后就很好奇为什么这个代码会有这么神奇的作用呢？ [SpeedBoy007的专栏](http://blog.csdn.net/meegomeego/article/details/22728465)

>  只要你提前告诉CoreAnimation你要渲染的View的形状Shape,就会减少离屏渲染计算
>````objectivec
>[myView.layer setShadowPath：[[UIBezierPath
>    bezierPathWithRect：myView.bounds] CGPath];
>````
>加上这行代码，就减少离屏渲染时间，大大提高了性能

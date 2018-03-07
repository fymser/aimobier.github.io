---
title: IOS Tips 小集合
tags:
  - 技巧
  - swift
  - ios
categories: IOS
date: 2015-08-10 20:53:35
---

![](/publicFiles/images/stock-photo/stock-photo-155024749.jpg "听说人在死前的一秒钟，他的一生会闪过眼前。")

IOS技巧，在工作学习中遇到的一些有点意思的小技巧，记录在在这里

<!--more-->

## 代码记录

###  获取状态栏

````swift
 ///获取状态栏
    private func JZStatusBar() -> UIView?{
        var object = UIApplication.sharedApplication(),statusBar:UIView?
        if object.respondsToSelector(NSSelectorFromString("statusBar")) {
            statusBar = object.valueForKey("statusBar") as? UIView
        }
        return statusBar
    }

````

### 动态显示视图

````swift
///按钮扩展类
@IBDesignable
class borderImageView:UIButton{
    /// 设置边框宽度
    @IBInspectable var borderWidth:CGFloat = 0 {
        didSet{
            self.layer.borderWidth = borderWidth
        }
    }
    /// 设置边框颜色
    @IBInspectable var borderColor:UIColor = UIColor.blackColor() {
        didSet{
            self.layer.borderColor = borderColor.CGColor
        }
    }
    /// 设置圆形弧度
    @IBInspectable var cornerRadius:CGFloat = 0{
        didSet{
            self.layer.cornerRadius = cornerRadius
        }
    }
}
````


### 检测键盘弹起隐藏

````swift
func resignNotification(){
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardShow:", name: UIKeyboardWillShowNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardHide:", name: UIKeyboardWillHideNotification, object: nil)
    }
    //通知中心通知键盘要出现了！  😳   全员戒备！
    func keyboardShow(note:NSNotification){
        if let info = note.userInfo {
            let  keyboardFrame:CGRect = (info[UIKeyboardFrameEndUserInfoKey] as! NSValue).CGRectValue()
            let deltay:CGFloat = keyboardFrame.size.height as CGFloat
            self.InputBackViewBottomSpaceConstraint.constant = deltay
            self.view.layoutIfNeeded()
        }
    }
    //通知中心通知键盘要消失了  😄  解散~  庆功宴~~
    func keyboardHide(note:NSNotification){
        self.InputBackViewBottomSpaceConstraint.constant = 0
        self.view.layoutIfNeeded()
    }
````


### 单例模式

````swift
    /// 获取单例模式下的UIStoryBoard对象
    class var shareWelComeStoryBoard:UIStoryboard!{
        get{
            struct backTaskLeton{
                static var predicate:dispatch_once_t = 0
                static var bgTask:UIStoryboard? = nil
            }
            dispatch_once(&backTaskLeton.predicate, { () -> Void in
                backTaskLeton.bgTask = UIStoryboard(name: "WelCome", bundle: NSBundle.mainBundle())
            })
            return backTaskLeton.bgTask
        }
    }
````

### 获取当前显示的UIViewController
````swift
extension UIViewController{
    class func getCurrentViewController() -> UIViewController?{
        if let rootViewController = UIApplication.sharedApplication().keyWindow?.rootViewController{
            var topViewController = rootViewController
            while let present = topViewController.presentedViewController{
                topViewController = present
            }
            return topViewController
        }
        return nil
    }
}
/// 调用方法如下
if let currentViewController = UIViewController.getCurrentViewController(){
//// 略
        }
````


### 判断是否在前台

````swift
        /// 处于前台
        if application.applicationState == UIApplicationState.Active{
            ///  处于后台
        }else if application.applicationState == UIApplicationState.Inactive{
        }
````

### 一下子dismiss 两个ViewController

````swift
self.presentingViewController!.presentingViewController?.dismissViewControllerAnimated(true, completion: { () -> Void in
                            })
````

## 第三方导入库

### 下拉刷新
[BreakOutToRefresh](https://github.com/dasdom/BreakOutToRefresh) 一个下拉刷新打砖块的swift库
[SDRefreshView](https://github.com/gsdios/SDRefreshView) 简单易用的上拉和下拉刷新
[ZLSwiftRefresh](https://github.com/MakeZL/ZLSwiftRefresh) - 下拉刷新/上拉加载更多，支持自定义动画，集成简单
[GearRefreshControl](https://github.com/andreamazz/GearRefreshControl) - 一个非常精细的下拉刷新 做的很细心
[refresher](https://github.com/jcavar/refresher) - 简洁清爽的下拉刷新
[PullToBounce](https://github.com/entotsu/PullToBounce) - 弹性动画 非常炫酷的下拉刷新
[RCTRefreshControl](https://github.com/Shuangzuan/RCTRefreshControl) qq的橡皮糖下拉刷新
[PullToRefresh](https://github.com/Yalantis/PullToRefresh) 刷新动画可定制的下拉数据请求更新组件
[MLSwiftBasic](https://github.com/MakeZL/MLSwiftBasic) 集合自定义导航栏、下拉刷新/上拉加载更多、视觉效果、好用分类等等一系列，却耦合性很低的Swift库!

### 图片选择、浏览 (这部分swift库真少呀 欢迎知道的补充)
[PhotoBrowser-swift](https://github.com/nsdictionary/PhotoBrowser) 图片浏览
[PhotoPicker](https://github.com/mengxiangyue/PhotoPicker) swift图片选择
[BSImagePicker](https://github.com/mikaoj/BSImagePicker) 这个图片选择 不错，oc和swift都有 真贴心呀
[KYElegantPhotoGallery](https://github.com/KittenYang/KYElegantPhotoGallery) - 一个优雅的图片浏览库(可惜OC写的呀。。。。)
[CocoaPicker](https://github.com/thebookofleaves/CocoaPicker) - 仿 QQ 图片选择器（非swift）。

### 网络部分
[Alamofire](https://github.com/Alamofire/Alamofire) 著名的 AFNetworking 络基础库 Swift 语言版
[AlamofireImage](https://github.com/Alamofire/AlamofireImage) 基于 Alamofire 的网络图片组件库
[Reachability.swift](https://github.com/ashleymills/Reachability.swift) Reachability Swift 版本
[Ji](https://github.com/honghaoz/Ji) Swift 版 HTML/XML 解析器
[CoreStore](https://github.com/JohnEstropia/CoreStore) 提供高可读性，一致性及安全性的 Core Data 管理类库
[SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON) GitHub 上最为开发者认可的 JSON 解析类

### 图片
[Kingfisher](https://github.com/onevcat/Kingfisher) onevcat 大神开发的处理网络图片及缓存的库
[ImageScout](https://github.com/kaishin/ImageScout) 最小网络代价获得图片大小及类型
[Nuke](https://github.com/kean/Nuke) 完整、强大、实用的图片管理类库
[HanekeSwift](https://github.com/Haneke/HanekeSwift) 轻量带缓存高性能图片加载组件
[UIImageColors](https://github.com/jathu/UIImageColors) 获取图片张的主色调和其相对应的对比色，背景色之类的框架，可以去看一下，感觉用到的地方还是会很多的

### 界面效果,动画等
[awesome-ios-animation](https://github.com/sxyx2008/awesome-ios-animation) 收集了iOS平台下比较主流炫酷的几款动画框架（这上面有很多，孙然不是全部用swift写的。但是还是可以鉴赏下）
[LiquidFloatingActionButton](https://github.com/yoavlt/LiquidFloatingActionButton) 可定制水滴型浮动动态按钮组件及演示
[PNChart-Swift](https://github.com/kevinzhow/PNChart-Swift) 带动画效果的图表控件库
[HamburgerButton - Menu/Close](https://github.com/robb/hamburger-button) 无论设计还是代码，都进行了精雕细琢
[HamburgerButton - Check](https://github.com/entotsu/TKAnimatedCheckButton) Hamburger 风格按钮动画图标（单选）组件
[entotsu/TKSubmitTransition](https://github.com/entotsu/TKSubmitTransition) 登录加载、返回按钮转场动画组件
[SweetAlert-iOS](https://github.com/codestergit/SweetAlert-iOS) 带动画效果弹窗封装类
[Dodo](https://github.com/exchangegroup/Dodo) 一款轻量地可定制信息栏小组件
[AnimatedTabBar](https://github.com/Ramotion/animated-tab-bar) 灵动的动画tabbar
[KYCircularProgress](https://github.com/kentya6/KYCircularProgress) 简单、实用路径可定进程条
[ParkedTextField](https://github.com/gmertk/ParkedTextField) 带固定文本的输入组件
[optonaut/ActiveLabel.swift](https://github.com/optonaut/ActiveLabel.swift) 扩展实现 UILabel 触控事件针对 “#, @, 链接” 响应
[GMStepper](https://github.com/gmertk/GMStepper) 带动画效果、支持手势滑动操作的步进标签
[KSTokenView](https://github.com/khawars/KSTokenView) 带搜索、快捷输入、分段显示关键词输入组件
[QRCodeReader](https://github.com/yannickl/QRCodeReader.swift) QR 二维码阅读组件及示例
[EasyTipView](https://github.com/teodorpatras/EasyTipView) 弹出提示框类及演示示例
[Popover](https://github.com/corin8823/Popover) 泡泡风格弹出视图封装类库
[TimingFunctionEditor](https://github.com/schwa/TimingFunctionEditor) - TimingFunctionEditor用swift编写， 贝塞尔曲线编辑器，编辑后可以预览或拷贝代码片段直接使用。P.S. 该项目采用更简单的依赖管理器[Carthage](https://github.com/Carthage/Carthage) ，而非常用的 CocoaPods。[Carthage介绍中文](http://www.cocoachina.com/ios/20141204/10528.html)。
[AAFaceDetection](https://github.com/aaronabentheuer/AAFaceDetection) - AAFaceDetection--swift，简单、实用的面部识别封装库。虽然该技术从 iOS 5 发展，不过真正有趣的应用还不多。。
[Concorde](https://github.com/contentful-labs/Concorde) - swift, Concorde, 一个可用于下载和解码渐进式 JPEG 的库, 可用来改善应用的用户体验。
[ZoomTransition](https://github.com/tristanhimmelman/ZoomTransition) - swift, 通过手势操控图片的放大、缩小、旋转等自由变化效果的组件及示例。
[AFImageHelper](https://github.com/melvitax/AFImageHelper) - swift,一套针对 UIImage 和 UIImageView 的实用扩展库，功能包含填色和渐变、裁剪、缩放以及具有缓存机制的在线图片获取
[PinterestSwift](PinterestSwift) - swift,Pinterest 风格图片缩放、切换示例。
[NVActivityIndicatorView](https://github.com/ninjaprox/NVActivityIndicatorView) 等待指示器 真心多。
[UIViewXXYBoom](https://github.com/xxycode/UIViewXXYBoom) 模拟MIUI卸载软甲的时候动画
[TisprCardStack](https://github.com/tispr/tispr-card-stack) 一款UICollection切换动画
[LTMorphingLabel](https://github.com/lexrus/LTMorphingLabel) 超级炫酷的Label切换文字的动画框架
[XLPagerTabStrip](https://github.com/xmartlabs/XLPagerTabStrip) 多页UIViewControll框架

### 约束Autolayout
[SnapKit](https://github.com/SnapKit/SnapKit) 我就用这一个

### 数据库方面
 [realm-cocoa](https://github.com/realm/realm-cocoa) 经测试，表示比苹果自带的CoreData 速度更加的快，文档详细。版本迁移方便。
 [CoreStore](https://github.com/JohnEstropia/CoreStore) 一款CoreData的第三方帮助库，使用CoreData更方面，包括版本迁移。

### 相机
[KYShutterButton](https://github.com/ykyouhei/KYShutterButton) 模拟系统相机按钮…………
[TOCropViewController](https://github.com/TimOliver/TOCropViewController) 模拟系统相册剪切图片时的界面
[MHVideoPhotoGallery](https://github.com/mariohahn/MHVideoPhotoGallery) 一款可以让你学习到很多知识的demo





### 其他方面
[ExSwift](https://github.com/pNre/ExSwift) 一款Extension集合的框架，省着造轮子了
[JSQMessagesViewController](https://github.com/jessesquires/JSQMessagesViewController) 聊天页面的搭建，不用愁了～ 但是需要自己去实现一些，例如播放视频之类的东西，它本身只实现了文字和图片
[STClock](https://github.com/zhenlintie/STClock) 完全模仿锤子时钟，可以当作一个学习的案例

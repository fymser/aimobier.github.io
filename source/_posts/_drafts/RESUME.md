2013年开始了工作，经历了一年多的创业时期，那个时候处于北京创业的井喷时期，那个时候，创业期间，五个人，在上地创业大厦小小的屋子里面工作，每天从双桥赶往上地，单程一个半小时，换3次线。7点出门，11点回家是常态，回到家就是睡觉，周末就是学习。我只想说，我是一个有毅力，不怕吃苦，爱学习的人。那个时候担任服务器开发，但是刚刚毕业的我技术实在是不咋地，框架是我们的兼职老大给我的，我最开始的主要工作就是熟悉框架，后面的主要工作就是按照这个框架，开发我的项目，我做的更多的是业务逻辑。

私拍服务器
软件描述:
私拍为一个用户没有真实身份的可以随便上传图片的平台
软件环境:Java Spring+Hibernate
开发描述:

打卡7
软件描述:
培养用户习惯，用户的日常打卡，可以上传图片。可以在论坛中与同样兴趣的人交流爱好，互相鼓励养成习惯。
软件环境: Swift2
类库管理工具: CocoaPods
主要框架:
  布局:SnapKit  StoryBoard
  数据持久化: CoreData QueryKit
  网络请求: Alamofire
  Pager: XLPagerTabStrip
开发描述:
主要是用 StoryBoard直接来布局，AutoLayout也多是直接拖拽式的
修改日历模块代码，当时日历模块有很多功能不支持，包括通过上下滑动进行 月 -> 周 动画切换效果
使用 XLPagerTabStrip 进行类似安卓滑动分页的功能
利用 UIDynamic 进行启动图的动画设计
使用 AssetsLibrary 进行相册选择照片的视图，利用 UIViewControllerContextTransitioning 进行模态弹出的视图切换效果
其他包涵，日历，论坛，用户分享，打点等功能点
软件连接：
https://itunes.apple.com/cn/app/da-ka7-gai-bian-zi-ji-cong/id1002321702?mt=8
软件服务器已经停止运行，软件已经不可用
项目地址: https://gitee.com/instan/desperately/

打卡相机
软件描述：
打卡7的衍生作品，在这里区别就是每次打卡必须上传照片。
软件环境: Swift2
类库管理工具: CocoaPods
主要框架:
  布局:SnapKit  StoryBoard
  网络请求: Alamofire
  自定义相机
开发描述:
  同样是使用 StoryBoard 来进行软件的开发，功能都很类似。
  只是由于需要按照日历来展示图片，导致以前的日历框架不可使用，所以利用NSCalendar和UICollection开发显示界面
  使用 AVFounction 进行自定义相机的开发，支持 白平衡，焦距等专业级调节
  其他包含很多动画 以及视图切换效果
软件链接: https://itunes.apple.com/cn/app/%E6%AF%8F%E6%97%A5%E7%9B%B8%E6%9C%BA-%E6%AF%8F%E5%A4%A9%E7%94%A8%E7%85%A7%E7%89%87%E8%AE%B0%E5%BD%95%E6%97%B6%E5%85%89%E6%94%B9%E5%8F%98-%E6%89%93%E5%8D%A17%E5%A7%90%E5%A6%B9%E7%AF%87/id1052053890?mt=8
软件服务器已经停止运行，软件已经不可用
软件源码 https://gitee.com/instan/Patience/


IOS Apple Store 刷榜
软件描述:
在转到新部门的时候，由于暂时没有信任，老板给予了一个刷榜的任务，大致的意思就是使用脚本让手机自动的下载软件。
软件环境:Lua/触手精灵
开发描述:
主要功能点为 自动更换账号，自动搜索软件，使用 ocr 来识别颜色和文字，寻找到软件，下载软件，卸载软件等.详细的代码可以查看软件链接。
软件连接:
https://gitee.com/instan/Brush-list/

B-Link
软件描述：
wifi 传递文件，利用局域网内在手机内创建服务器。电脑和手机可以互传文件以及文字
软件环境: Swift2
类库管理工具: CocoaPods
主要框架:
    pod 'FileKit'           ## 文件和路径管理工具
    pod 'AFDateHelper'      ## 时间格式化工具
    pod 'GCDWebServer'      ## 手机路由器转发功能
    pod 'MGSwipeTableCell'  ## UITableViewCell 左滑自定义
    pod 'ReachabilitySwift' ## 监测网络变化
    pod 'SnapKit'     ## Autolayout
    pod 'QBImagePickerController' ## 图片选择器
    pod 'Appirater'
开发描述:
  其实没有太大的技术点，主要是基于 GCDWebServer 进行文件的传输等操作
  不过倒是创建了基本上所有的语言支持(i18n)... 这个倒是花费了很多时间... 一顿翻译

由于开发者账号过期，链接都没有了...

奇点资讯
软件描述:
奇点资讯是一份深度新闻资讯报告，汇集精选内容资讯，关联事件，洞悉事实本质，让信息不再是孤岛，新闻不再是一言堂。
为了给读者呈现不同视角，让奇点成为你的资讯“二次”原爆点。奇点不断学习读者的使用习惯，深挖优质内容源，为你定制信息外脑，追踪新闻逻辑，对立多方观点，获得洞察和内在价值。
软件环境: Swift2/Swift3/Objective-c 各个语言都写了一遍
类库管理工具: CocoaPods
开发描述:
Swift3：https://github.com/AimobierCocoaPods/OddityUI/
Objective-c： https://github.com/aimobier/OddityUI
Swift2： https://github.com/AimobierCocoaPods/OddityNews/ (完成度低)

最开始开发的时候，Swift2版本，因为项目是在IOS8版本以上，所以最开始使用的新闻详情展示内容为WKWebView。
由于受以前开发服务器的时候，受到了jsp，ejs，jade等模版的影响，一开始就开始找模版，最终找到了MGTemplateEngine框架来实现这个效果，但是仓库不可以直接使用 Cocoapods 导入，所以 开发了一个 JMGTemplateEngine 地址:https://github.com/AimobierCocoaPods/MGTemplateEngine 可以使用Cocoapods导入 pod 'JMGTemplateEngine'

使用 Objective-c开发软件的时候。本来一开始的UITableViewCell的高度计算是使用的iOS 8中的Self Sizing Cells技术，但是后来由于SDK需要支持IOS7版本，所以后来使用了百度的开源项目 UITableView+FDTemplateLayoutCell，在最后的时期为了提高表格滑动流畅度，将含有大量Cell的TableView 都替换为 AsyncDisplayKit 进行升级。

由于后期SDK为OC版本，使用的XLPagerTabStrip框架OC版本过低，存在一些Bug，但是官方已经不在维护OC版本转为了Swift版本，所以开发了一个自己的OC版在项目中使用 https://github.com/AimobierCocoaPods/JXLPagerTabStrip 修改Bug的Commit地址：
https://github.com/AimobierCocoaPods/JXLPagerTabStrip/commit/d033aef840b1e8f833d8c0b1213f3d66afe8b2fa

全程使用Realm来进行项目的数据持久化，在开发的过程中发现了其中的二个Bug
第一个BUG为：RLMNotificationToken 监听的对象，当用户在异步提交了更新，第一个BUG为：RLMNotificationToken失败 提交的issues地址为 https://github.com/realm/realm-cocoa/issues/4893，Realm团队在很快的就发布了新的版本修复了该问题
第二个BUG为：在Realm的2.9版本的时候，出现了，崩溃的问题，是因为Realm支持的是IOS7版本，但是使用了IOS8中的一个API方法，导致软件会在IOS7设备中崩溃。地址为：https://github.com/realm/realm-cocoa/issues/5194
还有一个问题，在于当时用了 AsyncDisplayKit 之后，异步生成 CellNode 之后，在使用 RLMThreadSafeReference 对象时，会导致软件崩溃，最后查出问题就是由于消息通知会导致消息在异步线程更新 ASTableNode，所以需要将线程转移到主线程。

因为每次都需要打包成为.a 文件,并且修改 .podspec 版本,打Tag,提交到Github，并且还需要配置到 Cocoapods 中，步骤繁琐，并且容易出现错误。所以使用了 Trivis，后期就是 将软件提交到 master 分支之后，trivis会自动完成， .a 包的制作，自动提交到 Cocoapods Spec仓库。 配置文件在这里 https://github.com/aimobier/OddityUI/blob/master/.travis.yml

软件内需要播放视频，所以基于AVFoundation框架写了一个 https://github.com/aimobier/OddityUI/tree/develop/Classes/Utils/OddityCustomView/OddityPlayView 播放器。该播放器可以在任何界面出现，本来实现的和即刻是一样的。后来由于产品的修改，所以修改为只有在主界面的时候才会存在，并且开发了 新闻列表页以及新闻详情页视频点击切换的动画，支持左右屏幕上下滑动，调整声音和亮度，左右横滑调整播放进度

软件内新闻详情WebView以及原生代码交互，由于软件内使用了两个控件 UIWebView 以及 WKWebView 两个控件，所以需要单独进行开发。https://github.com/aimobier/OddityUI/blob/develop/Classes/Utils/OddityCustomView/OddityWebView.m 在这里将UI和WK WebView 结合在一起，共同制定公共方法。

软件详情图片下载进度条实现，将默认的img src 修改为 datasrc ，实现计算好图片应该展示的宽度和高度，增加用户体验感。之后监听 详情页面的滑动动作，获取图片的链接使用原生的下载器，下载图片，这个时候就可以将下载进度返回给img控件。在下载好图片之后，将图片转换为Base64的方式，传递给前端，但是问题也很明显，就是就是开了异步线程，仍然有很长的解析时间，暂时不清楚如何提升，想到的就是本地实现一个服务器，让网页请求本地服务器，暂时没有试验

软件内包含了状态的调整，包含 字体的 大小中微 4种字体的更新，以及包括 黑天白夜的阅读模式。软件内所有的视图切换动画都是手写，包括搜索。我很喜欢这种视图切换动画的开发，因为看起来很帅，所以很有成就感。

在后期，老板希望增加一个一键生成单独软件的功能，就比如想生成一个专门的体育频道，里面的ICON，主题色等很多配置方面都不一样，这些东西手写可以，但是需要维护太多的版本了，很容易出错，所以我使用了 fastlane 来完成这功能，并且使用Nodejs+express来完成服务器的配置。项目主页：https://github.com/aimobier/Package/ 在这里你可以上传一个ICON，支持自动创建 Itunes 中的 bundle id，并且支持上传预览图，以及Apple Store的证书等，一键生成 ipa 包，并完成上传。

其他更详细的信息都可以在 Commic 中看到，该项目这三个版本都为本人单独开发。

---
categories: IOS
title: IOS 逆向学习
tags:
  - 逆向
  - theos
  - ios
  - tweak
date: 2018-01-29 14:25:00
---

一年之前学习过一次，但是当初很快就被忙碌的工作占据，并且当时学习的晕晕乎乎的。现在我打算重新学习一下。别的就不开始多说了，开始搭建theos环境吧。

<!-- more -->

## 搭建Theos环境

写作时间 2018-1-29             
theos 版本 2.3          
macos 10.13.3           
xcode Version 9.2 (9C40b)         

### 配置环境变量

因为我们需要让系统明白 theos放在哪里了，需要设置以下环境变量。有以下几种方式来设置，你可以根据自己喜欢来设置自己想要的。

配置环境变量的语法为
````sh
export [变量名称]="$PATH:<PATH 1>:<PATH 2>:<PATH 3>:...:<PATH N>"
````

下面无论哪种方都可以使用以下方法来实验是否设置完成

````sh
echo [变量名称]
````

#### 只在当前终端生效的方式

这种方式只在终端中生效，当你关闭了，就需要重新配置了.emmmmm...这种方式，具体看你喜好了。

就是直接在命令行中调用配置环境变量方法就可以了。如：
````sh
export THEOS = /opt/theos
````

#### 文件中保存的环境变量

````sh
/etc/profile ## 全局（公有）配置，不管是哪个用户，登录时都会读取该文件。
/etc/paths  ##   全局变量
~/.bash_profile ### 用户
~/.bash_login ### 用户
~/.profile ### 用户
~/.bashrc ### 用户  我是在这里配置的
````

> /etc/profile:此文件为系统的每个用户设置环境信息,当用户第一次登录时,该文件被执行.并从/etc/profile.d目录的配置文件中搜集shell的设置.             
/etc/bashrc:为每一个运行bash shell的用户执行此文件.当bash shell被打开时,该文件被读取.             
~/.bash_profile:每个用户都可使用该文件输入专用于自己使用的shell信息,当用户登录时,该文件仅仅执行一次!默认情况下,他设置一些环境变量,执行用户的.bashrc文件.             
~/.bashrc:该文件包含专用于你的bash shell的bash信息,当登录时以及每次打开新的shell时,该该文件被读取.              
~/.bash_logout:当每次退出系统(退出bash shell)时,执行该文件.               
所以             
/home/oracle/.bash_profile  oracle用户的配置             
/etc/skel/.bash_profile 默认配置             
/root/.bash_profile root用户的配置             

如果没有文件可以直接生成
````sh
touch [文件名称]
````
之后写入命令。


### 下载theos

在安装之前需要安装
````sh
brew install ldid
````

安装，在咱们完成了 环境变量的配置之后。

````sh
$ git clone --recursive https://github.com/theos/theos.git $THEOS
````
记得使用 `--recursive` 命令，这个命令，会在clone的时候，clone这个仓库徐耀的子模块。如果你忘记了这一点的话，进入theos命令运行。`make update-theos`

其他常见的地方是`/opt/theos`和`/var/theos`。 如果要使用/ var，/ opt或其他类似的目录，请记住，除root用户之外，它们将不可写入。 您必须在上面的命令中使用sudo，然后将所有者更改为自己

````sh
$ sudo chown -R $(id -u):$(id -g) theos
````

尽管你可以直接食用 download zip ，下载theos，但是不推荐这么做，因为这样做不利于后的版本更新。

In order to use make troubleshoot, you need to install Ghostbin’s ghost.sh script.

为了使用`make troubleshoot`，你需要安装[Ghostbin的ghost.sh](https://ghostbin.com/ghost.sh)脚本。
````sh
$ curl https://ghostbin.com/ghost.sh -o $THEOS/bin/ghost
$ chmod +x $THEOS/bin/ghost
````

### 升级

Theos采用的是[滚动发布模式](https://en.wikipedia.org/wiki/Rolling_release)，这意味着最新的提交到Git仓库是可用的最新版本的Theos。 偶尔，你应该更新Theos。 这可以通过切换到包含Theos makefile的目录然后运行：
````sh
$ make update-theos
````

如果遇到问题，更新Theos是你应该做的第一件事。 如果你要求别人帮忙，这样可以更容易地找到问题。

如果在运行该命令时看到以下内容：

````sh
make: *** No rule to make target 'update-theos'.  Stop.
````
那么你现在不在Theos项目目录中，或者正在使用比此功能更早的Theos版本。

## 配置 IOS 设备 ssh 免密码登录

首先需要在本地创建 rsh 文件

````sh
ssh-keygen -t rsa -C "xxxxx@xxxxx.com"
# Generating public/private rsa key pair...
# 三次回车即可生成 ssh key

cd ~/.ssh ## 进入 ssh
ls ## 查看 有id_ras 和 id_ras.pub 文件

````

这样就说明创建完成了，将.pub文件拷贝至收集目录下的 `/var/root/.ssh` 名称为 `authorized_keys`.

````sh
scp ~/.ssh/id_rsa.pub root@172.16.41.66:/var/root/.ssh/authorized_keys
````

这个时候，就完成了，直接使用试试吧。
````sh
ssh root@DeviceIP
````

## 获取头文件

接下来我们将开始演示如何敲壳，之后获取应用的头文件，接下来我们以微信为例。        

这里所有的先决条件是这样子的
1. 你有一个 越狱的 手机 并且装了微信的手机
2. 装有 openshh 连接上 (OpenSSH的root密码默认为alpine)

连接上之后，我们需要找到我们的WeChat.app，首先保证你的微信处于运行状态，之后运行

````sh
ps -e
````
执行命令之后你会看到列出的所有进程，找到其中有WeChat结尾的，记录该地址。

之后，我们来进行敲壳获取 decrypted 文件。

### 敲壳  dumpdecrypted

[dumpdecrypted](https://github.com/stefanesser/dumpdecrypted) clone到本地，之后进入文件之后运行 `make` 命令，结束之后，会出现一个 `dumpdecrypted.dylib` 。

将这个文件传输到手机上，为了方便，我们吧文件放置在 微信的 Document。使用如下方法获取到该文件夹的位置。
````sh
Misterde-iPod:/System root# cycript -p WeChat
cy# NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true)[0];
@"/var/mobile/Containers/Data/Application/487D41FD-2118-4015-BE79-FF61A9029B1E/Documents"
cy#
````
接下来让我们把 `dumpdecrypted.dylib` 复制到Documents文件夹中。

````sh
scp ~/Desktop/dumpdecrypted/dumpdecrypted.dylib root@172.16.41.66:/var/mobile/Containers/Data/Application/487D41FD-2118-4015-BE79-FF61A9029B1E/Documents/
````

接下来我们就可以进行敲壳了，敲壳之前，我们要确定当前的目录，因为完成后的文件会被放置在当前的目录，推荐是Docustoms 文件夹。

````sh
# DYLD_INSERT_LIBRARIES = 咱们的dylib文件     目标文件也就是咱们的WeChat
DYLD_INSERT_LIBRARIES=/var/mobile/Containers/Data/Application/487D41FD-2118-4015-BE79-FF61A9029B1E/Documents/dumpdecrypted.dylib /var/mobile/Containers/Bundle/Application/BD2D25AB-8B36-4614-84BE-79806AB53FB8/WeChat.app/WeChat

mach-o decryption dumper

DISCLAIMER: This tool is only meant for security research purposes, not for application crackers.

[+] detected 32bit ARM binary in memory.
[+] offset to cryptid found: @0x75a4c(from 0x75000) = a4c
[+] Found encrypted data at address 00004000 of length 49430528 bytes - type 1.
[+] Opening /private/var/mobile/Containers/Bundle/Application/BD2D25AB-8B36-4614-84BE-79806AB53FB8/WeChat.app/WeChat for reading.
[+] Reading header
[+] Detecting header type
[+] Executable is a FAT image - searching for right architecture
[+] Correct arch is at offset 16384 in the file
[+] Opening WeChat.decrypted for writing.
[+] Copying the not encrypted start of the file
[+] Dumping the decrypted data into the file
[+] Copying the not encrypted remainder of the file
[+] Setting the LC_ENCRYPTION_INFO->cryptid to 0 at offset 4a4c
[+] Closing original file
[+] Closing dump file

````
这个时候，我们发现文件夹下已经有了一个`WeChat.decrypted`.我们使用 scp 命令把这个文件传输到我们的电脑。

````sh
scp root@172.16.41.66:/var/mobile/Containers/Data/Application/487D41FD-2118-4015-BE79-FF61A9029B1E/Documents/WeChat.decrypted ~/Desktop
````
### 获取 头文件

我们接下来使用 class-dump 来获取文件的头文件。下载到本地 (class-dump)[http://stevenygard.com/projects/class-dump/]

你可以任意选择类型，压缩包还是执行文件，里面都是有一个已经编译好的执行文件以及一个源代码文件夹。直接使用执行文件即可。

这里我们需要了解下 class-dump的用法
````sh
class-dump 3.5 (64 bit)
Usage: class-dump [options] <mach-o-file>

  where options are:
        -a             show instance variable offsets
        -A             show implementation addresses
        --arch <arch>  choose a specific architecture from a universal binary (ppc, ppc64, i386, x86_64, armv6, armv7, armv7s, arm64)
        -C <regex>     only display classes matching regular expression
        -f <str>       find string in method name
        -H             generate header files in current directory, or directory specified with -o
        -I             sort classes, categories, and protocols by inheritance (overrides -s)
        -o <dir>       output directory used for -H
        -r             recursively expand frameworks and fixed VM shared libraries
        -s             sort classes and categories by name
        -S             sort methods by name
        -t             suppress header in output, for testing
        --list-arches  list the arches in the file, then exit
        --sdk-ios      specify iOS SDK version (will look in /Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS<version>.sdk
        --sdk-mac      specify Mac OS X version (will look in /Developer/SDKs/MacOSX<version>.sdk
        --sdk-root     specify the full SDK root path (or use --sdk-ios/--sdk-mac for a shortcut)
````

关于平台以下
````sh
arm64：iPhone6s | iphone6s plus｜iPhone6｜ iPhone6 plus｜iPhone5S | iPad Air｜ iPad mini2(iPad mini with Retina Display)
armv7s：iPhone5｜iPhone5C｜iPad4(iPad with Retina Display)
armv7：iPhone4｜iPhone4S｜iPad｜iPad2｜iPad3(The New iPad)｜iPad mini｜iPod Touch 3G｜iPod Touch4

i386是针对intel通用微处理器32位处理器
x86_64是针对x86架构的64位处理器

模拟器32位处理器测试需要i386架构，
模拟器64位处理器测试需要x86_64架构，
真机32位处理器需要armv7,或者armv7s架构，
真机64位处理器需要arm64架构。
````

````sh
./class-dump-3.5/class-dump -s -S -H ./WeChat.decrypted -o ./header
````

这样我们在 header 就已经获得所有的头文件了，接下来就是慢慢的看.....


## MonkeyDev

> 原有iOSOpenDev的升级，非越狱插件开发集成神器！
* 可以使用Xcode开发CaptainHook Tweak、Logos Tweak 和 Command-line Tool，在越狱机器开发插件，这是原来iOSOpenDev功能的迁移和改进。
* 只需拖入一个砸壳应用，自动集成class-dump、restore-symbol、Reveal、Cycript和注入的动态库并重签名安装到非越狱机器。
* 支持调试自己编写的动态库和第三方App
* 支持通过CocoaPods第三方应用集成SDK以及非越狱插件，简单来说就是通过CocoaPods搭建了一个非越狱插件商店。

给跪……

安装移步[官方Wiki](https://github.com/AloneMonkey/MonkeyDev/wiki)

遇到的一个坑

因为安装的theos没有在 `/opt/theos` 目录，导致失败解决办法,建立一个软连接
```sh
  ln -s 你的目录 /opt/theos
```
或者你可以每次都设置项目的BuildString 中的 theos 位置

### 拥有taget-action的方法和类名

在这个时候你已经可以运行在设备上了，并且就像平时咱们调试应用一样了。这个时候咱们想找到比如微信的登陆按钮点击了之后触发了什么时间呢？这个很简单 使用我们Xcode自带的试图查看器，点击到按钮的时候就可以查看 target-action了就和咱们平时一样。

比如咱们获取到 点击方法为 `onFirstViewLogin` Target 为 `WCAccountLoginControlLogic`

则有以下代码

````oc
CHDeclareClass(WCAccountLoginControlLogic)

CHOptimizedMethod(0, self, void,WCAccountLoginControlLogic ,onFirstViewLogin){
    //get origin value
    CHSuper(0, WCAccountLoginControlLogic, onFirstViewLogin);

    NSLog(@"点击了 登陆按钮");
}

CHConstructor{
    CHLoadLateClass(WCAccountLoginControlLogic);
    CHClassHook(0, WCAccountLoginControlLogic, onFirstViewLogin);
}
````

运行之后，咱们点击登陆按钮之后就会打印

### 打印那些没有target-action的方法

当然这个时候，我们很兴奋，但是忽然沉寂了，如何获取更多的方法呢？应用不是蠢到每一个操作都需要这样触发的。那怎么办这个时候就需要一个可以实时打印方法的日志机制。好在这个还是不需要我们努力....真的成搬砖了，，，到头了 还是搬砖....难过

使用 [ANYMethodLog](https://github.com/qhd/ANYMethodLog.git) 具体移步前往查看详细。

````oc
__attribute__((constructor)) // 在main函数被调用之前调用
__attribute__((destructor)) // 在main函数被调用之后调
````

使用这两个方法可以完成咱们想要的监听操作

````oc
__attribute__((constructor)) void entry() {

    [ANYMethodLog logMethodWithClass:NSClassFromString(@"WCAccountLoginControlLogic") condition:^BOOL(SEL sel) {
        NSLog(@"method:%@", NSStringFromSelector(sel));
        return NO;
    } before:nil after:nil];
}
````

但是这里就有一个问题，，， WCAccountLoginControlLogic 哪里来的？我们监听哪个类的方法？  好吧接下来看下一张让我们找到我们想要看到的视图名称

### 使用 lldb来进行更多的操作

lldb是一个很好用的工具，这块是一个非常大的一块内容需要单独学习，当然其实掌握其中一点就已经受用了。

我使用的是非常简单的一块，首先了解 lldb ，之后在看下面

目前我知道的，有两种情况可以进入到 lldb，让咱们来进行一些操作。
1. 使用 Xcode 自带的视图层次查看器
2. 断点

使用Xcode 自带的层次查看器 就不多说了。我们来说说断点。

当然，我们都进入了 层次查看器了，其实也是可以看到的。。主要是还是为了方便吧。。。

我们创建一个 Sysmbolic BreakPoint ，创建的一个断点。方法设置为 viewDidLoad 这样在 任意的对象调用到了这个方法就会进入调试。

这个时候我们就可以操作了，但是在此之前！！！！！！我们需要安装一个辅助工具 [chisel](https://github.com/facebook/chisel).
具体移步

在此之后我们运行  `pvc`可以看到vc 结构。



````
<MMUINavigationController 0x185a9b30>, state: disappeared, view: <UILayoutContainerView 0x186d2390> not in the window
   | <WCAccountLoginFirstViewController 0x1728cc00>, state: disappeared, view: <UIView 0x185c7600> not in the window
   + <MMUINavigationController 0x185653b0>, state: appeared, view: <UILayoutContainerView 0x183f7290>, presented with: <_UIFullscreenPresentationController 0x186f8a80>
   |    | <WCAccountMainLoginViewController 0x17b1c800>, state: appeared, view: <UIView 0x18459cc0>
````


这个时候我们就可以使用我们刚才说到的监测方法调用的方法，来查看都有哪些方法被调用了。

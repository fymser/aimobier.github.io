---
categories: IOS
title: 制作一个自己的 Cydia 源
tags:
  - 越狱
  - cydia
  - 制作源
date: 2016-11-12 02:05:43
---

![](/publicFiles/images/stock-photo/stock-photo-155012621.jpg "夜里不睡的人，白天多多少少总有什么逃避掩饰的吧。白昼解不开的结黑夜慢慢耗")

大家肯定都知道 Cydia 吧，
> iPhone、iPod touch、iPad等设备上的一种破解软件，类似苹果在线软件商店iTunes Store 的软件平台的客户端，在越狱的过程中被装入到系统中的，其中多数为iPhone、iPod Touch、ipad的第三方软件和补丁，主要都是弥补系统不足用。是由Jay Freeman（Saurik）领导，Okori Group以及UCSB大学合作开发。

之前用了很多好用的源，但是很好奇的是，他们是怎么制作的呢？为什么越狱之后就可以这么厉害呢？       
那么怎么制作这么一个东西

<!-- more -->

## 制作自己的 Cydia源

Cydia 说白了启示就是一个云盘，你们需要的呢，只是需要几个文件，来告诉过来访问这个云盘的Cydia程序，我这个源叫啥？谁制作的这个源？这个源里都有什么软件？这些源的放置位置都是啥？
那么如何制作自己的云盘呢？ 几种办法
1. 第一种就是自己做一个服务器，本地跑起来。
2. github
3. 任何一个直接访问的文件存储地方 比如 七牛云。

Cydia 源的文件结构
````
+- /
   +- Release
   +- Packages
   +- CydiaIcon.png
   +- debs
      +- *.deb
````
### 文件讲解
`/` 服务器根目录
`/Release`  文件记录软件源本身的相关信息 ，例如作者 之类的
`/Packages` 记录具体软件包的存放位置和安装信息等数据
`/CydiaIcon.png ` ICON 显示的ICON图片
`/debs` 存放所有deb包的目录
`/debs/*.deb` deb包……

#### Release 文件讲解
必须
Origin: 软件源名称，可以使用中文（Cydia的软件源列表中显示的标题）
Label:  同上，也可以使用中文
Suite: 软件源的类型，比如正式源，测试源等，可以分别用stable, beta, unstable等来表示，一般填stable就可以了
Version: 版本号，这个其实不重要，随便填，一般都是写1.0
Codename: 代码代号，比如BigBoss的就写BigBoss，威锋的就写WeiPhone，也没什么限制，只能用英文
Architectures: 结构。iPhone平台统一写iphoneos-arm
Components: main
Description: 软件介绍，可以使用中文和html代码，具体能使用哪些代码在下面会介绍。

可选
Support: 支持，没什么作用，除非特别需要，否则可以不要这个。
MD5Sum: 不是必须的，但如果Packages文件位置不与Release文件在同一目录下，则必须有此项。另外，如果需要签名Release文件，也必须有这个。关于MD5Sum的格式，在下文也会介绍。

Description格式

* 显示在Cydia中每个软件页面最下方。
* 不能直接换行，如果要实现显示换行显示，可以使用<br>代码。
* 要加粗显示，可以使用<strong></strong>代码
* 可以使用html代码设置字体颜色。
* 不能使用超链接代码。

代码：
````
Description: WeiPhone-威锋网为您提供iPhone所需软件/补丁。<br>联系我们: <strong>weip.com@ gmail.com</strong>;
````

#### 生成Packages文件
1. 将 deb 文件放在一个文件夹下，比如说debs下
2. 命令行里进入到debs目录的上级目录
3. Packages存放于当前目录
4. 执行命令 `dpkg-scanpackages debs > Packages`
5. 执行命令 `bzip2 -zfk Packages` 生成 `Packages.bz2`
6. 执行命令 `gzip -fk Packages` 生成 `Packages.gz`

> ps 4.5.6 可以使用 `dpkg-scanpackages debs > Packages && bzip2 -zfk Packages && gzip -fk Packages`

这样会自动将debs文件夹下的所有 deb文件信息 打印至 Packages 文件里


## (旧) 制作 自己deb 文件

### 总结
1. 先把文件夹结构弄好
2. 在 `Applications` 文件夹下面放入自己的 .app 文件
3. 在 `DEBIAN` 文件夹下面放入 `control`描述文件，以及根据自己的需求放入脚本文件
4. 使用 `chmod -R 0755 Directory` 设置权限
5. 使用 `dpkg-deb -b Directory a.deb` 命令打包
6. 使用 `dpkg-name a.deb` 规范命名


#### 各个文件讲解
先生成如下的文件目录结构：

```
+- Directory
   +- Applications
   |   +- Example.app
   |   |    +- Info.plist
   |   |    +- Example
   |   |    +- icon.png
   +- DEBIAN
       +- control
       +- preinst/postinst/prerm/postrm/extrainst_
```

`/Directory` : 任意的一个文件夹放置主要的文件
`/Directory/Applications` : 放置`.app`文件夹
`/Directory/Applications/Example.app` : `.app`文件夹

`/DEBIAN` : 放置描述的文件
`/DEBIAN/control` : 记录了软件包标识，软件名，介绍，作者，冲突软件等信息，用来标识一个软件包

####  DEBIAN/control 文件描述

以下为必须项

Package : 软件包标识符，类似于***，一个软件包必须要有一个唯一的标识符。通常是用com.xxx.abc这样的形式来命名。
Architecture: 架构，用于标识运行的系统，iPhone上为iphoneos-arm
Version: 版本号，不能用下划线和逗号和空格。格式有（以逗号分隔） 1.0，1.0f，0-1，1:1.0，其中1:1.0这种格式比较特殊，在Cydia中，1:1.0仍然会显示为1.0，但版本号实际是高于1.0的。

以下为可选项
Name: 软件包在Cydia中的显示名称，中英文不限，也可以用空格，但不宜过长（长了显示不完全）。
Author: 软件作者。
Maintainer: 维护者，一般是软件源的拥有者。
Sponsor: 负责人，可以是个人也可以是网站。
> Author，Maintainer，Sponsor 的格式相同，均为 名称+空格+<邮件地址或网址>，经测试，如果名称为中文的话，即使写了邮件地址和网址，在Cydia中点击也不会跳转。 示例： WEIP.Tech <weip.com@gmail,com> 或 WeiPhone.com <http://www.weiphone.com> 如果没有邮件地址或网址，则不需要 <> 及<>中的内容。中文名或未提供邮件/网址，无 > 符号

Icon: 指定软件包的图标显示。当无Icon设定时，Cydia会显示该软件包所在的分类的图标。 格式：
* 在线地址，如 http://www.abc.com/abc.png
* 本地地址：file://+路径，如file:///Applications/Cydia.app/Sources/app.weiphone.com.png
_注：在软件页面（非列表页面），自定义的图标是不会显示的，显示的是分类图标。_

Section: 软件分类，中英文无限制，排列顺序是 英文->中文。
Installed-Size: 解包后的文件大小，可以有小数位，以kb为单位，不需要注明kb，这个不需要很精确，而且小数位在Cydia里显示不出来（不是四舍五入，全部舍了）。至于文件大小是否包含DEBIAN目录中的内容就随意了。
Priority: 优先级，可填 Required，Important，Standard，Optional，Extra，依次为 必须，重要，一般，可选，次要。虽然没有什么实际作用，但优先级为Required和Important的软件包在卸载时会有警告，这样可以避免删除一些系统必须的软件。但Required和Important不要滥用，一般用Standard，Optional或Extra即可。优先级在Cydia中是不会显示的
Essential: 是否必须软件包，可填 yes 和 no， 填yes则为必须软件包，卸载时Cydia会有警告。卸载Essential标记为yes的软件包可能会导致系统问题。当然此功能需慎用，不要因为不希望用户删除自己的软件而加入Essential: yes。如果没有Essential这项的话默认就是非必须的，相当于Essential: no。
Depends: Depends 字段应该包含您的软件包正常工作绝对必需的任何软件包的名称。
Pre-Depends: "Pre-Depends"是为特例而保留的。当某个软件包被作为"Pre-Depends"列出时，它强制系统在试图安装您的软件包之前完全安装所指定的软件包。
Conflicts: 冲突软件包。比如软件包A和B有冲突，不能同时安装。比如说A和B冲突，当系统已经安装了A的时候尝试安装B，则不能继续。
Provides: 提供的软件包，比如说软件包A包含B的全部功能，那么则是A provides B，因此可以在安装了A的前提下不安装B。但此功能在非Cydia的软件管理工具中可能会无法识别（实际是这些软件不合deb标准）
Replaces: 替换软件包，安装A会替换B。
>* 以上5项的格式相同，直接填软件包的Package标识即可，如果需要加入版本号，则为 软件表标识+空格+(判断符号 版本号).比如 Depends: apt-key, firmware (>=3.0)， 这表示依赖于apt-key，不限版本，firmware，且版本大于或等于3.0。
* 判断符号：远远低于（<<）、低于(<)、低于或等于（<=）、仅等于（=）、等于或高于（>=）、大于（>）以及远远高于（>>）。
* 表示多个软件包，以英文逗号分隔。
* 表示“或”关系，用 | 分隔。比如软件包C依赖于A或B，可写Depends: A | B。 但“或”关系要慎用。原因是，当不存在“或”关系的时候，假设B依赖于A，且系统并未安装A，那么在Cydia中安装B的时候会自动下载安装A。而假如说C依赖于A或B，且A与B都未安装，那么在安装C的时候就会失败，因为系统无法判断是应该下载A还是B。除非系统已经安装了A或B，否则C不能安装。
* 一个特殊的依赖：firmware。这个Package记录了固件版本，在对固件版本有要求的软件包上特别重要。
* 假设B依赖于A，那么在卸载A的时候也会一起卸载B

Description: 软件描述，不能在control里直接换行，如果需要实现换行显示，可以使用<br>代码。当指定了Depiction时，在软件查看页面不会显示Description。
Depiction: 功能类似于软件描述，链接到一个网页，以网页的内容代替软件描述。只在软件查看页面显示，在软件包列表页面不显示。 可以使用本地网页，格式同Icon。 注意：此功能可能会消耗大量网络流量。
Homepage: 链接到页面，Cydia中显示为More Information。 页面不会主动加载。
Tag: 可选项有 commercial, console, daemon, extension, library, uikit, x，对应图标文件在 /Applications/Cydia.app/Purposes 目录下。也可以自行添加 purpose 分类，并加入同名图标即可。 role:: 软件包使用者归类。developer开发者，hacker骇客，enduser普通用户，该标签用于Cydia中软件包显示过滤。 cydia::commercial Cydia Store软件。

例子如下:

````txt
Package: com.weiphone.source
Name: WeiPhone威锋中文源
Version: 1.0
Essential: no
Icon: file:///Applications/Cydia.app/Sources/app.weiphone.com.png
Installed-Size: 133.7
Replaces: con.weiphone.logo
Conflicts: con.weiphone.logo
Provides: con.weiphone.logo
Depends: cydia
Priority: Standard
Maintainer: WEIP.Tech <weip.com@gmail.com>
Author: WEIP.Tech <weip.com@gmail.com>
Section: Repositories
Architecture: iphoneos-arm
Description: WeiPhone Chinese Repository<br><br>威锋中文源
HomePage: http://www.weiphone.com/
Sponsor: WeiPhone.com <http://www.weiphone.com>
Tag: purpose::repository, role::enduser

````

####  DEBIAN/preinst/postinst/prerm/postrm/extrainst_  文件描述

很多时候deb安装并不是把文件复制到iPhone里就可以了，还需要执行一些命令，比如设置权限，备份文件，加载启动进程等等，那么这时候就需要一些脚本来实现这些操作。 标准的deb脚本有4个`preinst`,`postinst`,`prerm `和 `postrm`
pre是表示XX之前的前缀，post是表示XX之后的前缀，inst是install（安装）的缩写，rm是remove（移除）的缩写，所以这4个脚本的功能很明显：
* preinst: 在复制文件前执行的脚本
* postinst: 在复制文件之后执行的脚本
* prerm: 在卸载前执行的脚本
* postrm: 在卸载之后执行的脚本

在Cydia中还存在一个独立的脚本,`extrainst_`,从字面上来讲就是额外的安装脚本。
这个脚本是Cydia的作者Saurik为解决某些脚本只需要在安装时执行，在升级时不执行而专门引入的一个脚本，功能跟postinst差不多，和Installer时代的“ahhhh”比较相似。
关于extrainst_的详情可以看看这个：http://www.telesphoreo.org/piper ... ptember/000252.html 5个脚本的编写方法基本是一样的，但为了适应Cydia的安装，在某些情况下需要进行特定的配置。 查看某些deb可能会发现这样的语句：
````
if [[ $1 == install || $1 == upgrade ]]; then
````
这种语句是为了区别安装/升级/卸载而准备的脚本。$1是一个外部变量，将这个外部变量传入脚本来执行，而这个外部变量是由Cydia软件自身生成的。 简单来说，如果是安装，则是 $1 == install ；如果是升级，则是$1 == upgrade；如果是卸载则是 $1 == remove。 if 是个判断语句，当满足if后[ ]中的指定条件时，if中的内容就会执行。那么这里就可以通过设定install/upgrade/remove来控制在不同操作时执行的命令。 但要注意的是，这个功能只能在Cydia中使用，其它的apt软件管理工具，如Icy，Rock等，不能识别这个命令，因此无法执行if中的语句，所以在写脚本的时候到底需不需要用这种格式，就看自己的需要了。 总体来说，Unix的脚本（Shell Script）有其固定的格式。 文件顶头为
````
#!/bin/bash
````
表示调用bash这个shell 之后就是运行的命令了。 脚本中如果需要注释，可以使用 # 符号。 以 # 开头的行会被当作注释，里面的内容在执行过程中没有意义。 通配符： * 最常用的两个命令自然是设置属性/权限/用户/组 设置属性/

#### 会使用到的系统命令操作

##### 权限

````
chmod 【-R】 属性 文件名
````
由于deb的脚本执行都是在root用户下，因此不需要提升权限，即不需要使用sudo命令。 -R参数：表示递归，加上此参数会将指定的目录及其子目录的全部目录和文件的属性改变。 属性：有多种写法。具体可以看 http://baike.baidu.com/view/1229012.htm?fr=ala0_1 比较常用的几种属性：
* chmod +x XXXXX 为文件增加可执行权限
* chmod 0644 XXXXX 不可执行文件最常使用的权限
* chmod 0755 XXXXX 可执行文件最常使用的权限

实例：

````
chmod -R 0755 /Applications/Cydia.app
````

##### 设置用户/组
````
chown 【-R】 用户:组 文件名
````
同样不需要sudo来提示权限。-R也是表示递归。 比如要将文件A设为root用户，wheel组，可以使用命令
```
chown -R mobile:mobile /var/mobile/Documents
```

##### 复制文件/文件夹
````
cp 【参数】 原始文件 目的文件
````
参数列表：
* -l（小写字母L）：创建硬链接，相当于一个镜像，而不是实际创建两个文件<br>`cp -l abc def`
* -f：强行复制，如果目的文件已存在，覆盖之且不提示<br>`cp -f abc def`
* -p：保留文件的属性、用户、组、时间戳等信息 <br> `cp -p abc def`
* -r和-R：作用都是递归，将文件夹下的全部子文件和子文件夹一起复制 <br> `cp -r abc/ def/`
* -s：创建符号链接而不是创建双份文件 <br> `cp -s abc/ def/`
* -n：如果目的文件已存在，则不覆盖且不提示 <br>`cp -n abc def`
* -a：相当与-dR，保留文件自身的属性等数据，一并复制子文件/文件夹 <br> `cp -a abc/ def/`

##### 移动文件/文件夹 & 重命名
````
mv 【参数】 源文件 目的文件
````
 -f：强行移动，如果目的文件已存在，覆盖之且不提示

 > 其实 mv  命令就是复制之后再删除，但 mv 命令会自动保留文件的属性等数据，移动文件夹时会自动移动子文件/子文件夹，因此都不需要另外的参数。 <br>
 重命名是由mv命令来实现的，mv 就是将 源文件 移动到 目标文件的位置并以目标文件的文件名保存。

##### 显示语句

````
echo "Some Thing";
````
示例：显示语句 "测试echo命令"。
````
echo "测试echo命令";
````

##### 管理自启动服务
````
launchctl load或unload  -w plist文件路径
````
实例： 让wefit3自启动
````
launchctl load -w /System/Library/LaunchDaemons/com.weiphone.fitx.plist
````
禁用iPhone日志记录syslogd
````
launchctl unload -w /System/Library/LaunchDaemons/com.apple.syslogd.plist
````

>PS: 记录自启动进程的plist文件保存在以下两个目录： /System/Library/LaunchDaemons/ 和 /Library/LaunchDaemons/

##### 杀死进程
````
killall 进程名
````
示例：关闭Safari进程
````
killall safari
````
##### 判断

基本格式是
````
if [ 判断条件一 ]; then
    执行命令
else
   执行命令
fi
````
实例： 如果文件abc存在，则备份为abc.bak，否则将文件def重命名为abc
````
if [ -f abc]; then
    mv -f abc abc.bak
else
    mv def abc
fi
````
其中[ -f abc ]可以由[ -e abc]取代 如果目录abc不存在，则新建一个目录abc
````
if [ ! -e abc ]; then
    mkdir abc
fi
````

##### 获取固件系统版本号
````
sw_vers -productVersion
````

##### 获取设备型号
````
uname -i
uname -m
````
##### Cydia中安装完之后重新启动SpringBoard
````
declare -a cydia
cydia=($CYDIA)
if [[ ${CYDIA+@} ]]; then
    eval &quot;echo &#39;finish:reboot&#39; &gt;&amp;${cydia[0]}&quot;
fi
````

#####  几个比较有用的实例

* 备份 preinst（安装之前就要把原始文件备份，不能等到安装完已经覆盖以后才备份）<br>
````
if [ ! -f 原始文件备份 ]; then
    echo &quot;原始文件的备份已存在，跳过备份&quot;
else
    cp -p 原始文件 原始文件备份
    echo &quot;原始文件已备份&quot;
fi
````
postrm（还原备份）<br>
````
echo "还原备份";
mv -f 原始文件备份 原始文件
````
备份操作在制作补丁的时候，尤其是替换类型的补丁时特别有用

* 判别具体固件版本 在control里可以通过Depends来设置依赖的固件版本，但有时候需要在某个特定固件版本下进行操作 比如说一个软件，要求固件版本大于或等于3.0，但在固件版本为3.1的时候必须删除某一个文件才能运行，那么脚本可以这样写：
````
firmware=$(sw_vers -productVersion)
if  [[ $firmware == 3.1 ]]; then
    删除文件
fi
````
* 判别设备型号 当设备型号为iPod Touch时删除某个文件
````
platform=$(uname -i)
if [[ $platform == &quot;N45AP&quot; || $platform == &quot;N72AP&quot; || $platform == &quot;N18AP&quot; ]]; then
    删除文件
fi
````
或
````
platform=$(uname -m)
if [ $platform == iPod* ]; then
    删除文件
fi
````



> 更多关于Shell Script的信息请见 http://www.hack base.com/tech/2009-10-10/56808.html


#### 打包

如果在DEBIAN中有脚本存在，则需要将整个DEBIAN文件夹及子文件属性设为0755,如果没有脚本的话保留0644属性即可，0755属性也没问题。
````
chmod -R 0755 DEBIAN
````
 打包命令
 ````
 dpkg-deb -b PATH FILENAME
 ````
其中PATH是打包deb的工作目录，DEBIAN文件夹需位于PATH指定的目录下 FILENAME是deb的文件名，这个可以自己决定。

以上命令打包deb默认是采用gz格式压缩，压缩率有限，如果要获得更改的压缩率（更小的文件体积），可以使用bzip2和lzma格式。 压缩为bzip2格式
````
dpkg-deb -bZ bzip2 PATH FILENAME
````
压缩为bzip2格式
````
dpkg-deb -bZ lzma PATH FILENAME
````
默认的gz格式压缩率最低，bzip2格式居中，lzma格式压缩率最高。（当然也会有例外）

>PS:
* 压缩率越高，压缩时间越长，在iPhone上使用较高的压缩率有更大概率导致失去响应。
* iPhone OS 2.x无lzma组件，因此无法安装lzma压缩的deb。iPhone OS 3.x可以解压lzma压缩。
* 如果deb包含的文件文本量比较大，那么一般可以获得不错的压缩率。但如果是像铃声，jpg/png图片这样文件本身就是压缩格式的情况，继续压缩的可能性就不高了，这类情况很难获得比较好的压缩率

#### 【可选】deb文件规范命名
````
dpkg-name abc_1.0.deb
````
如果想指定文件名格式，可以使用
````
dpkg-name --help
````

> 图形界面的deb制作工具 Debian Package Maker 网址： http://code.google.com/p/debianpackagemaker/ 个人感觉不如直接在命令行里来的直观，有兴趣的朋友可以自己试试。  ［ 需要翻墙 ］

## (新) 制作自己的deb文件


### 安装theos

[安装方法](http://iphonedevwiki.net/index.php/Theos/Setup)

选择theos的安装目录，官方建议放在默认的 /opt/theos.然后执行
````
export THEOS=/opt/theos
````

为了验证设置成功没有
````
echo $THEOS
````
如果打印 `/opt/theos` 说明摄制完成

Using git:
````
git clone --recursive git://github.com/DHowett/theos.git /opt/theos
````
Alternatively, you can use svn, if you prefer:
````
svn co http://svn.howett.net/svn/theos/trunk $THEOS
````
> `git clone -b stableversion https://github.com/haorenqq/theos/ $THEOS`
不要执行上面的语句，用上面的方法替换  特别感谢网名为逍遥笛子 的热心朋友 提供的分支，由于原theos最新的版本不兼容iosopendev，所以用15年的老版本

以上操作，如果出现任何关于权限的错误。使用sudo就可以了。

### 安装idld

其实我不知道这个是干什么的？但是呢，说是签名的。。。但是我没用到过，但是还是记录一下毕竟有不少坑

按照官方的教程是如此的说的。

````
git clone git://git.saurik.com/ldid.git
cd ldid
git submodule update --init
./make.sh
cp -f ./ldid $THEOS/bin/ldid
````

但是通常发生错误，        
第一个错误就是 引入了 `#include <openssl/err.h>` ，默认是不存在 这个文件夹的额。
第二个错误就是 make.sh中的代码默认是只匹配Xcode5-1-1的名称，所以需要修改 make 文件。

下载 [文件](/publicFiles/iosOpenDev安装附件-新.zip) 修复

接下来使用命令。生成 ldid 文件`./make.sh` . 反正我是生成失败了

你可以直接下载别人已经编译完成的文件 [ldid文件](/publicFiles/ldid)

之后将文件拷贝到 `/opt/theos/bin` 下就可以了

### 安装iOSOpenDev

````shell
git clone https://github.com/AimobierExample/iOSOpenDevInstallFix
cd iOSOpenDevInstallFix
sh repair.sh
````

之后打开 `iOSOpenDev-1.6-2.pkg` 按照提示就可以安装完成了

打开xcode就可以看见越狱的项目了 选择 `Logos TWeak`

按照xm文件内的提示，libsubstrate.dylib添加到工程中(在安装好的/opt/iOSOpenDev/lib 目录下)，然后把xm中的内容清空。mm文件的内容会根据xm文件中的内容编译后自动生成。

````
%hook SpringBoard  
- (void)applicationDidFinishLaunching:(id)application{  
    %orig;    
    UIAlertView * alert = [[UIAlertView alloc]initWithTitle:@"Welcome" message:@"HelloWorld!" delegate:nil cancelButtonTitle:@"Thanks" otherButtonTitles:nil];  
    [alert show];  
}  
%end
````

点击菜单 `Product - Build For - Profiling` 这个时候通常会报错，因为真机调试会出现问题
````
Failed to create directory /var/root/iOSOpenDevPackages on device 你的iOS设备IP地址
````
但是此刻已经在项目根目录下出现了 变已完成的 deb文件了，你可以直接添加到咱们的源服务器中，按照之前的教程生成 packages 完成安装。

### 真机调试

现在调试越狱设备，在已经越狱的手机上打开Cydia，搜索下列插件
如果搜索不到，打开软件源-编辑 删除BigBos和ModMyi，再回到首页，点击更多软件源，重新添加这两个即可搜索到下列插件

````
Core Utilities
Core Utilities(/bin)
diskdev-cmds
file-cmds
system-cmds
Mobileterminal
openSSH
sshpass
toggle ssh
preferencdloader
substrate safe mode
syslogd to /var/log/syslog
````

再在Xcode中的Target的Build Settings中的Code Signing中，改为Don't Code Sign.       
最后打开Target-Build Settings 找到iOSOpenDevDevice选项，填入越狱手机的本地ip

之后打开终端创建key
````
iosod sshkey -h 192.168.23.71（换成你的iOS设备IP地址）
````

创建完成

点击菜单 `Product - Build For - Profiling`

就可以安装到设备，安装完成之后，设备回自己重启，之后就会弹出了一个alertView。

## Theos 创建 Cydia 应用

### 首先安装 Theos

[安装方法](http://iphonedevwiki.net/index.php/Theos/Setup)

选择theos的安装目录，官方建议放在默认的 /opt/theos.然后执行
````
export THEOS=/opt/theos
````

为了验证设置成功没有
````
echo $THEOS
````
如果打印 `/opt/theos` 说明摄制完成

Using git:
````
git clone --recursive git://github.com/DHowett/theos.git /opt/theos
````

### 使用Theos创建应用

安装完成之后 使用：

````
/opt/theos/bin/nic.pl
````

调用之后

````shell
msiter:~ jingwenzheng$ /opt/theos/bin/nic.pl
NIC 2.0 - New Instance Creator
------------------------------
  [1.] iphone/activator_event
  [2.] iphone/application_modern
  [3.] iphone/cydget
  [4.] iphone/flipswitch_switch
  [5.] iphone/framework
  [6.] iphone/ios7_notification_center_widget
  [7.] iphone/library
  [8.] iphone/notification_center_widget
  [9.] iphone/preference_bundle_modern
  [10.] iphone/tool
  [11.] iphone/tweak
  [12.] iphone/xpc_service
Choose a Template (required): 2
Project Name (required): Demo
Package Name [com.yourcompany.demo]: com.demo
Author/Maintainer Name [荆文征]: jwz
[iphone/application_modern] Class name prefix (two or more characters) [XX]: demo
Instantiating iphone/application_modern in demo/...
Done.
msiter:~ jingwenzheng$
````

这样就创建完成了

### 运行到真机

首先要确保震级上面安装 openssh

````
ssh root@ip地址
````
密码。默认为 alpine

这样连接上就说明安装完成，可以调用的到～

之后设置环境变量`THEOS_DEVICE_IP` 为 真机 IP。

之后 cd 目录。 使用命令安装到真机上
````
make package install
````
#### 第一个问题 ldid

你可以直接下载别人已经编译完成的文件 [ldid文件](/publicFiles/ldid)

之后将文件拷贝到 `/opt/theos/bin` 下就可以了

默认是没有权限的 所以可能需要 `sudo`. 复制完成之后赋予权限`sudo chmod 777 /opt/theos/bin/ldid`

#### 第二个问题 dpkg

没有安装文件工具

````
brew install dpkg
````

#### dpkg 1.18.14 版本问题

在 `1.18.14` 版本，dpkg `lzma` 不能使用了，必须使用 `xz`

#### 这个时候需要修改 `/opt/theos/makefiles/package/deb.mk` 文件

````Makefile
ifeq ($(_THEOS_PACKAGE_FORMAT_LOADED),)
_THEOS_PACKAGE_FORMAT_LOADED := 1

_THEOS_DEB_PACKAGE_CONTROL_PATH := $(or $(wildcard $(THEOS_PROJECT_DIR)/control),$(wildcard $(THEOS_PROJECT_DIR)/layout/DEBIAN/control))
_THEOS_DEB_CAN_PACKAGE := $(if $(_THEOS_DEB_PACKAGE_CONTROL_PATH),$(_THEOS_TRUE),$(_THEOS_FALSE))

_THEOS_DEB_HAS_DPKG_DEB := $(call __executable,dpkg-deb)
ifneq ($(_THEOS_DEB_HAS_DPKG_DEB),$(_THEOS_TRUE))
internal-package-check::
	@echo "$(MAKE) package requires dpkg-deb."; exit 1
endif

ifeq ($(_THEOS_DEB_CAN_PACKAGE),$(_THEOS_TRUE)) # Control file found (or layout/ found.)
THEOS_PACKAGE_NAME := $(shell grep -i "^Package:" "$(_THEOS_DEB_PACKAGE_CONTROL_PATH)" | cut -d' ' -f2-)
THEOS_PACKAGE_ARCH := $(shell grep -i "^Architecture:" "$(_THEOS_DEB_PACKAGE_CONTROL_PATH)" | cut -d' ' -f2-)
THEOS_PACKAGE_BASE_VERSION := $(shell grep -i "^Version:" "$(_THEOS_DEB_PACKAGE_CONTROL_PATH)" | cut -d' ' -f2-)

$(_THEOS_ESCAPED_STAGING_DIR)/DEBIAN:
	$(ECHO_NOTHING)mkdir -p "$(THEOS_STAGING_DIR)/DEBIAN"$(ECHO_END)
ifeq ($(_THEOS_HAS_STAGING_LAYOUT),1) # If we have a layout/ directory, copy layout/DEBIAN to the staging directory.
	$(ECHO_NOTHING)[ -d "$(THEOS_PROJECT_DIR)/layout/DEBIAN" ] && rsync -a "$(THEOS_PROJECT_DIR)/layout/DEBIAN/" "$(THEOS_STAGING_DIR)/DEBIAN" $(_THEOS_RSYNC_EXCLUDE_COMMANDLINE) || true$(ECHO_END)
endif # _THEOS_HAS_STAGING_LAYOUT

$(_THEOS_ESCAPED_STAGING_DIR)/DEBIAN/control: $(_THEOS_ESCAPED_STAGING_DIR)/DEBIAN
	$(ECHO_NOTHING)sed -e '/^[Vv]ersion:/d' "$(_THEOS_DEB_PACKAGE_CONTROL_PATH)" > "$@"$(ECHO_END)
	$(ECHO_NOTHING)echo "Version: $(_THEOS_INTERNAL_PACKAGE_VERSION)" >> "$@"$(ECHO_END)
	$(ECHO_NOTHING)echo "Installed-Size: $(shell du $(_THEOS_PLATFORM_DU_EXCLUDE) DEBIAN -ks "$(THEOS_STAGING_DIR)" | cut -f 1)" >> "$@"$(ECHO_END)

before-package:: $(_THEOS_ESCAPED_STAGING_DIR)/DEBIAN/control

_THEOS_DEB_PACKAGE_FILENAME = $(THEOS_PACKAGE_DIR)/$(THEOS_PACKAGE_NAME)_$(_THEOS_INTERNAL_PACKAGE_VERSION)_$(THEOS_PACKAGE_ARCH).deb
internal-package::
	$(ECHO_NOTHING)COPYFILE_DISABLE=1 $(FAKEROOT) -r dpkg-deb -Zgzip -b "$(THEOS_STAGING_DIR)" "$(_THEOS_DEB_PACKAGE_FILENAME)" $(STDERR_NULL_REDIRECT)$(ECHO_END)

# This variable is used in package.mk
after-package:: __THEOS_LAST_PACKAGE_FILENAME = $(_THEOS_DEB_PACKAGE_FILENAME)

else # _THEOS_DEB_CAN_PACKAGE == 0
internal-package::
	@echo "$(MAKE) package requires you to have a layout/ directory in the project root, containing the basic package structure, or a control file in the project root describing the package."; exit 1

endif # _THEOS_DEB_CAN_PACKAGE
endif # _THEOS_PACKAGE_FORMAT_LOADED

````

这样按理就可以运行了

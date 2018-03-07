---
categories: IOS
title: IOS 绘制 录音波形图
tags:
  - Waver
  - AVFoundation
  - IOS
date: 2017-12-22 05:38:00
---

最近工作不是非常的忙，前段时间在研究 Objective-c 的Runtime，Runloop，这些知识实在是太杂多，搞的很乱。
今天忽然想起来，以前想做波形图。那今天就来试试吧。

![](/publicFiles/images/stock-photo/stock-photo-239866397.jpg "楼下一个男人病的要死，隔壁的一家唱着留音机。<br/>对面是哄孩子，楼上有两个人狂笑，还有打牌声。<br/>河边的船上有女人哭着她死去的母亲。<br/> 人类的悲喜并不相通，我只觉得他们吵闹。——鲁迅《而已集》")

<!-- more -->

## 首先要先准备一个 录音器

收集声音的框架，我是用的是 `AVFoundation` 框架的 AVAudioRecorder       
首先导入 -> `#import <AVFoundation/AVFoundation.h>`.

### 设置info.plist 文件权限请求

在Info.plist 增加一个 节点
````plist
	<key>NSMicrophoneUsageDescription</key>
	<string>请求录音</string>
````

### 创建一个 声音收集器

创建一个  AVAudioRecorder 对象用于录音的动作

````objectivec
AVAudioSession *session = AVAudioSession.sharedInstance;
[session setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];

NSURL *url = [NSURL fileURLWithPathComponents:@[
                                                [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject],
                                                @"MyAudioMemo.m4a"]];

self.recorder = [[AVAudioRecorder alloc] initWithURL: url
                                            settings:@{
                                                       AVFormatIDKey: @(kAudioFormatMPEG4AAC),
                                                       AVSampleRateKey: @(44100.0f),
                                                       AVNumberOfChannelsKey: @(2),
                                                       } error:NULL];
self.recorder.delegate = self;
self.recorder.meteringEnabled = YES;
[self.recorder prepareToRecord];
````
### 按钮点击 开始录音 结束录音

用户点击按钮的时候 开始录音和结束录音的操作

````objectivec
- (IBAction)clickRecordButtonMethod:(id)sender {

    if (!self.recorder.recording) { /// 正在录音

        [AVAudioSession.sharedInstance setActive:true error:nil];
        [self.recorder record];

        [self.recorderButton setTitle:@"停止录音" forState:(UIControlStateNormal)];

    }else{ // 暂停 录音

        [self.recorder stop];
        [AVAudioSession.sharedInstance setActive:false error:nil];

        [self.recorderButton setTitle:@"开始录音" forState:(UIControlStateNormal)];
    }
}
````

这个时候我们已经可以录音了，并且实际上已经完成了录音了，但是我们看不到效果。接下来我们开始获取接下来的事情吧

## 监听声音的大小

在我们完成了录音的代码之后，接下来就需要我们绘制波形图了和监听声音的音量的大小了

监听的远离非常简单，就是我们使用 `NSTimer` 通过AVAudioRecorder `averagePowerForChannel` 获取音量值。

修改的代码如下

````objectivec
- (IBAction)clickRecordButtonMethod:(id)sender {

    if (!self.recorder.recording) { /// 正在录音

        [AVAudioSession.sharedInstance setActive:true error:nil];
        [self.recorder record];

        [self.recorderButton setTitle:@"停止录音" forState:(UIControlStateNormal)];

        self.timer = [NSTimer scheduledTimerWithTimeInterval:0.02 target:self selector:@selector(timeHandleMethod) userInfo:nil repeats:true];

    }else{ // 暂停 录音

        [self.recorder stop];
        [AVAudioSession.sharedInstance setActive:false error:nil];

        [self.recorderButton setTitle:@"开始录音" forState:(UIControlStateNormal)];

        [self.timer invalidate];
    }
}

-(void)timeHandleMethod{

    /// 监听数据
    ...more...
}

````

### 关于录音和Audio Session Categories
如果AVAudioRecorder的averagePowerForChannel和peakPowerForChannel方法总是返回-160的话，那么很有可能是当前的Audio Session Categories不允许进行音频输入（也就是麦克风输入）。如：AVAudioSessionCategorySoloAmbient/kAudioSessionCategory_SoloAmbientSound，AVAudioSessionCategoryPlayback/kAudioSessionCategory_MediaPlayback。

如果这样的话，我们需要把当前Audio Session Categories设置成 AVAudioSessionCategoryRecord/kAudioSessionCategory_RecordAudio，或者AVAudioSessionCategoryPlayAndRecord/kAudioSessionCategory_PlayAndRecord。

可以使用两套API 来修复这个问题

一种是AVFoundation Framework中的API。如下：
````objectivec
NSError *setCategoryError = nil;

BOOL success = [[AVAudioSession sharedInstance]

                setCategory: AVAudioSessionCategoryRecord

                //或者AVAudioSessionCategoryPlayAndRecord

                error: &setCategoryError];
````

另一种是使用AudioToolbox Framework，它是基于C的API.如下：
````objectivec
UInt32 sessionCategory = kAudioSessionCategory_RecordAudio;

OSStatus result = AudioSessionSetProperty(kAudioSessionProperty_AudioCategory, sizeof(sessionCategory), &sessionCategory);
````
### 分贝数据的处理
根据Apple文档，AVAudioRecorder的averagePowerForChannel和peakPowerForChannel方法返回的是分贝数据，数值在-160 - 0之间（可能会返回大于0的值如果超出了极限）。在实际测试中，比如我在办公室（不算吵也不算特别安静的环境下）我测试averagePowerForChannel的返回值平均在-35左右徘徊。

有很多方法可以把这个原始的分贝数据转化成更可读或者更可用的形式。如[Apple SpeakHere Sample](https://developer.apple.com/library/ios/samplecode/SpeakHere/Introduction/Intro.html)。
或者自己手动设置一个分贝的范围，然后根据比例输出自己需要的分贝范围：比如下段代码：

````objectivec
-(void)timeHandleMethod{

    [self.recorder updateMeters];

    float power = [self.recorder averagePowerForChannel:0];

    CGFloat progress=(1.0/160.0)*(power+160.0)-0.3;

    ...more...
}
````

还有另外一种 大神总结的计算方法

````objectivec
//用于监控AVAudioRecorder数据的Timer回调方法。

//注意设置AVAudioRecorder的meteringEnabled属性为YES。

//recorder变量是AVAudioRecorder对象。

//http://stackoverflow.com/questions/9247255/am-i-doing-the-right-thing-to-convert-decibel-from-120-0-to-0-120/16192481#16192481

- (void)levelTimerCallback:(NSTimer *)timer {

[recorder updateMeters];



    float   level;                // The linear 0.0 .. 1.0 value we need.

    float   minDecibels = -80.0f; // Or use -60dB, which I measured in a silent room.

    float   decibels = [recorder averagePowerForChannel:0];

    if (decibels < minDecibels)

    {

        level = 0.0f;

    }

    else if (decibels >= 0.0f)

    {

        level = 1.0f;

    }

    else

    {

        float   root            = 2.0f;

        float   minAmp          = powf(10.0f, 0.05f * minDecibels);

        float   inverseAmpRange = 1.0f / (1.0f - minAmp);

        float   amp             = powf(10.0f, 0.05f * decibels);

        float   adjAmp          = (amp - minAmp) * inverseAmpRange;



        level = powf(adjAmp, 1.0f / root);

    }   

    NSLog(@"平均值 %f", level * 120);

}
````

这个时候我们已经可以获取到 声音的大小了

## 绘制波形图

我们主要使用一个 栈 来保存声音的大小数据。先进后出

大概的代码如下

````objectivec
[self.heightArray removeObjectAtIndex:0]; // 移除第一个
[self.heightArray addObject:@(height)]; //  增加一个
````

绘制就是用 Graphics Context是图形上下文 来绘制图形

````objectivec
-(void)drawRect:(CGRect)rect{

    /// 获取当前的高度
    float rectHeight = CGRectGetHeight(rect);

    // 获取初始化 左方的位置 保证 波形图 水平垂直
    float initX = (CGRectGetWidth(rect)-(self.heightArray.count*LineWidth+(self.heightArray.count-1)*SpaceWidth))/2;

    // 配置上下文
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetStrokeColorWithColor(context, UIColor.redColor.CGColor);
    CGContextSetLineWidth(context, LineWidth);

    /// 增加线条
    for (int i=0; i<self.heightArray.count; i++) {

        float height = [self.heightArray[i] floatValue];
        float x = initX + i*LineWidth + (i+1)*SpaceWidth;
        CGContextMoveToPoint(context, x, (rectHeight-height)/2);
        CGContextAddLineToPoint(context, x, (rectHeight-height)/2+height);
    }

    CGContextStrokePath(context);
}
````

## 岩石项目

[完整项目](/publicFiles/rTExample.zip)

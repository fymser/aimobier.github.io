---
layout: async
categories: nodejs
title: Nodejs Async 学习
date: 2015-07-6 18:41:43
tags: [nodejs,async]
---
{% fi https://drscdn.500px.org/photo/155012621/q%3D80_m%3D2000/86e40503418ad965aaeacdf3bae5dd5f, mongodb, 让你难过的事情，有一天，你一定会笑着说出来。 %}

> 本文整理于[`bsspirit`](https://github.com/bsspirit)的[博文](http://blog.fens.me/nodejs-async/)和[代码示例](https://github.com/bsspirit/async_demo)

`Async`是一个流程控制工具包，提供了直接而强大的异步功能。基于`Javascript`为`Node.js`设计，同时也可以直接在浏览器中使用。
`Async`提供了大约20个函数，包括常用的`map`,`reduce`, `filter`, `forEach` 等，异步流程控制模式包括，串行(`series`)，并行(`parallel`)，瀑布(`waterfall`)等。

<!-- more -->


## 项目简介
[Async](https://github.com/caolan/async)  

*For Async v1.5.x documentation, go [HERE](https://github.com/caolan/async/blob/v1.5.2/README.md)*

Async is a utility module which provides straight-forward, powerful functions
for working with asynchronous JavaScript. Although originally designed for
use with [Node.js](https://nodejs.org/) and installable via `npm install --save async`,
it can also be used directly in the browser.

Async is also installable via:

- [bower](http://bower.io/): `bower install async`
- [component](https://github.com/componentjs/component): `component install caolan/async`
- [jam](http://jamjs.org/): `jam install async`

Async provides around 70 functions that include the usual 'functional'
suspects (`map`, `reduce`, `filter`, `each`…) as well as some common patterns
for asynchronous control flow (`parallel`, `series`, `waterfall`…). All these
functions assume you follow the Node.js convention of providing a single
callback as the last argument of your asynchronous function -- a callback which expects an Error as its first argument -- and calling the callback once.

## 功能简介
<br/>
### 集合:`Collections`
* [`each`](#each): 如果想对同一个集合中的所有元素都执行同一个异步操作。
* [`map`](#map): 对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到最终的callback里。与each的区别是，each只关心操作不管最后的值，而map关心的最后产生的值。
* [`filter`](#filter): 使用异步操作对集合中的元素进行筛选, 需要注意的是，iterator的callback只有一个参数，只能接收true或false。
* [`reject`](#filter): reject跟filter正好相反，当测试为true时则抛弃
* [`reduce`](#reduce): 可以让我们给定一个初始值，用它与集合中的每一个元素做运算，最后得到一个值。reduce从左向右来遍历元素，如果想从右向左，可使用reduceRight。
* [`detect`](#detect): 用于取得集合中满足条件的第一个元素。
* [`sortBy`](#sortBy): 对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。
* [`some`](#some): 当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false.
* [`every`](#every): 如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false
* [`concat`](#concat): 将多个异步操作的结果合并为一个数组。

### 流程控制: `Control Flow`
* [`concat`](#concat): 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
* [`parallel`](#parallel): 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
* [`whilst`](#whilst): 相当于while，但其中的异步调用将在完成后才会进行下一次循环。
* [`doWhilst`](#whilst): 相当于do…while, doWhilst交换了fn,test的参数位置，先执行一次循环，再做test判断。
* [`until`](#whilst): until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
* [`doUntil`](#whilst): doUntil与doWhilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
* [`forever`](#whilst): 无论条件循环执行，如果不出错，callback永远不被执行。
* [`waterfall`](#waterfall): 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。
* [`compose`](#compose): 创建一个包括一组异步函数的函数集合，每个函数会消费上一次函数的返回值。把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值。
* [`applyEach`](#applyEach): 实现给一数组中每个函数传相同参数，通过callback返回。如果只传第一个参数，将返回一个函数对象，我可以传参调用。
* [`queue`](#queue): 是一个串行的消息队列，通过限制了worker数量，不再一次性全部执行。当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
* [`cargo`](#cargo): 一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。
* [`auto`](#auto): 用来处理有依赖关系的多个任务的执行。
* [`iterator`](#iterator): 将一组函数包装成为一个iterator，初次调用此iterator时，会执行定义中的第一个函数并返回第二个函数以供调用。
* [`apply`](#apply): 可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。
* [`nextTick`](#nextTick): 与nodejs的nextTick一样，再最后调用函数。
* [`times`](#times): 异步运行,times可以指定调用几次，并把结果合并到数组中返回
* [`timesSeries`](#times): 与time类似，唯一不同的是同步执行


### 工具类: `Utils`
* [`memoize`](#util.js): 让某一个函数在内存中缓存它的计算结果。对于相同的参数，只计算一次，下次就直接拿到之前算好的结果。
* [`unmemoize`](#util.js): 让已经被缓存的函数，返回不缓存的函数引用。
* [`log`](#util.js): 执行某异步函数，并记录它的返回值，日志输出。
* [`dir`](#util.js): 与log类似，不同之处在于，会调用浏览器的console.dir()函数，显示为DOM视图。
* [`noConflict`](#util.js): 如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。仅仅用于浏览器端，在nodejs中没用，这里无法演示。


## 代码演示

<a name='apply'></a><br/><br/>
### `apply`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * apply是一个非常好用的函数，可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。
 *
 * function(callback) { t.inc(3, callback); }
 * 等价于：
 * async.apply(t.inc, 3);
 */
// apply(function, arguments..)

/**
 * 通过名字绑定函数t.inc, t.fire，作为新函数给parallel调用
 */
//1.1
async.parallel([
    async.apply(t.inc, 3),
    async.apply(t.fire, 100)
], function (err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
//58.605> 1.1 err: null
//58.613> 1.1 results: [ 4, 100 ]

/**
 * 构造一个加法函数，通过apply简化代码
 */
//1.2
function inc(a,b,callback,timeout){
    var timeout = timeout || 200;
    t.wait(200);
    setTimeout(function() {
        callback(null, a+b);
    }, timeout);
}
var fn = async.apply(inc, 1, 2);
fn(function(err, n){
    log('1.2 inc: ' + n);
});
//58.616> 1.2 inc: 3
````

<a name='applyEach'></a><br/><br/>
### `applyEach`代码演示

````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
* applyEach，可以实现给一数组中每个函数传相同参数，通过callback返回。
* 如果只传第一个参数，将返回一个函数对象，我可以传参调用。
*/
// applyEach(fns, args..., callback)

/**
 * 异步执行，给数组中的函数，他们有相同的参数。
 */
//1.1
async.applyEach([
    function (name,cb) {
        setTimeout(function () {
            log("1.1 handler: " + name + " A");
            cb(null, name);
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.1 handler: " + name + " B");
            cb(null, name);
        }, 150);
    }
], 'Hello', function (err) {
    log('1.1 err: ', err);
});
//06.739> 1.1 handler: Hello B
//07.079> 1.1 handler: Hello A
//07.080> 1.1 err: null

/**
 *  异步执行，当只设置第一参数后，得到函数对象，再传参调用这个函数。
 */
//1.2
var fn = async.applyEach([
    function (name,cb) {
        setTimeout(function () {
            log("1.2 handler: " + name + " A");
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.2 handler: " + name + " B");
        }, 150);
    }
]);
fn("simgle",function(err){
    log('err: ',err);
});
//29.351> 1.2 handler: simgle B
//29.688> 1.2 handler: simgle A

/**
 *   applyEachSeries与applyEach唯一不同的是，数组的函数同步执行。
 */
//applyEachSeries(arr, args..., callback)
//1.3
async.applyEachSeries([
    function (name,cb) {
        setTimeout(function () {
            log("1.3 handler: " + name + " A");
            cb(null, name);
        }, 500);
    }, function (name,cb) {
        setTimeout(function () {
            log("1.3 handler: " + name + " B");
            cb(null, name);
        }, 150);
    }
], "aaa", function (err) {
    log('1.3 err: ', err);
});
//10.669> 1.3 handler: aaa A
//10.831> 1.3 handler: aaa B
//10.834> 1.3 err: null
````
<a name='auto'></a><br/><br/>
### `auto`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * auto用来处理有依赖关系的多个任务的执行。
 *
 * 比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。
 * 虽然我们可以使用parallel和series结合起来实现该功能，但如果任务之间关系复杂，则代码会相当复杂，以后如果想添加一个新任务，也会很麻烦。
 * 这时使用auto，则会事半功倍。
 *
 * 如果有任务中途出错，则会把该错误传给最终callback，所有任务（包括已经执行完的）产生的数据将被忽略。
 * 如果不关心错误和最终数据，可以不用写最后那个callback。
 */
// async.auto(tasks, [callback])

/**
 * 我要写一个程序，它要完成以下几件事：
 * 1. 从某处取得数据
 * 2. 在硬盘上建立一个新的目录
 * 3. 将数据写入到目录下某文件
 * 4. 发送邮件，将文件以附件形式发送给其它人。
 *
 * 分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。
 * 可以按以下方式来使用auto函数。
 */
// 1.1
async.auto({
    getData: function (callback) {
        setTimeout(function(){
            console.log('1.1: got data');
             callback(null, 'mydata');
        }, 300);
    },
    makeFolder: function (callback) {
        setTimeout(function(){
            console.log('1.1: made folder');
            callback(null, 'myfolder');
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(callback) {
        setTimeout(function(){
            console.log('1.1: wrote file');
            callback(null, 'myfile');
        }, 300);
    }],
    emailFiles: ['writeFile', function(callback, results) {
        log('1.1: emailed file: ', results.writeFile);
        callback(null, results.writeFile);
    }]
}, function(err, results) {
    log('1.1: err: ', err);
    log('1.1: results: ', results);
});
//1.1: made folder
//1.1: got data
//1.1: wrote file
//20.120> 1.1: emailed file: myfile
//20.125> 1.1: err: null
//20.127> 1.1: results: { makeFolder: 'myfolder',
//    getData: 'mydata',
//    writeFile: 'myfile',
//    emailFiles: 'myfile' }



/**
* 如果中途出错，则会把错误交给最终callback，执行完任务的传给最终callback。未执行完成的函数值被忽略
*/
// 1.2
async.auto({
    getData: function (callback) {
        setTimeout(function(){
            console.log('1.2: got data');
            callback(null, 'mydata');
        }, 300);
    },
    makeFolder: function (callback) {
        setTimeout(function(){
            console.log('1.2: made folder');
            callback(null, 'myfolder');
        }, 200);
    },
    writeFile: ['getData', 'makeFolder', function(callback, results) {
        setTimeout(function(){
            console.log('1.2: wrote file');
            callback('myerr');
        }, 300);
    }],
    emailFiles: ['writeFile', function(callback, results) {
        console.log('1.2: emailed file: ' + results.writeFile);
        callback('err sending email', results.writeFile);
    }]
}, function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
//1.2: made folder
//1.2: got data
//1.2: wrote file
//51.399> 1.2 err: myerr
//51.401> 1.2 results: { makeFolder: 'myfolder',
//    getData: 'mydata',
//    writeFile: undefined }

````
<a name='cargo'></a><br/><br/>
### `cargo`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * cargo也是一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。
 * 当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
 *
 * cargo的不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。
 */
// cargo(worker, [payload])

/**
 * 创建cargo实例
 */
var cargo = async.cargo(function (tasks, callback) {
    for(var i=0; i<tasks.length; i++){
        log('start ' + tasks[i].name);
    }
    callback();
}, 2);


/**
 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
 */
cargo.saturated = function() {
    log('all workers to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
cargo.empty = function() {
    log('no more tasks wating');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
cargo.drain = function() {
    log('all tasks have been processed');
}

/**
 * 增加新任务
 */
cargo.push({name: 'A'}, function (err) {
    t.wait(300);
    log('finished processing A');
});
cargo.push({name: 'B'}, function (err) {
    t.wait(600);
    log('finished processing B');
});
cargo.push({name: 'C'}, function (err) {
    t.wait(500);
    log('finished processing C');
});
cargo.push({name: 'D'}, function (err) {
    t.wait(100);
    log('finished processing D');
});
cargo.push({name: 'E'}, function (err) {
    t.wait(200);
    log('finished processing E');
});
//40.016> all workers to be used
//40.020> no more tasks wating
//40.020> start A
//40.020> start B
//40.322> finished processing A
//40.923> finished processing B
//40.923> no more tasks wating
//40.924> start C
//40.924> start D
//41.425> finished processing C
//41.526> finished processing D
//41.526> no more tasks wating
//41.527> start E
//41.728> finished processing E
//41.728> all tasks have been processed
//41.729> all tasks have been processed
//41.729> all tasks have been processed
//41.729> all tasks have been processed
//41.730> all tasks have been processed
````
<a name='compose'></a><br/><br/>
### `compose`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 创建一个包括一组异步函数的函数集合，每个函数会消费上一次函数的返回值。
 * 把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值。
 */
// compose(fn1, fn2...)

/**
 * 通过compose组合，f(g(h()))的形式，从内层到外层的执行的顺序。
 */
//1.1
function f(n,callback){
    log('1.1.f enter: ',n);
    setTimeout(function () {
        callback(null, n + 1);
    }, 10);
}
function g(n, callback) {
    log('1.1.g enter: ',n);
    setTimeout(function () {
        callback(null, n * 2);
    }, 10);
}
function h(n, callback) {
    log('1.1.h enter: ',n);
    setTimeout(function () {
        callback(null, n - 10);
    }, 10);
}
var fgh = async.compose(f,g,h);
fgh(4,function(err,result){
    log('1.1 err: ', err);
    log('1.1 result: ', result);
});
//05.307> 1.1.h enter: 4
//05.329> 1.1.g enter: -6
//05.341> 1.1.f enter: -12
//05.361> 1.1 err: null
//05.362> 1.1 result: -11
````
<a name='concat'></a><br/><br/>
### `concat`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 将多个异步操作的结果合并为一个数组。
 */
// concat(arr, iterator(item,callback(err,result)), callback(err,result))

var data = {
    aaa: [11,22,33],
    bbb: [44,55],
    ccc: 66
};

var keys = [
    {name: 'aaa', delay: 300},
    {name: 'bbb', delay: 100},
    {name: 'ccc', delay: 200}
];

/**
 * 以并行方式对集合中各元素进行异步操作，然后把得到的结果合并为一个数组，传给最后的callback。
 */
// 1.1
async.concat(keys, function(key,callback) {
    setTimeout(function() {
        callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.1 err: ', err);
    log('1.1 values: ', values);    
});
// 13.539> 1.1 err:
// 13.539> 1.1 values: [ 44, 55, 66, 11, 22, 33 ]

/**
 * 如果中途出错，则把错误以及已经完成的操作的结果交给最后callback。未执行完的则忽略。
 */
// 1.2
async.concat(keys, function(key,callback) {
    setTimeout(function() {
        if(key.name==='ccc') callback('myerr');
        else callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.2 err: ', err);
    log('1.2 values: ', values);    
});
// 13.439> 1.2 err: myerr
// 13.439> 1.2 values: [ 44, 55 ]

/**
 * 按数组中的元素顺序来执行异步操作，一个完成后才对下一个进行操作。所有结果会汇集成一个数组交给最后的callback。
 */
// concatSeries(arr, iterator, callback)

// 1.3
async.concatSeries(keys, function(key,callback) {
    setTimeout(function() {
        callback(null, data[key.name]);
    }, key.delay);
}, function(err, values) {
    log('1.3 err: ', err);
    log('1.3 values: ', values);    
});
// 13.859> 1.3 err:
// 13.859> 1.3 values: [ 11, 22, 33, 44, 55, 66 ]
````
<a name='detect'></a><br/><br/>
### `detect`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 用于取得集合中满足条件的第一个元素。
 * 它分为并行与顺序执行两种方式，分别对应函数detect和detectSeries。
 */
// detect(array, iterator(item,callback(test)), callback(result)

var arr = [
    {value:1,delay:500},
    {value:2,delay:200},
    {value:3,delay:300}
];

/**
 *  并行执行，通过t.inc做一个累加器，得到第一个满足条件的结果对象
 */
async.detect(arr, function(item,callback){
    log('1.1 enter: ', item.value);
    t.inc(item.value, function(err,n) {
        log('1.1 handle: ', item.value);
        callback(n%2===0);
    }, item.delay);
}, function(result) {
    log('1.1 result: ', result);
});
// 09.928> 1.1 enter: 1
// 09.928> 1.1 enter: 2
// 09.928> 1.1 enter: 3
// 10.138> 1.1 handle: 2
// 10.228> 1.1 handle: 3
// 10.228> 1.1 result: { value: 3, delay: 300 }
// 10.438> 1.1 handle: 1
// 10.438> 1.1 handle: 1

/**
 *  串行执行，通过t.inc做一个累加器，得到第一个满足条件的结果对象
 */
async.detectSeries(arr, function(item,callback) {
    log('1.2 enter: ', item.value);
    t.inc(item.value, function(err,n) {
        log('1.1 handle: ', item.value);
        callback(n%2===0);
    }, item.delay);
}, function(result) {
    log('1.2 result: ', result);
});
// 09.928> 1.2 enter: 1
// 10.438> 1.2 result: { value: 1, delay: 500 }

````
<a name='each'></a><br/><br/>
### `each`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 如果想对同一个集合中的所有元素都执行同一个异步操作，可以利用each函数。
 *
 * async提供了三种方式：
 * 1. 集合中所有元素并行执行
 * 2. 一个一个顺序执行
 * 3. 分批执行，同一批内并行，批与批之间按顺序
 *
 * 如果中途出错，则错误将上传给最终的callback处理。其它已经启动的任务继续执行，未启动的忽略。
 */
// each(arr, iterator(item, callback), callback(err))


var arr = [{name:'Jack', delay: 200},
           {name:'Mike', delay: 100},
           {name:'Freewind', delay: 300}];

/**
 * 所有操作并发执行，且全部未出错，最终得到的err为undefined。注意最终callback只有一个参数err。
 */
// 1.1
async.each(arr, function(item, callback) {
    log('1.1 enter: ' + item.name);
    setTimeout(function(){
        log('1.1 handle: ' + item.name);
        callback(null, item.name);
    }, item.delay);
}, function(err) {
    log('1.1 err: ' + err);
});
// 输出如下：
// 42.244> 1.1 enter: Jack
// 42.245> 1.1 enter: Mike
// 42.245> 1.1 enter: Freewind
// 42.350> 1.1 handle: Mike
// 42.445> 1.1 handle: Jack
// 42.554> 1.1 handle: Freewind
// 42.554> 1.1 err: undefined


/**
 * 如果中途出错，则出错后马上调用最终的callback。其它未执行完的任务继续执行。
 */
async.each(arr,function(item, callback) {
    log('1.2 enter: ' +item.name);
    setTimeout(function() {
        log('1.2 handle: ' + item.name);
        if(item.name==='Jack') {
            callback('myerr');
        }
    }, item.delay);
}, function(err) {
    log('1.2 err: ' + err);
});
// 输出如下：
// 42.246> 1.2 enter: Jack
// 42.246> 1.2 enter: Mike
// 42.246> 1.2 enter: Freewind
// 42.350> 1.2 handle: Mike
// 42.445> 1.2 handle: Jack
// 42.446> 1.2 err: myerr
// 42.555> 1.2 handle: Freewind

/**
 * 与each相似，但不是并行执行。而是一个个按顺序执行。
 */
async.eachSeries(arr, function(item, callback) {
    log('1.3 enter: ' + item.name);
    setTimeout(function(){
        log('1.3 handle: ' + item.name);
        callback(null, item.name);
    }, item.delay);
}, function(err) {
    log('1.3 err: ' + err);
});
// 42.247> 1.3 enter: Jack
// 42.459> 1.3 handle: Jack
// 42.459> 1.3 enter: Mike
// 42.569> 1.3 handle: Mike
// 42.569> 1.3 enter: Freewind
// 42.883> 1.3 handle: Freewind
// 42.883> 1.3 err: undefined

/**
 * 如果中途出错，则马上把错误传给最终的callback，还未执行的不再执行。
 */
async.eachSeries(arr,function(item, callback) {
    log('1.4 enter: ' +item.name);
    setTimeout(function() {
        log('1.4 handle: ' + item.name);
        if(item.name==='Jack') {
            callback('myerr');
        }
    }, item.delay);
}, function(err) {
    log('1.4 err: ' + err);
});
// 42.247> 1.4 enter: Jack
// 42.460> 1.4 handle: Jack
// 42.460> 1.4 err: myerr

/**
 * 分批执行，第二个参数是每一批的个数。每一批内并行执行，但批与批之间按顺序执行。
 */
async.eachLimit(arr, 2, function(item, callback) {
    log('1.5 enter: ' + item.name);
    setTimeout(function(){
        log('1.5 handle: ' + item.name);
        callback(null, item.name);
    }, item.delay);
}, function(err) {
    log('1.5 err: ' + err);
});
// 42.247> 1.5 enter: Jack
// 42.248> 1.5 enter: Mike
// 42.351> 1.5 handle: Mike
// 42.352> 1.5 enter: Freewind
// 42.461> 1.5 handle: Jack
// 42.664> 1.5 handle: Freewind
// 42.664> 1.5 err: undefined

/**
 * 如果中途出错，错误将马上传给最终的callback。同一批中的未执行完的任务还将继续执行，但下一批及以后的不再执行。
 */
async.eachLimit(arr,2,function(item, callback) {
    log('1.6 enter: ' +item.name);
    setTimeout(function() {
        log('1.6 handle: ' + item.name);
        if(item.name==='Jack') {
            callback('myerr');
        }
    }, item.delay);
}, function(err) {
    log('1.6 err: ' + err);
});
// 42.248> 1.6 enter: Jack
// 42.248> 1.6 enter: Mike
// 42.352> 1.6 handle: Mike
// 42.462> 1.6 handle: Jack
// 42.462> 1.6 err: myerr
````
<a name='every'></a><br/><br/>
### `every`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false
 */
// every(arr, iterator(item,callback), callback(result))
//alias: all

var arr = [1,2,3,6];

/**
 * 串行执行，集合中所有的元素都<=10，所以为true
 */
async.every(arr, function(item,callback){
    log('1.1 enter: ',item);
    setTimeout(function(){
        log('1.1 handle: ',item);
        callback(item<=10);
    },100);    
}, function(result) {
    log('1.1 result: ', result);
});
// 32.113> 1.1 enter: 1
// 32.123> 1.1 enter: 2
// 32.123> 1.1 enter: 3
// 32.123> 1.1 enter: 6
// 32.233> 1.1 handle: 1
// 32.233> 1.1 handle: 2
// 32.233> 1.1 handle: 3
// 32.233> 1.1 handle: 6
// 32.233> 1.1 result: true

/**
 * 串行执行，集合中至少有一个元素不大于2，所以为false
 */
async.every(arr, function(item,callback){
    log('1.2 enter: ',item);
    setTimeout(function(){
        log('1.2 handle: ',item);
        callback(item>2);
    },100);    
}, function(result) {
    log('1.2 result: ', result);
});
// 32.123> 1.2 enter: 1
// 32.123> 1.2 enter: 2
// 32.123> 1.2 enter: 3
// 32.123> 1.2 enter: 6
// 32.233> 1.2 handle: 1
// 32.233> 1.2 result: false
// 32.233> 1.2 handle: 2
// 32.233> 1.2 handle: 3
// 32.233> 1.2 handle: 6
````
<a name='filter'></a><br/><br/>
`filter` 和 `reject`代码演示

````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 使用异步操作对集合中的元素进行筛选。需要注意的是，iterator的callback只有一个参数，只能接收true或false。
 *
 * 对于出错，该函数没有做出任何处理，直接由nodejs抛出。所以需要注意对Error的处理。
 *
 * async提供了两种方式：
 * 1. 并行执行：filter
 * 2. 顺序执行：filterSereis
 */
// filter(arr, iterator(item, callback(test)), callback(results))

var arr = [1,2,3,4,5];

/**
 * 并行执行，对arr进行筛选。
 */
async.filter(arr, function(item, callback) {
    log('1.1 enter: ' + item);
    setTimeout(function() {
        log('1.1 test: ' + item);
        callback(item>=3);
    }, 200);
}, function(results) {
    log('1.1 results: ', results);
});
//16.739> 1.1 enter: 1
//16.749> 1.1 enter: 2
//16.749> 1.1 enter: 3
//16.749> 1.1 enter: 4
//16.749> 1.1 enter: 5
//16.749> 1.3 enter: 1
//16.949> 1.1 test: 1
//16.949> 1.1 test: 2
//16.949> 1.1 test: 3
//16.949> 1.1 test: 4
//16.949> 1.1 test: 5
//16.949> 1.1 results: [ 3, 4, 5 ]


/**
* 如果出错，将会由nodejs抛出，导致出错。为保证其它代码正常运行，注释掉该测试。
*
* try..catch：抓不到这个错误
*/
/*
async.filter(arr, function(item, callback) {
    log('1.2 enter: ' + item);
    setTimeout(function() {
        log('1.2 handle: ' + item);
        if(item===2) {
            throw new Error('myerr');
        }
        callback(item>=3);
    }, 100);
}, function(results) {
    log('1.2 results: ', results);
});
*/

/**
* 串行执行，对arr进行筛选。
*/
// 1.3
async.filterSeries(arr, function(item, callback) {
    log('1.3 enter: ' + item);
    setTimeout(function() {
        log('1.3 handle: ' + item);
        callback(item>=3);
    }, 200);
}, function(results) {
    log('1.3 results: ', results);
});
// 16.749> 1.3 enter: 1
// 16.949> 1.3 handle: 1
// 16.949> 1.3 enter: 2
// 17.149> 1.3 handle: 2
// 17.149> 1.3 enter: 3
// 17.369> 1.3 handle: 3
// 17.369> 1.3 enter: 4
// 17.589> 1.3 handle: 4
// 17.589> 1.3 enter: 5
// 17.789> 1.3 handle: 5
// 17.789> 1.3 results: [ 3, 4, 5 ]
/*
* reject跟filter正好相反，当测试为true时，抛弃之
*/
// reject(arr, iterator(item, callback(test)), callback(results)
async.reject(arr, function(item, callback) {
    log('1.4 enter: ' + item);
    setTimeout(function() {
        log('1.4 test: ' + item);
        callback(item>=3);
    }, 200);
}, function(results) {
    log('1.4 results: ', results);
});
// 31.359> 1.4 enter: 1
// 31.359> 1.4 enter: 2
// 31.359> 1.4 enter: 3
// 31.359> 1.4 enter: 4
// 31.359> 1.4 enter: 5
// 31.559> 1.4 test: 1
// 31.559> 1.4 test: 2
// 31.559> 1.4 test: 3
// 31.559> 1.4 test: 4
// 31.559> 1.4 test: 5
// 31.569> 1.4 results: [ 1, 2 ]


/**
 * 串行执行，对arr进行筛选。
 */
// 1.3
async.rejectSeries(arr, function(item, callback) {
    log('1.5 enter: ' + item);
    setTimeout(function() {
        log('1.5 handle: ' + item);
        callback(item>=3);
    }, 200);
}, function(results) {
    log('1.5 results: ', results);
});
//43.592> 1.5 enter: 1
//43.799> 1.5 handle: 1
//43.800> 1.5 enter: 2
//44.004> 1.5 handle: 2
//44.007> 1.5 enter: 3
//44.210> 1.5 handle: 3
//44.211> 1.5 enter: 4
//44.412> 1.5 handle: 4
//44.413> 1.5 enter: 5
//44.614> 1.5 handle: 5
//44.616> 1.5 results: [ 1, 2 ]
````
<a name='iterator'></a><br/><br/>
### `iterator`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 将一组函数包装成为一个iterator，初次调用此iterator时，会执行定义中的第一个函数并返回第二个函数以供调用。
 * 也可通过手动调用 next() 得到以下一个函数为起点的新的iterator。
 * 该函数通常由async在内部使用，但如果需要时，也可在我们的代码中使用它。
 */
// async.iterator(tasks)

var iter = async.iterator([
    function () {log('I am 111')},
    function () {log('I am 222')},
    function () {log('I am 333')}
]);

/**
* 直接调用()，会执行当前函数，并返回一个由下个函数为起点的新的iterator
*/
//1.1
log('1.1 iter()');
var it1 = iter();
it1();
it1();
//28.368> 1.1 iter()
//28.371> I am 111
//28.372> I am 222
//28.372> I am 222

/**
* 通过iter()来调用下一个函数
*/
log('1.2 iter()');
var it2 = iter();
var it3 = it2();
var it4 = it3();
//it4(); // 这句代码执行会报错
log(it4); // => 'null'
//32.449> 1.2 iter()
//32.452> I am 111
//32.452> I am 222
//32.453> I am 333
//32.454> null

/**
 * 调用next()，不会执行当前函数，直接返回由下个函数为起点的新iterator
 * 对于同一个iterator，多次调用next()，不会影响自己
 */
//1.3
log('1.3 iter()');
var it5 = iter.next();
it5();
var it6 = iter.next().next();
it6();
iter();
//39.895> 1.3 iter()
//39.898> I am 222
//39.899> I am 333
//39.899> I am 111
````
<a name='map'></a><br/><br/>
### `map`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到最终的callback里。与each的区别是，each只关心操作不管最后的值，而map关心的最后产生的值。
 *
 * 提供了两种方式：
 * 1. 并行执行。同时对集合中所有元素进行操作，结果汇总到最终callback里。如果出错，则立刻返回错误以及已经执行完的任务的结果，未执行完的占个空位
 * 2. 顺序执行。对集合中的元素一个一个执行操作，结果汇总到最终callback里。如果出错，则立刻返回错误以及已经执行完的结果，未执行的被忽略。
 */
// map(arr, iterator(item, callback), callback(err, results))

var arr = [{name:'Jack', delay:200}, {name:'Mike', delay: 100}, {name:'Freewind', delay:300}, {name:'Test', delay: 50}];

/**
 * 所有操作均正确执行，未出错。所有结果按元素顺序汇总给最终的callback。
 */
// 1.1
async.map(arr, function(item, callback) {
    log('1.1 enter: ' + item.name);
    setTimeout(function() {
        log('1.1 handle: ' + item.name);
        callback(null, item.name + '!!!');
    }, item.delay);
}, function(err,results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
// 54.569> 1.1 enter: Jack
// 54.569> 1.1 enter: Mike
// 54.569> 1.1 enter: Freewind
// 54.569> 1.1 enter: Test
// 54.629> 1.1 handle: Test
// 54.679> 1.1 handle: Mike
// 54.789> 1.1 handle: Jack
// 54.879> 1.1 handle: Freewind
// 54.879> 1.1 err:
// 54.879> 1.1 results: [ 'Jack!!!', 'Mike!!!', 'Freewind!!!', 'Test!!!' ]

/**
*  如果中途出错，立刻将错误、以及已经执行完成的结果汇总给最终callback。未执行完的将会在结果数组中用占个空位。
*/
async.map(arr, function(item, callback) {
    log('1.2 enter: ' + item.name);
    setTimeout(function() {
        log('1.2 handle: ' + item.name);
        if(item.name==='Jack') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
// 54.569> 1.2 enter: Jack
// 54.569> 1.2 enter: Mike
// 54.569> 1.2 enter: Freewind
// 54.569> 1.2 enter: Test
// 54.629> 1.2 handle: Test
// 54.679> 1.2 handle: Mike
// 54.789> 1.2 handle: Jack
// 54.789> 1.2 err: myerr
// 54.789> 1.2 results: [ undefined, 'Mike!!!', , 'Test!!!' ]
// 54.879> 1.2 handle: Freewind

/**
* 顺序执行，一个完了才执行下一个。
*/
async.mapSeries(arr, function(item, callback) {
    log('1.3 enter: ' + item.name);
    setTimeout(function() {
        log('1.3 handle: ' + item.name);
        callback(null, item.name+'!!!');
    }, item.delay);
}, function(err,results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});
// 54.569> 1.3 enter: Jack
// 54.789> 1.3 handle: Jack
// 54.789> 1.3 enter: Mike
// 54.899> 1.3 handle: Mike
// 54.899> 1.3 enter: Freewind
// 55.209> 1.3 handle: Freewind
// 55.209> 1.3 enter: Test
// 55.269> 1.3 handle: Test
// 55.269> 1.3 err:
// 55.269> 1.3 results: [ 'Jack!!!', 'Mike!!!', 'Freewind!!!', 'Test!!!' ]

/**
* 顺序执行过程中出错，只把错误以及执行完的传给最终callback，未执行的忽略。
*/
async.mapSeries(arr, function(item, callback) {
    log('1.4 enter: ' + item.name);
    setTimeout(function() {
        log('1.4 handle: ' + item.name);
        if(item.name==='Mike') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
// 47.616> 1.4 enter: Jack
// 47.821> 1.4 handle: Jack
// 47.821> 1.4 enter: Mike
// 47.931> 1.4 handle: Mike
// 47.931> 1.4 err: myerr
// 47.932> 1.4 results: [ 'Jack!!!', undefined ]

/**
 * 并行执行，同时最多2个函数并行，传给最终callback。
 */
//1.5
async.mapLimit(arr,2, function(item, callback) {
    log('1.5 enter: ' + item.name);
    setTimeout(function() {
        log('1.5 handle: ' + item.name);
        if(item.name==='Jack') callback('myerr');
        else callback(null, item.name+'!!!');
    }, item.delay);
}, function(err, results) {
    log('1.5 err: ', err);
    log('1.5 results: ', results);
});
//57.797> 1.5 enter: Jack
//57.800> 1.5 enter: Mike
//57.900> 1.5 handle: Mike
//57.900> 1.5 enter: Freewind
//58.008> 1.5 handle: Jack
//58.009> 1.5 err: myerr
//58.009> 1.5 results: [ undefined, 'Mike!!!' ]
//58.208> 1.5 handle: Freewind
//58.208> 1.5 enter: Test
//58.273> 1.5 handle: Test
````
<a name='nextTick'></a><br/><br/>
### `nextTick`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * nextTick的作用与nodejs的nextTick一样，再最后调用函数。
 * 但在浏览器端，只能使用setTimeout(callback,0)，但这个方法有时候会让其它高优先级的任务插到前面去。
 * 所以提供了这个nextTick，让同样的代码在服务器端和浏览器端表现一致。
 */
// nextTick(callback)

var calls = [];
async.nextTick(function() {
    calls.push('two');
});
async.nextTick(function() {
    log('1.1',calls);
});
calls.push('one');
log('1.2',calls);
async.nextTick(function() {
    log('1.3',calls);
});
//09.838> 1.2[ 'one' ]
//09.842> 1.1[ 'one', 'two' ]
//09.843> 1.3[ 'one', 'two' ]
````
<a name='parallel'></a><br/><br/>
### `parallel`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
 *
 * 如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
 * 同时支持json形式的tasks，其最终callback的结果也为json形式。
 */
// parallel(tasks, [callback])

/**
 * 并行执行多个函数，每个函数的值将按函数声明的先后顺序汇成一个数组，传给最终callback。
 */
// 1.1
async.parallel([
    function(cb) { t.fire('a400', cb, 400) },
    function(cb) { t.fire('a200', cb, 200) },
    function(cb) { t.fire('a300', cb, 300) }
], function (err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
//36.929> 1.1 err: null
//36.930> 1.1 results: [ 'a400', 'a200', 'a300' ]

/**
* 如果中途有个函数出错，则将该err和已经完成的函数值汇成一个数组，传给最终的callback。还没有执行完的函数的值将被忽略，但要在最终数组中占个位置
*/
// 1.2
async.parallel([
    function(cb) { log('1.2.1: ', 'start'); t.fire('a400', cb, 400) }, // 该函数的值不会传给最终callback，但要占个位置
    function(cb) { log('1.2.2: ', 'start'); t.err('e200', cb, 200) },
    function(cb) { log('1.2.3: ', 'start'); t.fire('a100', cb, 100) }
], function(err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
//36.537> 1.2.1: start
//36.540> 1.2.2: start
//36.541> 1.2.3: start
//36.741> 1.2 err: e200
//36.744> 1.2 results: [ , undefined, 'a100' ]

/**
* 以json形式传入tasks，最终results也为json
*/
// 1.3
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) },
    b: function(cb) { t.fire('c300', cb, 300) }
}, function(err, results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});
//36.943> 1.3 err: null
//36.944> 1.3 results: { b: 'c300', a: 'a400' }

/**
* 如果中途出错，会将err与已经完成的函数值（汇成一个json）传给最终callback。未执行完成的函数值被忽略，不会出现在最终json中。
*/
// 1.4
async.parallel({
    a: function(cb) { t.fire('a400', cb, 400) }, // 该函数的值不会传给最终的callback
    b: function(cb) { t.err('e300', cb, 300) },
    c: function(cb) { t.fire('c200', cb, 200) }
}, function(err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
//36.853> 1.4 err: e300
//36.854> 1.4 results: { c: 'c200', b: undefined }

/**
 * 并行执行，同时最多2个函数并行，传给最终callback。
 */
//1.5
async.parallelLimit({
    a:function(cb) { log('a start'); t.fire('a400', cb, 200) },
    b:function(cb) { log('b start'); t.fire('b200', cb, 200) },
    c:function(cb) { log('c start'); t.fire('c100', cb, 100) },
    d:function(cb) { log('d start'); t.fire('d600', cb, 600) },
    e:function(cb) { log('e start'); t.fire('e300', cb, 300) }
},2, function(err, results) {
    log('1.5 err: ', err);
    log('1.5 results: ', results);
});
//26.993> a start
//26.996> b start
//27.200> c start
//27.202> d start
//27.313> e start
//27.809> 1.5 err:
//27.810> 1.5 results: { a: 'a400', b: 'b200', c: 'c100', e: 'e300', d: 'd600' }
````
<a name='queue'></a><br/><br/>
### `queue`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * queue是一个串行的消息队列，通过限制了worker数量，不再一次性全部执行。
 * 当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。
 *
 * 该函数有多个点可供回调，如worker用完时、无等候任务时、全部执行完时等。
 */
// queue(worker, concurrency)

/**
 * 定义一个queue，设worker数量为2
 */
var q = async.queue(function(task, callback) {
    log('worker is processing task: ', task.name);
    task.run(callback);
}, 2);

/**
 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
 */
q.saturated = function() {
    log('all workers to be used');
}

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
q.empty = function() {
    log('no more tasks wating');
}

/**
 * 监听：当所有任务都执行完以后，将调用该函数
 */
q.drain = function() {
    log('all tasks have been processed');
}

/**
* 独立加入2个任务
*/
q.push({name:'t1', run: function(cb){
    log('t1 is running, waiting tasks: ', q.length());
    t.fire('t1', cb, 400); // 400ms后执行
}}, function(err) {
    log('t1 executed');
});
log('pushed t1, waiting tasks: ', q.length());

q.push({name:'t2',run: function(cb){
    log('t2 is running, waiting tasks: ', q.length());
    t.fire('t2', cb, 200); // 200ms后执行
}}, function(err) {
    log('t2 executed');
});
log('pushed t2, waiting tasks: ', q.length());
//54.448> pushed t1, waiting tasks: 1
//54.451> all workers to be used
//54.452> pushed t2, waiting tasks: 2
//54.452> worker is processing task: t1
//54.453> t1 is running, waiting tasks: 1
//54.455> no more tasks wating
//54.455> worker is processing task: t2
//54.455> t2 is running, waiting tasks: 0
//54.656> t2 executed
//54.867> t1 executed
//54.868> all tasks have been processed


// 同时加入多个任务
q.push([
    {
        name:'t3', run: function(cb){
            log('t3 is running, waiting tasks: ', q.length());
            t.fire('t3', cb, 300); // 300ms后执行
        }
    },{
        name:'t4', run: function(cb){
            log('t4 is running, waiting tasks: ', q.length());
            t.fire('t4', cb, 500); // 500ms后执行
        }
    },{
        name:'t5', run: function(cb){
            log('t5 is running, waiting tasks: ', q.length());
            t.fire('t5', cb, 100); // 100ms后执行
        }
    },{
        name:'t6', run: function(cb){
            log('t6 is running, waiting tasks: ', q.length());
            t.fire('t6', cb, 400); // 400ms后执行
        }
    }
], function(err) {
    log('err: ',err);
});
log('pushed t3,t4,t5,t6 into queue, waiting tasks: ', q.length());
//53.755> all workers to be used
//53.758> pushed t3,t4,t5,t6 into queue, waiting tasks: 4
//53.759> worker is processing task: t3
//53.760> t3 is running, waiting tasks: 3
//53.762> worker is processing task: t4
//53.762> t4 is running, waiting tasks: 2
//54.073> err: null
//54.074> worker is processing task: t5
//54.076> t5 is running, waiting tasks: 1
//54.183> err: null
//54.184> no more tasks wating
//54.185> worker is processing task: t6
//54.186> t6 is running, waiting tasks: 0
//54.265> err: null
//54.588> err: null
//54.589> all tasks have been processed
````
<a name='reduce'></a><br/><br/>
### `Reduce`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * Reduce可以让我们给定一个初始值，用它与集合中的每一个元素做运算，最后得到一个值。reduce从左向右来遍历元素，如果想从右向左，可使用reduceRight。
 */
//reduce(arr, memo, iterator(memo,item,callback), callback(err,result))
//alias: inject, foldl

var arr = [1,3,5];

/**
 * 顺序执行
 */
async.reduce(arr, 100, function(memo, item, callback) {
    log('1.1 enter: ' + memo +', ' + item);
    setTimeout(function() {
        callback(null, memo+item);
    }, 100);
},function(err, result) {
    log('1.1 err: ', err);
    log('1.1 result: ', result);
});
// 28.789> 1.1 enter: 100, 1
// 28.889> 1.1 enter: 101, 3
// 28.999> 1.1 enter: 104, 5
// 29.109> 1.1 err:
// 29.109> 1.1 result: 109

/**
 * 顺序执行过程中出错，只把错误传给最终callback，结果是null
 */
async.reduce(arr, 100, function(memo, item, callback) {
    log('1.2 enter: ' + memo +', ' + item);
    setTimeout(function() {
        if(item===3) callback('myerr');
        else callback(null, memo+item);
    }, 100);
},function(err, result) {
    log('1.2 err: ', err);
    log('1.2 result: ', result);
});
// 05.541> 1.2 enter: 100, 1
// 05.649> 1.2 enter: 101, 3
// 05.760> 1.2 err: myerr
// 05.760> 1.2 result:

/**
 * 顺序执行从右向左
 *
 * alias: foldr
 */
async.reduceRight(arr, 100, function(memo, item, callback) {
    log('1.3 enter: ' + memo +', ' + item);
    setTimeout(function() {
        callback(null, memo+item);
    }, 100);
},function(err, result) {
    log('1.3 err: ', err);
    log('1.3 result: ', result);
});
// 28.789> 1.3 enter: 100, 5
// 28.889> 1.3 enter: 105, 3
// 28.999> 1.3 enter: 108, 1
// 29.109> 1.3 err:
// 29.109> 1.3 result: 109

/**
 *  通过t.inc做一个累加器，参与reduce的计算
 */
async.reduce(arr, 100, function(memo,item,callback) {
    log('1.4 enter: '+memo+','+item);
    t.inc(item, function(err,n) {
        log('1.4 handle: ',n);
        callback(null, memo+n);
    });
}, function(err,result) {
    log('1.4 err: ', err);
    log('1.4 result: ', result);
});
// 28.789> 1.4 enter: 100,1
// 28.999> 1.4 handle: 2
// 28.999> 1.4 enter: 102,3
// 29.209> 1.4 handle: 4
// 29.209> 1.4 enter: 106,5
// 29.409> 1.4 handle: 6
// 29.409> 1.4 err:
// 29.409> 1.4 result: 112
// --> spent 0.62s

/**
 *  通过t.inc做一个累加器，并实现对map的结果集做reduce
 */
async.map(arr, function(item, callback) {
    log('1.5 enter: ', item);
    t.inc(item, function(err,n){
        log('1.5 handle: ', n);
        callback(null,n);
    });  
},function(err, results) {
    log('1.5 err: ', err);
    log('1.5 results: ', results);
    var sum = results.reduce(function(memo, item) {
        return memo + item;
    }, 100);
    log('1.5 sum: ', sum);
});
// 28.789> 1.5 enter: 1
// 28.789> 1.5 enter: 3
// 28.789> 1.5 enter: 5
// 28.999> 1.5 handle: 2
// 28.999> 1.5 handle: 4
// 28.999> 1.5 handle: 6
// 28.999> 1.5 err:
// 28.999> 1.5 results: [ 2, 4, 6 ]
// 28.999> 1.5 sum: 112
// --> spent 0.21
````
<a name='series'></a><br/><br/>
### `series`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
 *
 * 如果任何一个函数向它的回调函数中传了一个error，则后面的函数都不会被执行，并且会立刻将该error以及已经执行了的函数的结果，传给series中最后那个callback。
 * 当所有的函数执行完后（没有出错），则会把每个函数传给其回调函数的结果合并为一个数组，传给series最后的那个callback。
 * 还可以json的形式来提供tasks。每一个属性都会被当作函数来执行，并且结果也会以json形式传给series最后的那个callback。这种方式可读性更高一些。
 */
// series(tasks, [callback])

/**
 * 全部函数都正常执行。每个函数产生的值将按顺序合并为一个数组，传给最终的callback。
 */
// 1.1
async.series([
    function(cb) { t.inc(3, cb); },
    function(cb) { t.inc(8, cb); },
    function(cb) { t.inc(2, cb); }
], function(err, results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
//05.155> 1.1 err: null
//05.156> 1.1 results: [ 4, 9, 3 ]

/**
 * 中间有函数出错。出错之后的函数不会执行，错误及之前正常执行的函数结果将传给最终的callback。
 */
// 1.2
async.series([
    function(cb) { t.inc(3, cb); },
    function(cb) { t.err('test_err', cb); },
    function(cb) { t.inc(8, cb); }
], function (err, results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
//04.964> 1.2 err: test_err
//04.973> 1.2 results: [ 4, undefined ]

/**
 * 如果某个函数传的数据是undefined, null, {}, []等，它们会原样传给最终callback。
 */
// 1.3
async.series([
    function(cb) { t.fire(3, cb);},
    function(cb) { t.fire(undefined, cb); },
    function(cb) { t.fire(null, cb); },
    function(cb) { t.fire({}, cb); },
    function(cb) { t.fire([], cb); },
    function(cb) { t.fire('abc', cb) }
], function(err, results) {
    log('1.3 err: ', err);
    log('1.3 results: ', results);
});
//05.794> 1.3 err: null
//05.795> 1.3 results: [ 3, undefined, null, {}, [], 'abc' ]

/**
 * 以json形式传入tasks。其结果也将以json形式传给最终callback。
 */
async.series({
    a: function(cb) { t.inc(3, cb); },
    b: function(cb) { t.fire(undefined, cb); },
    c: function (cb) { t.err('myerr', cb); },
    d: function (cb) { t.inc(8, cb); }
}, function (err, results) {
    log('1.4 err: ', err);
    log('1.4 results: ', results);
});
//05.178> 1.4 err: myerr
//05.179> 1.4 results: { a: 4, b: undefined, c: undefined }
````

<a name='some'></a><br/><br/>
### `some`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false.
 */
// some(arr, iterator(item,callback(test)), callback(result))
//alias: any

var arr = [1,2,3,6];

/**
 * 串行执行，集合中至少有一个元素<=3，所以结果为true
 */
// 1.1
async.some(arr, function(item,callback){
    log('1.1 enter: ',item);
    setTimeout(function(){
        log('1.1 handle: ',item);
        callback(item<=3);
    },100);
}, function(result) {
    log('1.1 result: ', result);
});
// 36.165> 1.1 enter: 1
// 36.165> 1.1 enter: 2
// 36.165> 1.1 enter: 3
// 36.165> 1.1 enter: 6
// 36.275> 1.1 handle: 1
// 36.275> 1.1 result: true
// 36.275> 1.1 handle: 2
// 36.275> 1.1 handle: 3
// 36.275> 1.1 handle: 6


/**
 * 串行执行，集合中没有一个元素>10，所以结果为false
 */
async.some(arr, function(item,callback){
    log('1.2 enter: ',item);
    setTimeout(function(){
        log('1.2 handle: ',item);
        callback(item>10);
    },100);    
}, function(result) {
    log('1.2 result: ', result);
});
// 36.165> 1.2 enter: 1
// 36.165> 1.2 enter: 2
// 36.165> 1.2 enter: 3
// 36.165> 1.2 enter: 6
// 36.275> 1.2 handle: 1
// 36.275> 1.2 handle: 2
// 36.275> 1.2 handle: 3
// 36.275> 1.2 handle: 6
// 36.275> 1.2 result: false


````
<a name='sortBy'></a><br/><br/>
### `sortBy`代码演示
````javascript
var async = require('async');

var t = require('./t');
var log = t.log;

/**
 * 对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。
 */
// sortBy(array, iterator(item,callback(err,result)), callback(err,results))

var arr = [3,6,1];

/**
 * 通过异步迭代器，对集合进行排序
 */
async.sortBy(arr, function(item, callback) {
    setTimeout(function() {
        callback(null,item);
    }, 200);
}, function(err,results) {
    log('1.1 err: ', err);
    log('1.1 results: ', results);
});
// 26.562> 1.1 err: null
// 26.562> 1.1 results: [ 1, 3, 6 ]

/**
 * 迭代出错，callback返回err，没有results
 */
async.sortBy(arr, function(item, callback) {
    setTimeout(function() {
        if(item===6) callback('myerr');
        else callback(null,item);
    }, 200);
}, function(err,results) {
    log('1.2 err: ', err);
    log('1.2 results: ', results);
});
// 26.572> 1.2 err: myerr
// 26.572> 1.2 results:

````
<a name='t.js'></a><br/><br/>
### `t.js`代码演示
````javascript
// 其实这个文件名的't'我不是很明白原作者freewind的意思，我觉得叫做'lib.js'或者
// 'helper.js'比较合适，因为这里面都是些辅助函数。

var moment = require('moment');

exports.inc = function(n, callback, timeout) {
  //将参数n自增1之后的结果返回给async
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, n+1);
    }, timeout);
};

exports.fire = function(obj, callback, timeout) {
  //直接将obj的内容返回给async
    timeout = timeout || 200;
    setTimeout(function() {
        callback(null, obj);
    }, timeout);
};

exports.err = function(errMsg, callback, timeout) {
  //模拟一个错误的产生，让async各个函数末尾的callback接收到。
    timeout = timeout || 200;
    setTimeout(function() {
        callback(errMsg);
    }, timeout);
};

// utils
exports.log = function(msg, obj) {
  //对console.log进行了封装。主要是增加了秒钟的输出，通过秒数的差值方便大家对async的理解。
    process.stdout.write(moment().format('ss.SSS')+'> ');
    if(obj!==undefined) {
        process.stdout.write(msg);
        console.log(obj);
    } else {
        console.log(msg);
    }
};

exports.wait = function(mils) {
  //刻意等待mils的时间，mils的单位是毫秒。
    var now = new Date;
    while(new Date - now <= mils);
}

````
<a name='times'></a><br/><br/>
### `times` `timesSeries`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
* 异步运行,times可以指定调用几次，并把结果合并到数组中返回
*/
// times(n, callback)

function delay(n){return (n+12) % 7 *100;}
var createUser = function(id, callback) {
    callback(null, {
        id: 'user' + id,
        delay:delay(id)
    })
}

/**
 * 异步执行，调用3次createUser函数，结果被合并到数组返回
 */
//1.1
async.times(3, function(n, callback){
    log("1.1 enter: "+ n);
    setTimeout(function(){
        log('1.1 handler: ',n);
        createUser(n, function(err, user) {
            callback(err, user)
        })
    },delay(n));
}, function(err, users) {
    log('1.1 err: ',err);
    log('1.1 result: ',users);
});
//07.397> 1.1 enter: 0
//07.400> 1.1 enter: 1
//07.401> 1.1 enter: 2
//07.412> 1.1 handler: 2
//07.912> 1.1 handler: 0
//08.009> 1.1 handler: 1
//08.010> 1.1 err: null
//08.011> 1.1 result: [ { id: 'user0', delay: 500 },
//    { id: 'user1', delay: 600 },
//    { id: 'user2', delay: 0 } ]

/**
*  timesSeries与time唯一不同的是，同步执行
*/
//timesSeries(n, callback)

/**
 * 同步执行，调用3次createUser函数，结果被合并到数组返回
 */
//1.2
async.timesSeries(3, function(n, callback){
    log("1.2 enter: "+ n);
    setTimeout(function(){
        log('1.2 handler: ',n);
        createUser(n, function(err, user) {
            callback(err, user)
        })
    },delay(n));
}, function(err, users) {
    log('1.2 err: ',err);
    log('1.2 result: ',users);
});
//16.642> 1.2 enter: 0
//17.159> 1.2 handler: 0
//17.162> 1.2 enter: 1
//17.763> 1.2 handler: 1
//17.767> 1.2 enter: 2
//17.778> 1.2 handler: 2
//17.779> 1.2 err: null
//17.780> 1.2 result: [ { id: 'user0', delay: 500 },
//    { id: 'user1', delay: 600 },
//    { id: 'user2', delay: 0 } ]
````
<a name='util.js'></a><br/><br/>
### `unmemoize` `noConflict` `memoize` `log` `dir` 代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
* 让某一个函数在内存中缓存它的计算结果。对于相同的参数，只计算一次，下次就直接拿到之前算好的结果。
* hasher可以让我们自定义如何根据参数来判断它是否已经在缓存中了。
*/
// memoize(fn, [hasher])
//1.1
var slow_fn = function(x, y, callback) {
    log('1.1 start working for: ' + x+','+y);
    t.wait(500);
    log('1.1 finished: ' + x+','+y);
    callback(null, x+','+y);
};
var fn = async.memoize(slow_fn,function(x,y) {
    return x+y;
});
fn('a','b', function(err, result) {
    log("1.1 first time: "+result);
});
fn('cc','d', function(err, result) {
    log("1.1 first time: "+result);
});
fn('a','b', function(err, result) {
    log("1.1 second time: "+result);
});
//15.416> 1.1 start working for: a,b
//15.920> 1.1 finished: a,b
//15.920> 1.1 first time: a,b
//15.921> 1.1 start working for: cc,d
//16.423> 1.1 finished: cc,d
//16.423> 1.1 first time: cc,d
//16.424> 1.1 second time: a,b


/**
* 让已经被缓存的函数，返回不缓存的函数引用。
*/
// unmemoize(fn)
//1.2
var slow_fn2 = function(x, y, callback) {
    log('1.2 start working for: ' + x+','+y);
    t.wait(500);
    log('1.2 finished: ' + x+','+y);
    callback(null, x+','+y);
};
var fn2 = async.memoize(slow_fn2,function(x,y) {
    return x+y;
});

fn2('a','b', function(err,result) {
    log("1.2 first time: "+result);
});

var unFn2 =async.unmemoize(fn2);
log('1.2 unmemoized');

unFn2('a','b', function(err,result) {
    log("1.2 second time: "+result);
});
//16.424> 1.2 start working for: a,b
//16.926> 1.2 finished: a,b
//16.926> 1.2 first time: a,b
//16.927> 1.2 unmemoized
//16.927> 1.2 start working for: a,b
//17.428> 1.2 finished: a,b
//17.428> 1.2 second time: a,b

/**
* 执行某异步函数，并记录它的返回值。试验函数时很方便，不用写那些固定模式的代码。
* 如果该函数向回调中传入了多个参数，则每行记录一个。
*/
// log(function, arguments)
//1.3
var x = function() {
    this.name = 'bsspirit';
}
var hello = function(name, callback) {
    setTimeout(function() {
        callback(null,
            'first ' + name,
            'second '+ name,
            x,
            {a:'123'}
        );
    }, 200);
};
log("1.3 handler");
async.log(hello, 'time');
//37.620> 1.3 handler
//first time
//second time
//[Function]
//{ a: '123' }

/**
* dir与log都是打印出输，在nodejs环境中没有分别。
* dir的不同之处在于，会调用浏览器的console.dir()函数，显示为DOM视图。
*
* http://stackoverflow.com/questions/10636866/whats-the-difference-between-async-log-and-async-dir
*/
//1.4
log("1.4 handler");
async.dir(hello, 'world');
//37.620> 1.4 handler
//first time
//second time
//[Function]
//{ a: '123' }

/**
* noConflict()仅仅用于浏览器端，在nodejs中没用，这里无法演示。
*
* 它的作用是：如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。
 * 用完之后，调用noConflict()方法，就会归还该值。同时返回async本身供换名使用。
*/
// noConflict()
/*
    // global on the server, window in the browser
    var root = this,
        previous_async = root.async;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    else {
        root.async = async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };
*/
````
<a name='waterfall'></a><br/><br/>
### `waterfall`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。
 * 如果中途出错，后面的函数将不会被执行。错误信息将传给waterfall最终的callback。之前产生的结果被丢弃。
 *
 * 这个函数名为waterfall(瀑布)，可以想像瀑布从上到下，中途冲过一层层突起的石头。
 *
 * 注意，该函数不支持json格式的tasks
 */
// async.waterfall(tasks, [callback]);

/**
 * 所有函数正常执行，每个函数的结果都将变为下一个函数的参数。
 *
 * 注意，所有的callback都必须形如callback(err, result)，但err参数在前面各函数中无需声明，它被自动处理。
 */
// 1.1
async.waterfall([
    function(cb) { log('1.1.1: ', 'start'); cb(null, 3); },
    function(n, cb) { log('1.1.2: ',n); t.inc(n, cb); },
    function(n, cb) { log('1.1.3: ',n); t.fire(n*n, cb); }
], function (err, result) {
    log('1.1 err: ', err);
    log('1.1 result: ', result);
});
//31.749> 1.1.1: start
//31.752> 1.1.2: 3
//31.953> 1.1.3: 4
//32.156> 1.1 err: null
//32.159> 1.1 result: 16

/**
* 中途有函数出错，其err直接传给最终callback，结果被丢弃，后面的函数不再执行。
*/
// 1.2
async.waterfall([
    function(cb) { log('1.2.1: ', 'start'); cb(null, 3); },
    function(n, cb) { log('1.2.2: ', n); t.inc(n, cb); },
    function(n, cb) { log('1.2.3: ', n); t.err('myerr', cb); },
    function(n, cb) { log('1.2.4: ', n); t.fire(n, cb); }
], function (err, result) {
    log('1.2 err: ', err);
    log('1.2 result: ', result);
});
//44.935> 1.2.1: start
//44.939> 1.2.2: 3
//45.140> 1.2.3: 4
//45.344> 1.2 err: myerr
//45.348> 1.2 result:

/**
* 注意： 以json形式传入tasks，将不会被执行!!
*/
async.waterfall({
    a: function(cb) { log('1.3.1: ', 'start'); cb(null, 3); },
    b: function(n, cb) { log('1.3.2: ', n); t.inc(n, cb); },
    c: function(n, cb) { log('1.3.3: ', n); t.fire(n*n, cb); }
}, function (err, result) {
    log('1.3 err: ', err);
    log('1.3 result: ', result);
});
//49.222> 1.3 err: [Error: First argument to waterfall must be an array of functions]
//49.228> 1.3 result:
````
<a name='whilst'></a><br/><br/>
### `whilst` `until` `doUntil ` `forever`和 `doWhilst`代码演示
````javascript
var async = require('async');
var t = require('./t');
var log = t.log;

/**
 * 相当于while，但其中的异步调用将在完成后才会进行下一次循环。
 *
 * 它相当于：
 * try {
 *   whilst(test) {
 *     fn();
 *   }
 *   callback();
 * } catch (err) {
 *   callback(err);
 * }
 *
 * 该函数的功能比较简单，条件变量通常定义在外面，可供每个函数访问。在循环中，异步调用时产生的值实际上被丢弃了，因为最后那个callback只能传入错误信息。
 *
 * 另外，第二个函数fn需要能接受一个函数cb，这个cb最终必须被执行，用于表示出错或正常结束。
 */
// whilst(test, fn, callback)

/**
* 正常情况，没有出错。第二个函数虽然是异步调用，但被同步执行。所以第三个函数被调用时，已经过了3秒。
*/
// 1.1
var count1 = 0;
async.whilst(
    function() { return count1 < 3 },
    function(cb) {
        log('1.1 count: ', count1);
        count1++;
        setTimeout(cb, 1000);
    },
    function(err) {
        // 3s have passed
        log('1.1 err: ', err);
    }
);
//10.318> 1.1 count: 0
//11.330> 1.1 count: 1
//12.342> 1.1 count: 2
//13.356> 1.1 err:


/**
* 中途出错。出错后立刻调用第三个函数。
*/
// 1.2
var count2 = 0;
async.whilst(
    function() { return count2 < 3 },
    function(cb) {
        log('1.2 count: ', count2);
        if(count2===1) {
            t.err('myerr', cb, 200);
        } else {
            count2++;
            setTimeout(cb, 1000);
        }
    },
    function(err) {
        // 2s have passed
        log('1.2 err: ', err);
    }
);
//12.805> 1.2 count: 0
//13.824> 1.2 count: 1
//14.026> 1.2 err: myerr

/**
* 第二个函数即使产生值，也会被忽略。第三个函数只能得到err。
*/
// 1.3
var count3 = 0;
async.whilst(
    function() {return count3 < 3 },
    function(cb) {
        log('1.3 count: ', count3);
        t.inc(count3++, cb);
    },
    function(err,result){ // result没有用
        log('1.3 err: ', err);
        log('1.3 result: ', result);
    }
);
//45.311> 1.3 count: 0
//45.514> 1.3 count: 1
//45.718> 1.3 count: 2
//45.920> 1.3 err:
//45.923> 1.3 result:

/**
*  doWhilst交换了fn,test的参数位置，先执行一次循环，再做test判断。 和javascript中do..while语法一致。
*/
// doWhilst(fn, test, callback)
//1.4
var count4 = 0;
async.doWhilst(
    function(cb) {
        log('1.4 count: ', count4);
        t.inc(count4++, cb);
    },
    function() { log("1.4 test"); return count4 < 3 },
    function(err,result){ // result没有用
        log('1.4 err: ', err);
        log('1.4 result: ', result);
    }
);
//33.643> 1.4 count: 0
//33.848> 1.4 test
//33.850> 1.4 count: 1
//34.054> 1.4 test
//34.057> 1.4 count: 2
//34.269> 1.4 test
//34.270> 1.4 err:
//34.270> 1.4 result:

/**
* until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
*/
// 1.5
var count5 = 0;
async.until(
    function() { return count5>3 },
    function(cb) {
        log('1.5 count: ', count5);
        count5++;
        setTimeout(cb, 200);
    },
    function(err) {
        // 4s have passed
        log('1.5 err: ',err);
    }
);
//42.498> 1.5 count: 0
//42.701> 1.5 count: 1
//42.905> 1.5 count: 2
//43.107> 1.5 count: 3
//43.313> 1.5 err:

/**
* doUntil与doWhilst正好相反，当test为false时循环，与true时跳出。其它特性一致。
*/
// doUntil(fn, test, callback)
// 1.6
var count6 = 0;
async.doUntil(
    function(cb) {
        log('1.6 count: ', count6);
        count6++;
        setTimeout(cb, 200);
    },
    function() { log('1.6 test');return count6>3 },
    function(err) {
        // 4s have passed
        log('1.6 err: ',err);
    }
);
//41.831> 1.6 count: 0
//42.035> 1.6 test
//42.037> 1.6 count: 1
//42.241> 1.6 test
//42.244> 1.6 count: 2
//42.456> 1.6 test
//42.457> 1.6 count: 3
//42.660> 1.6 test
//42.661> 1.6 err:

/**
 * forever，无论条件循环执行，如果不出错，callback永远不被执行
 */
//forever(fn, callback)
//1.7
var count7 = 0;
async.forever(
    function(cb) {
        log('1.7 count: ', count7);
        count7++;
        setTimeout(cb, 200);
    },
    function(err) {
        log('1.7 err: ',err);
    }
);
//52.770> 1.7 count: 0
//52.973> 1.7 count: 1
//53.175> 1.7 count: 2
//53.377> 1.7 count: 3
//53.583> 1.7 count: 4
//53.785> 1.7 count: 5
//53.987> 1.7 count: 6
//54.189> 1.7 count: 7
//54.391> 1.7 count: 8
//54.593> 1.7 count: 9
//54.795> 1.7 count: 10
//54.997> 1.7 count: 11
//55.199> 1.7 count: 12
````

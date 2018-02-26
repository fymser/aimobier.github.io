---
categories: hexo
title: 博客增加MathJax支持
tags:
  - hexo
  - 博客美化
  - mathjax
permalink: bkzjMathJaxzc
date: 2018-02-22 12:07:00
---

今天是上班的第一天，来到公司之后学习了RSA算法之后，就想好好的写一篇关于rsa的文章，但是遇到的第一个问题就是数据公式展示的问题。

在展示问题上无非就是MathJax和LaTex两种数学公式方法。

我们现在来说说如何在Hexo中展示数学公式吧。我们使用的Hexo的第三方框架 [Hexo-Math](https://github.com/akfish/hexo-math).除了引入这个框架之外还需要引入
````json
"dependencies": {
  ... more
  "hexo-inject": "^1.0.0",
  "hexo-math": "",
  "hexo-renderer-mathjax": "",
  ... more
}
````
引入完成这三个框架之后，参见 [How to config it to make it work? · Issue #26 · hexojs/hexo-math](https://github.com/hexojs/hexo-math/issues/26) 在 `config.yml`文件中配置
````yml

# MathJS
## Hexo Math JS LTX
math:
  engine: 'mathjax' # or 'katex'
  mathjax:
    src: "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
    config:
      # MathJax config
  katex:
    css: #custom_css_source
    js: #custom_js_source # not used
    config:
      # KaTeX config
````

接下来就可以在实际的博客中使用公式了。
例子：

````html
/// 行内公式
Simple inline \\(a = b + c\\).

/// 块级公式
$$\frac{\partial u}{\partial t}
= h^2 \left( \frac{\partial^2 u}{\partial x^2} +
\frac{\partial^2 u}{\partial y^2} +
\frac{\partial^2 u}{\partial z^2}\right)$$
````

/// 行内公式
Simple inline \\(a = b + c\\).

/// 块级公式
$$\frac{\partial u}{\partial t}
= h^2 \left( \frac{\partial^2 u}{\partial x^2} +
\frac{\partial^2 u}{\partial y^2} +
\frac{\partial^2 u}{\partial z^2}\right)$$

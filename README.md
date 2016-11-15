`git clone ` 项目之后进入 `make-blog`分支

首先安装node支持包
````shell
npm install
````

之后安装主题
````
git clone https://github.com/iissnan/hexo-theme-next themes/next
````
安装完成之后，拷贝 配置文件 和 404页面
````
 cp -f source/themes_config.yml themes/next/_config.yml &&  cp -f source/404.html themes/next/source/404.html
````


````shell
npm install && git clone https://github.com/iissnan/hexo-theme-next themes/next &&  cp -f source/themes_config.yml themes/next/_config.yml &&  cp -f source/404.html themes/next/source/404.html

````


````shell
 hexo clean && hexo g && hexo s
````

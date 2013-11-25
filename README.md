grunt-contrib-include
=========================



> 本程序基于 https://github.com/alanshaw/grunt-include-replace

## 区别（主要是原程序功能比较弱）

*  html 目录超过 3层 就会报错
*  对 style、script、images 资源文件路径处理不佳，虽然有 docroot 但是需要一层一层传递
*  对 html 路径处理不佳，比如在不同的文件夹里面的 html include 同一个 nav.html，这个 nav 路径基本就挂了
*  不支持表达式，比如我需要在不同的页面让某个 nav 的连接选中
*  ....


## 使用方法：
> 基本同 https://github.com/alanshaw/grunt-include-replace
> 增加一个 resroot 参数及 resroot 、absroot 全局变量
```js
//include
        include: 
        {
            dev: 
            {
                options: 
                {
                    includesDir : 'includes/',
                    prefix : '@',
                    suffix : ';',
                    resroot : '',
                    globals : 
                    {
                        'var1' : 'globals var1 ...',
                        'var2' : 'globals var2 ...'
                    }
                },
                files: 
                [
                    {
                        src: 
                        [
                            '*.html', 
                            'test/**/*.html'
                        ],
                        dest: '../'
                    }
                ]
            }
        }
```

#### resroot
Type: `String`  
这个参数有点难描述清楚，取值为 "../" 是一个或者多个 向上目录，主要用于 修复 原始 html 与 生成 html 目录结构成绩不统一

#### absroot 全局变量 一般用于 nav
```html
<ul class="nav-list">
    <li>
		<a href="@absroot;index.html" class="<% if(nav === 'index') {%> current <% } %>">index</a>
	</li>
	<li>
		<a href="@absroot;about.html" class="<% if(nav === 'about') {%> current <% } %>">about</a>
	</li>
	<li>
		<a href="@absroot;test/test.html" class="<% if(nav === 'test1') {%> current <% } %>">test1</a>
	</li>
	<li>
		<a href="@absroot;test/test/test.html" class="<% if(nav === 'test2') {%> current <% } %>">test2</a>
	</li>
	<li>
		<a href="@absroot;test/test/test/test.html" class="<% if(nav === 'test3') {%> current <% } %>">test3</a>
	</li>
</ul>
```

#### resroot 全局变量 一般用于资源文件
```html
<link rel="stylesheet" href="@resroot;style/page.css">

<img src="@resroot;images/logo.png" alt="">
```


## template 
通过上面的 demo 代码有发现使用到 模板，对，里面引入了传说中最牛的 https://github.com/aui/artTemplate

所有带参数的 include 都会经过 template 处理，so 写个 if、for 简直就是小菜一碟了

## 感谢：
* 整个程序大部分都参考了 https://github.com/alanshaw/grunt-include-replace
* https://github.com/aui/artTemplate

## 最后
* 新手，程序难免有瑕疵，望大家多包涵，多斧正！





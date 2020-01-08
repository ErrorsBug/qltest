使用说明
---------

## 环境搭建

### 1. 安装开发工具(需先安装nodejs(>=6.9.x的tls版本)) [fis3]  [https://github.com/fex-team/fis3](https://github.com/fex-team/fis3)

注：可使用cnpm替代npm安装（cnpm为淘宝的npm安装源，安装npm包速度更快，安装命令 ：

```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```     

```shell 
cnpm install -g fis3
cnpm install -g fis3-hook-module
cnpm install -g fis3-postpackager-loader
cnpm install -g fis-postpackager-simple    
cnpm install -g fis-parser-handlebars-3.x
cnpm install -g fis-spriter-csssprites  
cnpm install -g fis-postprocessor-jswrapper
cnpm install -g fis3-preprocessor-autoprefixer
cnpm install -g fis-postprocessor-px2rem
cnpm install -g fis3-preprocessor-define
cnpm install -g fis-parser-babel-6.x
cnpm install -g fis-parser-node-sass
```

> 如果安装中遇到权限问题，可使用 ``sudo`` 安装，或者 ``sudo chown -R $USER /usr/local/lib/node_modules``

### 2. clone你的项目（以下为示例）
完整代码分个仓库组成：

- a. frontend

- b. components_modules

将两部分代码clone到本地后，需将components_modules（注意，请切换到f_1.0.0分支，该分支为线上分支）拷贝到site/app目录下，具体参考以下目录结构

目录结构

```shell
├── public
│   ...
├── server
│   ├── api
│   │   ...
│   ├── components
│   │   ...
│   ├── conf
│   ├── middleware
│   │   ...
│   ├── routes
│       ...
└── site
    ├── app
    │   ├── comp
    │   ├── components_modules
    │   └── page
```

### 3. 使用 [fis3]构建你的项目

构建app站点

```shell
cd app
fis3 release -wL
```

其它如weibo、wechat、activity、weapp站点均采用fis3构建（构建前需cd到对应的站点目录）

项目默认构建发布目录路径为当前项目目录下的/public目录。

### 4.进入项目根目录，安装依赖包

```shell
cnpm install
```

### 5.wechat-react项目构建
在项目根目录执行：npm run wechat-react:dev

### 6. 启动调试服务器

进入项目根目录,启动服务

```shell
node server/startup.js      
```        

6. 浏览项目效果
[http://127.0.0.1:5000/app/page/live/center](http://127.0.0.1:5000/app/page/live/center)
[http://127.0.0.1:5000/wechat/page/recommend](http://127.0.0.1:5000/wechat/page/recommend)

<br>

## 目录结构与规范

...Todo...

* 本地开发中使用文件监听、浏览器自动刷新。这个功能实际上是 ``fis3 release`` 命令的两个参数，文件监听 ``--watch`` 或 ``-w``， 自动监听刷新 ``--live`` 或 ``-L``，参数的位置任意，使用缩短参数的时候可以连写，因此以下用法均等价：

    ```shell
    fis3 release --live --watch
    fis3 release --watch --live
    fis3 release -L -w
    fis3 release -Lw
    fis3 release -wL
    ```

    启动文件监听后，不要关闭命令行窗口，编写代码保存即会自动构建、发布、刷新浏览器。

## 构建流程

...Todo...

// 定义发布目录路径
fis.config.set('wwwPath', '../../public/weapp');

// 忽略目录、文件
fis.set('project.ignore', ['node_modules/**', 'output/**', 'fis-conf.js', 'package.json', 'tsconfig.json', 'jsconfig.json', 'typings/**', 'gulpfile.js']);


// 默认部署方式-前端资源发布目录设置
fis.match('*', {
    deploy: fis.plugin('local-deliver', {
        to: fis.config.get('wwwPath'),
    }),
});

// 发布目录下站点路径
fis.match('*', {
    release: '$0',
});

// 设置支持微信文件格式
fis.set('project.fileType.text', 'wxss, wxml');


// npm install -g fis-parser-node-sass
// 编译sass并重命名
fis.match('*.scss', {
    isCssLike: true,
    rExt: '.wxss', // from .scss to .css
    parser: fis.plugin('node-sass', {
        // fis-parser-sass option
    }),
});

// 压缩css
fis.match('*.{scss,sass,less,css}', {
    optimizer: fis.plugin('clean-css',{
        //option
    })
});

fis.match('*.html', {
    preprocessor: function(content, file, options) {
        content = content.replace(/<image /g, '<img ');

        return content;
    },
    postprocessor: function(content, file, options) {
        content = content.replace(/<img /g, '<image ');

        return content;
    }
});

// 重命名html
fis.match('*.html', {
    isHtmlLike: true,
    rExt: '.wxml'
});

fis.match('**.ts', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 1,
    }),
    rExt: '.js',
});

// cnpm install -g fis-parser-babel-6.x
// 编译es6/7
fis.match('*.js', {
    parser: fis.plugin('babel-6.x', {
        // presets: [
        //     // 注意一旦这里在这里添加了 presets 配置，则会覆盖默认加载的 preset-2015 等插件，因此需要自行添加所有需要使用的 presets
        //     'env'
        // ],
        plugins: [
            "transform-class-properties",
            "transform-async-generator-functions",
        ],
    }),
    rExt: 'js'
});


// 开启js压缩
fis.match('*.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js', {
        compress: {
            // drop_console: true
        },
    }),
});

// 已压缩的文件不启用压缩
// fis.match('**min*.{css,js}', {
//     optimizer: null
// });

// 开启图片压缩
fis.match('*.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor'),
});

fis.match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
    useHash: true
});

// 如果要兼容低版本ie显示透明png图片，请使用pngquant作为图片压缩器，
// 否则png图片透明部分在ie下会显示灰色背景
// 使用spmx release命令时，添加--optimize或-o参数即可生效
fis.config.set('settings.optimzier.png-compressor.type', 'pngquant');

// fis3-preprocessor-define
// 开发配置
fis.match('*.js', {
    preprocessor: fis.plugin('define', {
        defines: {
            '__H5_PREFIX': 'http://localhost:5000',
            '__API_PREFIX': 'http://localhost:5000',
            '__WSS_URL': 'ws://h5ws.dev1.qlchat.com/websocket',
            '__WEAPP_ENV_VERSION': 'develop',
        }
    })
});

// fis.match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
//     deploy: fis.plugin('http-push', {
//         receiver: 'http://receiver.dev1.qlchat.com/receiver',
//         to: '/data/nodeapp/resources/rs/weapp',
//     }),
//     domain: 'http://res.dev1.qlchat.com/rs/weapp',
// });

// 研发环境模拟生产环境配置
fis.media('dev_prod')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.qlchat.com',
                '__API_PREFIX': 'http://m.test1.qlchat.com',
                '__WSS_URL': 'wss://ws-h5.qianliao.cn/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'http://res.dev1.qlchat.com/rs/weapp',
    });

// 测试配置
fis.media('test1')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'http://m.test1.qlchat.com',
                '__API_PREFIX': 'http://m.test1.qlchat.com',
                // '__API_PREFIX': 'http://localhost:5000',
                '__WSS_URL': 'ws://h5ws.test1.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'http://res.dev1.qlchat.com/rs/weapp',
    });

fis.media('dev1')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.dev1.qlchat.com',
                '__API_PREFIX': 'https://m.dev1.qlchat.com',
                // '__H5_PREFIX': 'http://localhost:5000',
                // '__API_PREFIX': 'http://192.168.1.112:5000',
                '__WSS_URL': 'ws://h5ws.dev1.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',                
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'https://res.dev1.qlchat.com/rs/weapp',
    });

fis.media('dev2')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.dev2.qlchat.com',
                '__API_PREFIX': 'https://m.dev2.qlchat.com',
                // '__H5_PREFIX': 'http://localhost:5000',
                // '__API_PREFIX': 'http://localhost:5000',
                '__WSS_URL': 'ws://h5ws.dev2.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',                
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'https://res.dev1.qlchat.com/rs/weapp',
    });

fis.media('test2')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'http://m.test2.qlchat.com',
                '__API_PREFIX': 'http://m.test2.qlchat.com',
                '__WSS_URL': 'ws://h5ws.test2.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'http://res.dev1.qlchat.com/rs/weapp',
    });

fis.media('test3')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.test3.qlchat.com',
                '__API_PREFIX': 'http://m.test3.qlchat.com',
                '__WSS_URL': 'ws://h5ws.test3.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        }),
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: false
            },
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'http://res.dev1.qlchat.com/rs/weapp',
    });

fis.media('test4')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.test4.qlchat.com',
                '__API_PREFIX': 'http://m.test4.qlchat.com',
                '__WSS_URL': 'ws://h5ws.test4.qlchat.com/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://receiver.dev1.qlchat.com/receiver',
            to: '/data/nodeapp/resources/rs/weapp',
        }),
        domain: 'http://res.dev1.qlchat.com/rs/weapp',
    });

// 生产配置
fis.media('cdn_prod')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://m.qlchat.com',
                '__API_PREFIX': 'https://h5.qianliao.cn',
                '__WSS_URL': 'wss://ws-h5.qianliao.cn/websocket',
                '__WEAPP_ENV_VERSION': 'release',
            }
        }),
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            },
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://47.96.236.73:5000/receiver',
            to: '/data/res/frontend/rs/weapp',
        }),
        domain: 'https://static.qianliaowang.com/frontend/rs/weapp',
    });

// 灰度配置
fis.media('cdn_pre')
    .match('*.js', {
        preprocessor: fis.plugin('define', {
            defines: {
                '__H5_PREFIX': 'https://test.qlchat.com',
                '__API_PREFIX': 'http://121.43.40.171:5000',
                '__WSS_URL': 'wss://ws-h5.qianliao.cn/websocket',
                '__WEAPP_ENV_VERSION': 'develop',
            }
        }),
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: false
            },
        })
    })
    .match('*.{jpg,png,jpeg,gif,ttf,eot,svg,woff}', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://47.96.236.73:5000/receiver',
            to: '/data/res/frontend/rs/weapp',
        }),
        domain: 'https://static.qianliaowang.com/frontend/rs/weapp',
    });

fis.media('debug')
    .match('*.{js,css,png,scss}', {
        useSprite: false,
        optimizer: null,
    });
